import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import FloatingEditor from "@/components/FloatingEditor";

interface Landing {
  id: number;
  clientId: number;
  name: string;
  slug: string;
  title: string | null;
  description: string | null;
  content: string;
  status: string;
  publishedAt: string | null;
  views: number;
  conversions: number;
  conversionRate: string;
  createdAt: string;
  updatedAt: string;
  googleAnalyticsId: string | null;
  metaPixelId: string | null;
}

export default function PublicLanding() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const { data: landing, isLoading } = useQuery<Landing>({
    queryKey: [`/api/public/landings/${slug}`],
  });

  const trackVisitMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/public/landings/${slug}/track-visit`, "POST");
    },
  });

  // Track visit
  useEffect(() => {
    if (landing && slug) {
      trackVisitMutation.mutate();
    }
  }, [landing, slug]);

  // Inject Google Analytics script
  useEffect(() => {
    if (landing?.googleAnalyticsId) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${landing.googleAnalyticsId}`;
      document.head.appendChild(gaScript);

      const gaConfigScript = document.createElement('script');
      gaConfigScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${landing.googleAnalyticsId}');
      `;
      document.head.appendChild(gaConfigScript);

      return () => {
        document.head.removeChild(gaScript);
        document.head.removeChild(gaConfigScript);
      };
    }
  }, [landing?.googleAnalyticsId]);

  // Inject Meta Pixel script
  useEffect(() => {
    if (landing?.metaPixelId) {
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${landing.metaPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);

      const fbNoScript = document.createElement('noscript');
      fbNoScript.innerHTML = `<img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${landing.metaPixelId}&ev=PageView&noscript=1" />`;
      document.body.appendChild(fbNoScript);

      return () => {
        document.head.removeChild(fbScript);
        document.body.removeChild(fbNoScript);
      };
    }
  }, [landing?.metaPixelId]);

  // Inject landing page variables for form submission
  useEffect(() => {
    if (landing && slug) {
      (window as any).LANDING_CLIENT_ID = landing.clientId;
      (window as any).LANDING_SLUG = slug;
    }
  }, [landing, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!landing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600 text-lg">Landing page no encontrada</p>
        </div>
      </div>
    );
  }

  // Check if current user is the owner of the landing
  const isOwner = user && user.id === landing.clientId;

  // Only show inactive landings to the owner
  if (landing.status !== "Activa" && !isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md px-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Página no disponible</h1>
          <p className="text-gray-600">Esta landing page no está activa en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="public-landing">
      <div
        dangerouslySetInnerHTML={{ __html: landing.content }}
        data-testid="landing-content"
      />
      
      {isOwner && (
        <FloatingEditor landingId={landing.id} landingSlug={slug!} />
      )}
    </div>
  );
}

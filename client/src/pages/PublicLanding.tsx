import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Landing } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

export default function PublicLanding() {
  const { slug } = useParams();

  const { data: landing, isLoading } = useQuery<Landing>({
    queryKey: ["/api/public/landings", slug],
  });

  const trackVisitMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(`/api/public/landings/${slug}/track-visit`, {
        method: "POST",
      });
    },
  });

  useEffect(() => {
    if (landing && slug) {
      trackVisitMutation.mutate();
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

  if (landing.status !== "Activa") {
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
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Rocket, Settings, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-primary p-2 rounded-lg group-hover:shadow-glow transition-all duration-300">
              <Rocket className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              LandFlow
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/precios" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/precios') ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Precios
            </Link>
            <Link 
              to="/nosotros" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/nosotros') ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Nosotros
            </Link>
            <Link 
              to="/contacto" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/contacto') ? 'text-primary' : 'text-foreground/80'
              }`}
            >
              Contacto
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/panel">
              <Button variant="ghost" size="icon" title="Mi Panel">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="icon" title="Admin">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button variant="hero" size="sm">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

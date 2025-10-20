import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
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
          
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/registro">
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

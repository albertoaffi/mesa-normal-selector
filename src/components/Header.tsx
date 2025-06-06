
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useBrand } from '@/contexts/BrandContext';

const Header = () => {
  const navigate = useNavigate();
  const { config } = useBrand();

  const brandName = config?.name || 'THE NORMAL';
  const logoUrl = config?.logo_url;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={brandName}
                className="h-8 w-auto"
                onError={(e) => {
                  // Fallback al texto si la imagen falla
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <span 
              className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${logoUrl ? 'hidden' : ''}`}
              style={{ 
                backgroundImage: `linear-gradient(to right, ${config?.primary_color || '#FFD700'}, ${config?.secondary_color || '#9932CC'})` 
              }}
            >
              {brandName}
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Inicio
            </Link>
            <Link to="/reservar" className="text-gray-300 hover:text-white transition-colors">
              Reservar
            </Link>
            <Link to="/guest-list" className="text-gray-300 hover:text-white transition-colors">
              Guest List
            </Link>
            <Link to="/contacto" className="text-gray-300 hover:text-white transition-colors">
              Contacto
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/reservar')}
              style={{
                borderColor: config?.primary_color || undefined,
                color: config?.primary_color || undefined
              }}
            >
              Reservar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

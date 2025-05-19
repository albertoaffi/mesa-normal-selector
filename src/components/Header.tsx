
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="py-6 px-6 md:px-10 flex justify-between items-center backdrop-blur-lg bg-black/80 border-b border-white/10 sticky top-0 z-50">
      <div 
        className="text-3xl md:text-4xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600 hover:opacity-80 transition-opacity"
        onClick={() => navigate('/')}
      >
        THE NORMAL
      </div>
      <nav>
        <ul className="flex items-center space-x-4 md:space-x-6">
          <li className="hidden md:block">
            <Button 
              onClick={() => navigate('/reservar')}
              variant="gold"
              className="transition-all"
            >
              Reservar Mesa
            </Button>
          </li>
          <li className="hidden md:block">
            <Button 
              onClick={() => navigate('/guest-list')}
              variant="purple"
              className="transition-all"
            >
              Guest List
            </Button>
          </li>
          <li>
            <Button 
              onClick={() => navigate('/contacto')}
              variant="glossy"
              className="transition-all"
            >
              Contacto
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

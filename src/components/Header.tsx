
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Ticket, Coffee } from "lucide-react";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
              variant={isActive('/reservar') ? "gold" : "glass"}
              className="transition-all"
              size="sm"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Reservar Mesa
            </Button>
          </li>
          <li className="hidden md:block">
            <Button 
              onClick={() => navigate('/guest-list')}
              variant={isActive('/guest-list') ? "purple" : "glass"}
              className="transition-all"
              size="sm"
            >
              <Ticket className="mr-2 h-4 w-4" />
              Guest List
            </Button>
          </li>
          <li>
            <Button 
              onClick={() => navigate('/contacto')}
              variant={isActive('/contacto') ? "glossy" : "glass"}
              className="transition-all"
              size="sm"
            >
              <Coffee className="mr-2 h-4 w-4" />
              Contacto
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

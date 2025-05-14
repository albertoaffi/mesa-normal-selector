
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="py-4 px-6 md:px-10 flex justify-between items-center border-b border-gray-800">
      <div 
        className="text-3xl md:text-4xl font-bold cursor-pointer bg-clip-text text-transparent bg-gold-gradient"
        onClick={() => navigate('/')}
      >
        THE NORMAL
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <button 
              onClick={() => navigate('/reservar')}
              className="px-4 py-2 rounded-md border border-club-gold/50 bg-black/50 text-club-gold hover:bg-club-gold/10 transition-all"
            >
              Reservar Mesa
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate('/contacto')}
              className="px-4 py-2 rounded-md text-white hover:text-club-gold transition-all"
            >
              Contacto
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

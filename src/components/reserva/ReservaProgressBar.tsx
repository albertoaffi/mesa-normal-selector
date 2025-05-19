
import React from 'react';

interface ReservaProgressBarProps {
  paso: number;
}

const ReservaProgressBar: React.FC<ReservaProgressBarProps> = ({ paso }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso === 1 ? 'bg-club-gold text-black' : 'bg-gray-800 text-white'}`}>
            1
          </div>
          <div className={`h-1 w-16 mx-1 ${paso > 1 ? 'bg-club-gold' : 'bg-gray-800'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso === 2 ? 'bg-club-gold text-black' : 'bg-gray-800 text-white'}`}>
            2
          </div>
          <div className={`h-1 w-16 mx-1 ${paso > 2 ? 'bg-club-gold' : 'bg-gray-800'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso === 3 ? 'bg-club-gold text-black' : 'bg-gray-800 text-white'}`}>
            3
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-400">
        <span>Seleccionar fecha y mesa</span>
        <span>Elegir productos</span>
        <span>Tus datos</span>
      </div>
    </div>
  );
};

export default ReservaProgressBar;

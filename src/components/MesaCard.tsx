
import React from 'react';
import { Card } from "@/components/ui/card";

export interface Mesa {
  id: number;
  nombre: string;
  categoria: 'gold' | 'silver' | 'bronze' | 'purple' | 'red';
  capacidad: number;
  ubicacion: string;
  precioMinimo: number;
  disponible: boolean;
  descripcion: string;
}

interface MesaCardProps {
  mesa: Mesa;
  onSelect: (mesa: Mesa) => void;
  selected: boolean;
}

const MesaCard: React.FC<MesaCardProps> = ({ mesa, onSelect, selected }) => {
  const { nombre, categoria, capacidad, ubicacion, precioMinimo, disponible, descripcion } = mesa;
  
  const categoryClasses = {
    gold: "mesa-gold",
    silver: "mesa-silver",
    bronze: "mesa-bronze",
    purple: "mesa-purple",
    red: "mesa-red",
  };
  
  return (
    <Card 
      className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
        selected ? "ring-2 ring-offset-2 ring-club-gold scale-105" : ""
      } ${!disponible ? "opacity-50" : ""}`}
      onClick={() => disponible && onSelect(mesa)}
    >
      <div className={`h-2 ${categoryClasses[categoria]}`} />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold">{nombre}</h3>
          {!disponible && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
              No disponible
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400 mt-1">Ubicación: {ubicacion}</p>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-sm">
            <span className="block">Capacidad: {capacidad} personas</span>
            <span className="block mt-1">Mínimo consumo: ${precioMinimo}</span>
          </div>
          <div 
            className={`w-3 h-3 rounded-full ${
              disponible ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
        <p className="mt-3 text-sm text-gray-300">{descripcion}</p>
        <button
          disabled={!disponible}
          className={`mt-4 w-full py-2 px-4 rounded ${
            categoria === 'gold' ? 'bg-club-gold text-black font-bold' :
            categoria === 'silver' ? 'bg-club-silver text-black' :
            categoria === 'bronze' ? 'bg-club-bronze text-black' :
            categoria === 'purple' ? 'bg-club-purple text-white' :
            'bg-club-red text-white'
          } ${
            !disponible ? 'cursor-not-allowed' : 'hover:opacity-90'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            disponible && onSelect(mesa);
          }}
        >
          {selected ? 'Seleccionada' : 'Seleccionar mesa'}
        </button>
      </div>
    </Card>
  );
};

export default MesaCard;

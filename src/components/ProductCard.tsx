
import React from 'react';
import { Card } from "@/components/ui/card";

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen?: string;
  descripcion?: string;
}

interface ProductCardProps {
  producto: Producto;
  cantidad: number;
  onChange: (id: number, cantidad: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ producto, cantidad, onChange }) => {
  const { id, nombre, precio, categoria, imagen, descripcion } = producto;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-800/10">
      <div className="aspect-square overflow-hidden">
        <img 
          src={imagen || '/placeholder.svg'} 
          alt={nombre} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{nombre}</h3>
          <span className="text-club-gold font-bold">${precio}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{categoria}</p>
        <p className="mt-2 text-sm text-gray-300 line-clamp-2">{descripcion || 'Sin descripción'}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 hover:border-club-gold"
              onClick={() => onChange(id, Math.max(0, cantidad - 1))}
            >
              -
            </button>
            <span className="w-8 text-center">{cantidad}</span>
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 hover:border-club-gold"
              onClick={() => onChange(id, cantidad + 1)}
            >
              +
            </button>
          </div>
          <span className="text-sm font-medium">
            Total: ${(precio * cantidad).toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;

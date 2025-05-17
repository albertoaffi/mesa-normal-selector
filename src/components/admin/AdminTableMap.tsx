
import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { toast } from "@/hooks/use-toast";

// Updated to match the type in TableManagement.tsx
interface Table {
  id: number;
  nombre: string;
  categoria: 'gold' | 'silver' | 'bronze' | 'purple' | 'red';
  capacidad: number;
  ubicacion: string;
  precioMinimo: number;
  disponible: boolean;
  descripcion: string;
  x?: number;
  y?: number;
}

interface AdminTableMapProps {
  tables: Table[];
  backgroundImage: string;
  onUpdateTable: (table: Table) => void;
}

const AdminTableMap: React.FC<AdminTableMapProps> = ({ tables, backgroundImage, onUpdateTable }) => {
  const [positions, setPositions] = useState<{[key: number]: {x: number, y: number}}>({});
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Initialize positions if they don't exist
  useEffect(() => {
    const newPositions = { ...positions };
    let updated = false;
    
    tables.forEach(table => {
      if (!positions[table.id]) {
        // Start with a default position if x and y are not set
        newPositions[table.id] = { 
          x: table.x || (Math.random() * 200), 
          y: table.y || (Math.random() * 100) 
        };
        updated = true;
      }
    });
    
    if (updated) {
      setPositions(newPositions);
    }
  }, [tables]);
  
  const handleDragStop = (id: number, data: { x: number, y: number }) => {
    // Update position
    setPositions({
      ...positions,
      [id]: { x: data.x, y: data.y }
    });
    
    // Find the table and update it
    const table = tables.find(t => t.id === id);
    if (table) {
      onUpdateTable({
        ...table,
        x: data.x,
        y: data.y
      });
    }
  };

  // Helper function to get the appropriate color for each table category
  const getTableColor = (category: string) => {
    return {
      gold: "bg-club-gold mesa-gold",
      silver: "bg-club-silver mesa-silver",
      bronze: "bg-club-bronze mesa-bronze",
      purple: "bg-club-purple mesa-purple",
      red: "bg-club-red mesa-red"
    }[category] || "bg-gray-200";
  };

  // Helper function to determine the size of the table based on capacity
  const getTableSize = (capacity: number) => {
    if (capacity <= 4) return "w-12 h-12";
    if (capacity <= 8) return "w-16 h-16";
    return "w-20 h-20";
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">Mapa de Mesas</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Arrastra las mesas para posicionarlas en el mapa. Los cambios se guardan automáticamente.
      </p>
      
      <div 
        ref={mapRef}
        className="relative w-full aspect-[1.75/1] border border-gray-300 rounded-lg overflow-hidden mb-4"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundColor: backgroundImage ? 'transparent' : '#1A1A1A',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay text when no background image */}
        {!backgroundImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400">Carga una imagen de fondo para el mapa</p>
          </div>
        )}
        
        {/* Tables */}
        {tables.map(table => (
          <Draggable
            key={table.id}
            defaultPosition={positions[table.id] || { x: 0, y: 0 }}
            position={positions[table.id] || { x: table.x || 0, y: table.y || 0 }}
            grid={[5, 5]}
            bounds="parent"
            onStop={(e, data) => handleDragStop(table.id, data)}
          >
            <div 
              className={`absolute cursor-move ${getTableSize(table.capacidad)} ${getTableColor(table.categoria)} rounded-lg flex flex-col items-center justify-center shadow-lg text-center`}
              style={{
                color: ['gold', 'silver', 'bronze'].includes(table.categoria) ? '#000' : '#fff',
                border: '2px solid rgba(255,255,255,0.3)',
                userSelect: 'none'
              }}
            >
              <span className="text-xs font-bold">{table.nombre}</span>
              <span className="text-[10px]">{table.capacidad}p</span>
            </div>
          </Draggable>
        ))}
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Consejo: Para un mejor posicionamiento, carga primero una imagen del plano del local.</p>
        <p className="mt-1 text-xs">Las mesas nuevas o clonadas aparecerán automáticamente en el mapa.</p>
      </div>
    </div>
  );
};

export default AdminTableMap;

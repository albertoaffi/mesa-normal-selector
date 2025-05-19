
import React, { useEffect, useState } from 'react';
import { Mesa } from './MesaCard';

interface TableMapProps {
  mesas: Mesa[];
  selectedMesa: Mesa | null;
  onSelectMesa: (mesa: Mesa) => void;
  tieneCodigoVIP?: boolean;
}

const TableMap: React.FC<TableMapProps> = ({ mesas, selectedMesa, onSelectMesa, tieneCodigoVIP = false }) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [tablePositions, setTablePositions] = useState<{[key: number]: {x: number, y: number}}>({});
  
  // Load the saved table arrangement from localStorage
  useEffect(() => {
    const savedArrangement = localStorage.getItem('activeTemplate');
    if (savedArrangement) {
      try {
        const template = JSON.parse(savedArrangement);
        
        // Set the background image if available
        if (template.backgroundImage) {
          setBackgroundImage(template.backgroundImage);
        }
        
        // Extract positions from saved tables
        if (template.tables && Array.isArray(template.tables)) {
          const positions: {[key: number]: {x: number, y: number}} = {};
          
          template.tables.forEach((table: any) => {
            // Match saved tables with current mesas by ID or name
            const matchingMesa = mesas.find(mesa => 
              mesa.id === table.id || 
              mesa.nombre === table.nombre
            );
            
            if (matchingMesa && table.x !== undefined && table.y !== undefined) {
              positions[matchingMesa.id] = { x: table.x, y: table.y };
            }
          });
          
          if (Object.keys(positions).length > 0) {
            setTablePositions(positions);
          }
        }
      } catch (error) {
        console.error("Error loading saved table arrangement:", error);
      }
    }
  }, [mesas]);
  
  // Map tables by category for easier rendering
  const tablesByCategory = mesas.reduce((acc, mesa) => {
    if (!acc[mesa.categoria]) {
      acc[mesa.categoria] = [];
    }
    acc[mesa.categoria].push(mesa);
    return acc;
  }, {} as Record<string, Mesa[]>);
  
  // Helper function to get the appropriate color for each table category
  const getTableColor = (category: string, isSelected: boolean, isAvailable: boolean) => {
    if (!isAvailable) return "bg-gray-500 opacity-50";
    
    if (isSelected) {
      return {
        gold: "bg-club-gold ring-4 ring-club-gold animate-pulse-glow",
        silver: "bg-club-silver ring-4 ring-club-silver",
        bronze: "bg-club-bronze ring-4 ring-club-bronze",
        purple: "bg-club-purple ring-4 ring-club-purple",
        red: "bg-club-red ring-4 ring-club-red"
      }[category] || "bg-gray-200";
    }
    
    return {
      gold: "bg-club-gold",
      silver: "bg-club-silver",
      bronze: "bg-club-bronze",
      purple: "bg-club-purple",
      red: "bg-club-red"
    }[category] || "bg-gray-200";
  };

  // Determinar si una mesa está disponible, considerando el código VIP para mesas Gold
  const isMesaSelectable = (mesa: Mesa): boolean => {
    // Si la mesa no está disponible en general, no se puede seleccionar
    if (!mesa.disponible) return false;
    
    // Si es una mesa Gold, solo se puede seleccionar si tiene código VIP
    if (mesa.categoria === 'gold' && !tieneCodigoVIP) {
      return false;
    }
    
    return true;
  };

  // If we have a saved background and positions, use those
  if (backgroundImage && Object.keys(tablePositions).length > 0) {
    return (
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 mb-6">
        <h3 className="text-xl font-semibold mb-4">Mapa de Mesas</h3>
        <div 
          className="relative w-full aspect-[1.75/1] rounded border border-gray-700"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Render tables at their saved positions */}
          {mesas.map(mesa => {
            const position = tablePositions[mesa.id];
            if (!position) return null;
            
            const isSelectable = isMesaSelectable(mesa);
            
            return (
              <div 
                key={mesa.id}
                onClick={() => isSelectable && onSelectMesa(mesa)}
                className={`absolute ${getTableColor(mesa.categoria, selectedMesa?.id === mesa.id, isSelectable)} 
                  rounded-lg flex flex-col items-center justify-center ${isSelectable ? 'cursor-pointer' : 'cursor-not-allowed'} transition-all hover:scale-105`}
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  width: mesa.capacidad <= 4 ? '48px' : mesa.capacidad <= 8 ? '64px' : '80px',
                  height: mesa.capacidad <= 4 ? '48px' : mesa.capacidad <= 8 ? '64px' : '80px',
                }}
              >
                <span className="text-xs font-bold">{mesa.nombre}</span>
                <span className="text-[10px]">{mesa.capacidad} personas</span>
              </div>
            );
          })}
          
          {/* Legend */}
          <div className="absolute bottom-2 right-2 bg-gray-900/80 p-2 rounded-md text-[10px]">
            <div className="flex items-center mb-1"><div className="w-3 h-3 bg-club-gold mr-1 rounded-sm"></div> Gold</div>
            <div className="flex items-center mb-1"><div className="w-3 h-3 bg-club-silver mr-1 rounded-sm"></div> Silver</div>
            <div className="flex items-center mb-1"><div className="w-3 h-3 bg-club-bronze mr-1 rounded-sm"></div> Bronze</div>
            <div className="flex items-center mb-1"><div className="w-3 h-3 bg-club-purple mr-1 rounded-sm"></div> Purple</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-club-red mr-1 rounded-sm"></div> Red</div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to the default layout if no saved arrangement
  return (
    <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 mb-6">
      <h3 className="text-xl font-semibold mb-4">Mapa de Mesas</h3>
      <div className="relative w-full aspect-[1.75/1] bg-gray-800 rounded border border-gray-700">
        {/* DJ Booth */}
        <div className="absolute top-[10%] left-[5%] w-[10%] h-[15%] bg-gray-600 rounded-lg flex items-center justify-center">
          <span className="text-xs text-white font-bold">DJ</span>
        </div>

        {/* VIP Area - Gold Tables */}
        <div className="absolute top-[5%] left-[20%] w-[35%] h-[40%] border border-dashed border-gray-600 rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-2">Área VIP</div>
          <div className="flex flex-wrap gap-3 justify-around">
            {tablesByCategory['gold']?.map(mesa => {
              const isSelectable = isMesaSelectable(mesa);
              return (
                <div 
                  key={mesa.id}
                  onClick={() => isSelectable && onSelectMesa(mesa)}
                  className={`w-[45%] h-12 ${getTableColor('gold', selectedMesa?.id === mesa.id, isSelectable)} rounded-lg flex flex-col items-center justify-center ${isSelectable ? 'cursor-pointer' : 'cursor-not-allowed'} transition-all hover:scale-105`}
                >
                  <span className="text-xs font-bold">{mesa.nombre}</span>
                  <span className="text-[10px]">{mesa.capacidad} personas</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Bar */}
        <div className="absolute top-[60%] left-[40%] w-[20%] h-[15%] bg-gray-600 rounded-lg flex items-center justify-center">
          <span className="text-xs text-white font-bold">Barra</span>
        </div>

        {/* Silver Tables */}
        <div className="absolute top-[10%] right-[10%] w-[25%] h-[35%] border border-dashed border-gray-600 rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-2">Área Silver</div>
          <div className="flex flex-wrap gap-2 justify-around">
            {tablesByCategory['silver']?.map(mesa => {
              const isSelectable = isMesaSelectable(mesa);
              return (
                <div 
                  key={mesa.id}
                  onClick={() => isSelectable && onSelectMesa(mesa)}
                  className={`w-[45%] h-10 ${getTableColor('silver', selectedMesa?.id === mesa.id, isSelectable)} rounded-lg flex flex-col items-center justify-center ${isSelectable ? 'cursor-pointer' : 'cursor-not-allowed'} transition-all hover:scale-105`}
                >
                  <span className="text-xs font-bold">{mesa.nombre}</span>
                  <span className="text-[10px]">{mesa.capacidad} personas</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bronze Tables */}
        <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] border border-dashed border-gray-600 rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-2">Área Bronze</div>
          <div className="flex flex-wrap gap-2 justify-around">
            {tablesByCategory['bronze']?.map(mesa => {
              const isSelectable = isMesaSelectable(mesa);
              return (
                <div 
                  key={mesa.id}
                  onClick={() => isSelectable && onSelectMesa(mesa)}
                  className={`w-[45%] h-10 ${getTableColor('bronze', selectedMesa?.id === mesa.id, isSelectable)} rounded-lg flex flex-col items-center justify-center ${isSelectable ? 'cursor-pointer' : 'cursor-not-allowed'} transition-all hover:scale-105`}
                >
                  <span className="text-xs font-bold">{mesa.nombre}</span>
                  <span className="text-[10px]">{mesa.capacidad} personas</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Purple Tables */}
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] border border-dashed border-gray-600 rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-2">Área Purple</div>
          <div className="flex flex-wrap gap-2 justify-around">
            {tablesByCategory['purple']?.map(mesa => {
              const isSelectable = isMesaSelectable(mesa);
              return (
                <div 
                  key={mesa.id}
                  onClick={() => isSelectable && onSelectMesa(mesa)}
                  className={`w-[45%] h-10 ${getTableColor('purple', selectedMesa?.id === mesa.id, isSelectable)} rounded-lg flex flex-col items-center justify-center ${isSelectable ? 'cursor-pointer' : 'cursor-not-allowed'} transition-all hover:scale-105`}
                >
                  <span className="text-xs font-bold">{mesa.nombre}</span>
                  <span className="text-[10px]">{mesa.capacidad} personas</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Red Tables - Near Dance Floor */}
        <div className="absolute top-[50%] left-[20%] w-[15%] h-[25%] border border-dashed border-gray-600 rounded-lg p-2">
          <div className="text-xs text-gray-400 mb-2">Área Red</div>
          <div className="flex flex-wrap gap-2 justify-around">
            {tablesByCategory['red']?.map(mesa => {
              const isSelectable = isMesaSelectable(mesa);
              return (
                <div 
                  key={mesa.id}
                  onClick={() => isSelectable && onSelectMesa(mesa)}
                  className={`w-full h-10 ${getTableColor('red', selectedMesa?.id === mesa.id, isSelectable)} rounded-lg flex flex-col items-center justify-center ${isSelectable ? 'cursor-pointer' : 'cursor-not-allowed'} transition-all hover:scale-105`}
                >
                  <span className="text-xs font-bold">{mesa.nombre}</span>
                  <span className="text-[10px]">{mesa.capacidad} personas</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dance Floor */}
        <div className="absolute top-[35%] left-[25%] w-[30%] h-[20%] bg-gray-700/50 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-300 font-bold">Pista de Baile</span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 bg-gray-900/80 p-2 rounded-md text-[10px]">
          <div className="flex items-center mb-1"><div className="w-3 h-3 bg-club-gold mr-1 rounded-sm"></div> Gold</div>
          <div className="flex items-center mb-1"><div className="w-3 h-3 bg-club-silver mr-1 rounded-sm"></div> Silver</div>
          <div className="flex items-center mb-1"><div className="w-3 h-3 bg-club-bronze mr-1 rounded-sm"></div> Bronze</div>
          <div className="flex items-center mb-1"><div className="w-3 h-3 bg-club-purple mr-1 rounded-sm"></div> Purple</div>
          <div className="flex items-center"><div className="w-3 h-3 bg-club-red mr-1 rounded-sm"></div> Red</div>
        </div>
      </div>
    </div>
  );
};

export default TableMap;

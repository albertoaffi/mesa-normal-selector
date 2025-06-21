import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Badge } from "@/components/ui/badge";
interface TableData {
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
  tables: TableData[];
  backgroundImage?: string;
  onUpdateTable: (table: TableData) => void;
}
const AdminTableMap: React.FC<AdminTableMapProps> = ({
  tables,
  backgroundImage,
  onUpdateTable
}) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleDrag = (tableId: number, data: any) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      onUpdateTable({
        ...table,
        x: data.x,
        y: data.y
      });
    }
  };
  const getCategoryColor = (categoria: string) => {
    const colors = {
      gold: 'bg-yellow-400 border-yellow-500 text-yellow-900',
      silver: 'bg-gray-300 border-gray-400 text-gray-900',
      bronze: 'bg-orange-400 border-orange-500 text-orange-900',
      purple: 'bg-purple-400 border-purple-500 text-purple-900',
      red: 'bg-red-400 border-red-500 text-red-900'
    };
    return colors[categoria as keyof typeof colors] || colors.bronze;
  };
  return <div className="space-y-4">
      <div className="flex justify-between items-center bg-zinc-950">
        <h3 className="text-lg font-medium">Mapa de Mesas Interactivo</h3>
        <div className="text-sm text-muted-foreground">
          Arrastra las mesas para posicionarlas en el mapa
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['gold', 'silver', 'bronze', 'purple', 'red'].map(categoria => <div key={categoria} className="flex items-center space-x-1">
            <div className={`w-3 h-3 rounded-full ${getCategoryColor(categoria).split(' ')[0]}`}></div>
            <span className="text-xs capitalize text-zinc-950">{categoria}</span>
          </div>)}
      </div>

      {/* Map Container */}
      <div ref={containerRef} className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden" style={{
      height: '600px',
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: backgroundImage ? 'transparent' : '#f8fafc'
    }}>
        {/* Grid overlay for easier positioning */}
        <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
        backgroundSize: '40px 40px'
      }} />

        {/* Tables */}
        {tables.map(table => <Draggable key={table.id} position={{
        x: table.x || 50,
        y: table.y || 50
      }} onStop={(e, data) => handleDrag(table.id, data)} bounds="parent">
            <div className={`absolute cursor-move select-none transition-all duration-200 ${selectedTable === table.id ? 'scale-110 z-10' : 'z-0'}`} onClick={() => setSelectedTable(selectedTable === table.id ? null : table.id)}>
              <div className={`
                  w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center
                  shadow-lg hover:shadow-xl transition-shadow duration-200
                  ${getCategoryColor(table.categoria)}
                  ${selectedTable === table.id ? 'ring-2 ring-blue-500' : ''}
                  ${!table.disponible ? 'opacity-50' : ''}
                `}>
                <div className="text-xs font-bold text-center leading-tight">
                  {table.nombre.split(' ').map(word => word.charAt(0)).join('')}
                </div>
                <div className="text-xs">
                  {table.capacidad}p
                </div>
              </div>
              
              {/* Table info tooltip */}
              {selectedTable === table.id && <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border rounded-lg shadow-lg p-3 min-w-[200px] z-20">
                  <div className="text-sm font-medium mb-1">{table.nombre}</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Capacidad: {table.capacidad} personas</div>
                    <div>Ubicación: {table.ubicacion}</div>
                    <div>Consumo mín: ${table.precioMinimo}</div>
                    <div>
                      <Badge variant={table.disponible ? "default" : "secondary"} className="text-xs">
                        {table.disponible ? 'Disponible' : 'No disponible'}
                      </Badge>
                    </div>
                  </div>
                  {table.descripcion && <div className="text-xs text-gray-500 mt-2 border-t pt-2">
                      {table.descripcion}
                    </div>}
                </div>}
            </div>
          </Draggable>)}

        {/* Instructions overlay when no tables */}
        {tables.length === 0 && <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">No hay mesas para mostrar</div>
              <div className="text-sm">Añade mesas para comenzar a posicionarlas en el mapa</div>
            </div>
          </div>}

        {/* Instructions */}
        {tables.length > 0 && !selectedTable && <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-sm font-medium mb-1">Instrucciones:</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• Arrastra las mesas para posicionarlas</div>
              <div>• Haz clic en una mesa para ver detalles</div>
              <div>• Las posiciones se guardan automáticamente</div>
            </div>
          </div>}
      </div>

      {/* Table Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
        {['gold', 'silver', 'bronze', 'purple', 'red'].map(categoria => {
        const count = tables.filter(t => t.categoria === categoria).length;
        return <div key={categoria} className="text-center p-3 border rounded-lg">
              <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${getCategoryColor(categoria).split(' ')[0]}`}></div>
              <div className="text-sm font-medium capitalize">{categoria}</div>
              <div className="text-xs text-gray-600">{count} mesas</div>
            </div>;
      })}
      </div>
    </div>;
};
export default AdminTableMap;
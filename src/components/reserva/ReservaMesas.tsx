
import React from 'react';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MesaCard, { Mesa } from '@/components/MesaCard';
import TableMap from '@/components/TableMap';

interface ReservaMesasProps {
  fecha: Date | undefined;
  mesasDisponiblesFecha: Mesa[];
  mesaSeleccionada: Mesa | null;
  handleMesaSelect: (mesa: Mesa) => void;
}

const ReservaMesas: React.FC<ReservaMesasProps> = ({
  fecha,
  mesasDisponiblesFecha,
  mesaSeleccionada,
  handleMesaSelect
}) => {
  if (!fecha) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Selecciona una fecha</AlertTitle>
        <AlertDescription>
          Por favor selecciona una fecha para ver las mesas disponibles.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Elige tu mesa para {fecha && format(fecha, "EEEE, d 'de' MMMM", { locale: es })}</h2>
      
      <Tabs defaultValue="mapa">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="mapa">Mapa de Mesas</TabsTrigger>
          <TabsTrigger value="lista">Lista de Mesas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mapa">
          <TableMap 
            mesas={mesasDisponiblesFecha}
            selectedMesa={mesaSeleccionada}
            onSelectMesa={handleMesaSelect}
          />
        </TabsContent>
        
        <TabsContent value="lista">
          <Tabs defaultValue="todas">
            <TabsList className="grid grid-cols-6 mb-6">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="gold" className="mesa-gold">Gold</TabsTrigger>
              <TabsTrigger value="silver" className="mesa-silver">Silver</TabsTrigger>
              <TabsTrigger value="bronze" className="mesa-bronze">Bronze</TabsTrigger>
              <TabsTrigger value="purple" className="mesa-purple">Purple</TabsTrigger>
              <TabsTrigger value="red" className="mesa-red">Red</TabsTrigger>
            </TabsList>
            
            <TabsContent value="todas">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mesasDisponiblesFecha.map(mesa => (
                  <MesaCard 
                    key={mesa.id}
                    mesa={mesa}
                    onSelect={handleMesaSelect}
                    selected={mesaSeleccionada?.id === mesa.id}
                  />
                ))}
              </div>
            </TabsContent>
            
            {["gold", "silver", "bronze", "purple", "red"].map(categoria => (
              <TabsContent key={categoria} value={categoria}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mesasDisponiblesFecha
                    .filter(mesa => mesa.categoria === categoria)
                    .map(mesa => (
                      <MesaCard 
                        key={mesa.id}
                        mesa={mesa}
                        onSelect={handleMesaSelect}
                        selected={mesaSeleccionada?.id === mesa.id}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ReservaMesas;

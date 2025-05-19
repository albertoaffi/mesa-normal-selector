
import React from 'react';
import { CircleDollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard, { Producto } from '@/components/ProductCard';
import { Mesa } from '@/components/MesaCard';

interface ReservaProductosProps {
  mesaSeleccionada: Mesa | null;
  productos: Producto[];
  productosCantidad: Record<number, number>;
  totalProductos: number;
  consumoMinimo: number;
  consumoSuficiente: boolean;
  paqueteRecomendado: Producto | null;
  handleProductCantidadChange: (productoId: number, cantidad: number) => void;
  handleSeleccionarPaquete: () => void;
}

const ReservaProductos: React.FC<ReservaProductosProps> = ({
  mesaSeleccionada,
  productos,
  productosCantidad,
  totalProductos,
  consumoMinimo,
  consumoSuficiente,
  paqueteRecomendado,
  handleProductCantidadChange,
  handleSeleccionarPaquete
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Selecciona tus productos</h2>
        <div className="text-right">
          <p className="text-sm text-gray-400">Mesa seleccionada:</p>
          <p className="font-medium">{mesaSeleccionada?.nombre}</p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5" />
              Consumo mínimo requerido
            </CardTitle>
            <CardDescription>
              Para la mesa {mesaSeleccionada?.nombre} ({mesaSeleccionada?.categoria}), 
              necesitas un consumo mínimo de ${mesaSeleccionada?.precioMinimo}
            </CardDescription>
          </div>
          
          {paqueteRecomendado && !consumoSuficiente && (
            <Button 
              variant="outline" 
              className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
              onClick={handleSeleccionarPaquete}
            >
              Aplicar paquete recomendado
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Consumo actual:</p>
              <p className={`text-xl font-bold ${consumoSuficiente ? 'text-green-500' : 'text-red-500'}`}>
                ${totalProductos}
              </p>
            </div>
            {!consumoSuficiente && (
              <div className="bg-red-900/20 border border-red-900/30 px-4 py-2 rounded-md">
                <p className="text-sm text-red-400">
                  Te faltan ${consumoMinimo - totalProductos} para alcanzar el consumo mínimo
                </p>
              </div>
            )}
            {consumoSuficiente && (
              <div className="bg-green-900/20 border border-green-900/30 px-4 py-2 rounded-md">
                <p className="text-sm text-green-400">
                  ¡Consumo mínimo alcanzado!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {paqueteRecomendado && !consumoSuficiente && (
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-amber-500">Paquete recomendado</CardTitle>
            <CardDescription>
              Te recomendamos este paquete que cumple con el consumo mínimo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-1/4">
                <img 
                  src={paqueteRecomendado.imagen} 
                  alt={paqueteRecomendado.nombre} 
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
              <div className="w-full md:w-3/4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{paqueteRecomendado.nombre}</h3>
                  <p className="text-gray-400">{paqueteRecomendado.descripcion}</p>
                  <p className="text-amber-500 font-bold text-xl mt-2">${paqueteRecomendado.precio}</p>
                </div>
                <Button 
                  onClick={handleSeleccionarPaquete}
                  className="w-full md:w-auto"
                >
                  Añadir paquete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="Paquetes">Paquetes</TabsTrigger>
          <TabsTrigger value="Botellas">Botellas</TabsTrigger>
          <TabsTrigger value="Cervezas">Cervezas</TabsTrigger>
          <TabsTrigger value="Cocteles">Cócteles</TabsTrigger>
          <TabsTrigger value="Alimentos">Alimentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map(producto => (
              <ProductCard 
                key={producto.id}
                producto={producto}
                cantidad={productosCantidad[producto.id] || 0}
                onChange={handleProductCantidadChange}
              />
            ))}
          </div>
        </TabsContent>
        
        {['Paquetes', 'Botellas', 'Cervezas', 'Cocteles', 'Alimentos'].map(cat => (
          <TabsContent key={cat} value={cat}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos
                .filter(producto => producto.categoria === cat)
                .map(producto => (
                  <ProductCard 
                    key={producto.id}
                    producto={producto}
                    cantidad={productosCantidad[producto.id] || 0}
                    onChange={handleProductCantidadChange}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ReservaProductos;

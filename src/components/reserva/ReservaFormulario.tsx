
import React from 'react';
import { CalendarIcon, Users, Info } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Mesa } from '@/components/MesaCard';
import { Producto } from '@/components/ProductCard';

interface ReservaFormularioProps {
  nombre: string;
  setNombre: (nombre: string) => void;
  telefono: string;
  setTelefono: (telefono: string) => void;
  email: string;
  setEmail: (email: string) => void;
  mesaSeleccionada: Mesa | null;
  fecha: Date | undefined;
  hora: string;
  personas: string;
  productos: Producto[];
  productosCantidad: Record<number, number>;
  totalProductos: number;
}

const ReservaFormulario: React.FC<ReservaFormularioProps> = ({
  nombre,
  setNombre,
  telefono,
  setTelefono,
  email,
  setEmail,
  mesaSeleccionada,
  fecha,
  hora,
  personas,
  productos,
  productosCantidad,
  totalProductos
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Tus datos para la reservación</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
            <CardDescription>
              Ingresa tus datos de contacto para la reservación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input 
                id="nombre" 
                placeholder="Tu nombre completo" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input 
                id="telefono" 
                placeholder="Tu número de teléfono" 
                value={telefono} 
                onChange={(e) => setTelefono(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Tu correo electrónico" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Al finalizar la reserva, recibirás un correo electrónico de confirmación con los detalles.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resumen de tu reserva</CardTitle>
            <CardDescription>
              Revisa los detalles de tu reservación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Detalles de la reserva</h3>
                <div className="p-3 bg-gray-900/50 rounded-md">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Fecha y hora:</span>
                    </div>
                    <span className="font-medium">
                      {fecha ? format(fecha, "EEEE, d 'de' MMMM", { locale: es }) : ''} - {hora}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Personas:</span>
                    </div>
                    <span className="font-medium">{personas}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Mesa seleccionada</h3>
                <div className="p-3 bg-gray-900/50 rounded-md">
                  <div className={`h-2 w-24 mb-2 ${mesaSeleccionada?.categoria ? `mesa-${mesaSeleccionada.categoria}` : ''}`} />
                  <p className="font-medium">{mesaSeleccionada?.nombre}</p>
                  <p className="text-sm text-gray-400">Capacidad: {mesaSeleccionada?.capacidad} personas</p>
                  <p className="text-sm text-gray-400">Ubicación: {mesaSeleccionada?.ubicacion}</p>
                  <p className="text-xs bg-gray-800 mt-2 p-1 rounded">Consumo mínimo: ${mesaSeleccionada?.precioMinimo}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Productos seleccionados</h3>
                <div className="space-y-2">
                  {productos
                    .filter(p => (productosCantidad[p.id] || 0) > 0)
                    .map(producto => (
                      <div key={producto.id} className="flex justify-between p-2 bg-gray-900/50 rounded-md">
                        <span>
                          {producto.nombre} x{productosCantidad[producto.id]}
                        </span>
                        <span className="text-club-gold">
                          ${producto.precio * (productosCantidad[producto.id] || 0)}
                        </span>
                      </div>
                    ))}
                    
                  {productos.filter(p => (productosCantidad[p.id] || 0) > 0).length === 0 && (
                    <p className="text-gray-500 text-sm">No hay productos seleccionados</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center font-medium">
                <span>Total:</span>
                <span className="text-xl text-club-gold">${totalProductos}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-900/30 flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-center text-gray-400 flex items-center">
                    <Info className="h-3 w-3 mr-1" /> 
                    Se requiere confirmación de pago al llegar
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    El consumo mínimo se garantiza al llegar. 
                    El cobro total se realizará en el establecimiento.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ReservaFormulario;

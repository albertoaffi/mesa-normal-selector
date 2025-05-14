
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const Confirmacion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservaData = location.state;

  useEffect(() => {
    if (!reservaData) {
      navigate('/reservar');
    }
  }, [reservaData, navigate]);

  if (!reservaData) {
    return null;
  }

  const { mesa, productos, fecha, nombre, total } = reservaData;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gold-gradient">
                ¡Reserva Confirmada!
              </h1>
              <p className="text-gray-400 mt-2">
                Tu mesa está lista para una experiencia inolvidable en The Normal
              </p>
            </div>
            
            <Card className="mb-8 overflow-hidden">
              <div className="h-2 mesa-gold w-full" />
              <CardHeader>
                <CardTitle>Detalles de tu reserva</CardTitle>
                <CardDescription>
                  Guarda esta información para el día de tu visita
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Nombre</h3>
                    <p className="font-medium">{nombre}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Fecha</h3>
                    <p className="font-medium">{formatDate(fecha)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Mesa reservada</h3>
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <div className={`h-2 w-24 mb-2 mesa-${mesa.categoria}`} />
                    <p className="font-medium">{mesa.nombre}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <p className="text-sm text-gray-400">Capacidad: {mesa.capacidad} personas</p>
                      <p className="text-sm text-gray-400">Ubicación: {mesa.ubicacion}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Productos seleccionados</h3>
                  <div className="space-y-2">
                    {productos.map((producto: any) => (
                      <div key={producto.id} className="flex justify-between items-center p-3 bg-gray-900 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden">
                            <img 
                              src={producto.imagen} 
                              alt={producto.nombre} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{producto.nombre}</p>
                            <p className="text-sm text-gray-400">
                              ${producto.precio} x {producto.cantidad}
                            </p>
                          </div>
                        </div>
                        <span className="text-club-gold font-medium">
                          ${producto.precio * producto.cantidad}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-xl font-bold text-club-gold">${total}</span>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 mb-8">
              <h2 className="text-lg font-medium mb-3">Información importante</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <p>Llega 15 minutos antes para agilizar tu ingreso</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <p>Presenta tu confirmación de reserva al llegar</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <p>La reserva es válida hasta 1 hora después de la apertura</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <p>Tus productos estarán listos en tu mesa al llegar</p>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-club-gold text-black hover:bg-opacity-90"
                onClick={() => window.print()}
              >
                Imprimir confirmación
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Confirmacion;

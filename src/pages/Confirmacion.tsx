
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Printer, CreditCard, ReceiptText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const PrintableTicket = ({ reservaData }: { reservaData: any }) => {
  const { mesa, productos, fecha, nombre, total } = reservaData;
  
  return (
    <div className="hidden print:block print:p-0 print:m-0 print:bg-white print:text-black">
      <div className="max-w-[800px] mx-auto p-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-amber-600/10 to-amber-400/5 z-0"></div>
        
        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-400/30"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-400/30"></div>
        
        {/* Logo and header section */}
        <div className="relative z-10 text-center mb-8 border-b-2 border-amber-400/30 pb-6">
          <h1 className="text-4xl font-bold tracking-tight relative inline-block">
            THE NORMAL CLUB
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-400"></div>
          </h1>
          <p className="text-lg mt-2 text-gray-600 font-light">CONFIRMACIÓN DE RESERVA</p>
        </div>
        
        {/* Info sections */}
        <div className="relative z-10 flex justify-between mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm w-[48%]">
            <h2 className="font-bold text-lg border-b border-gray-200 pb-2 mb-2">Detalles del Cliente</h2>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">Nombre:</span> 
              <span className="font-medium">{nombre}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">Fecha:</span> 
              <span className="font-medium">{formatDate(fecha)}</span>
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm w-[48%] text-right">
            <h2 className="font-bold text-lg border-b border-gray-200 pb-2 mb-2">Referencia</h2>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">Código:</span>
              <span className="font-medium">#{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span>
            </p>
            <p className="flex justify-between py-1">
              <span className="text-gray-600">Emitido:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </p>
          </div>
        </div>
        
        {/* Mesa reservada */}
        <div className="relative z-10 mb-6">
          <h2 className="font-bold text-xl border-b border-amber-400/30 pb-2 mb-4">Mesa Reservada</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{mesa.nombre}</p>
                <p className="text-gray-600">Capacidad: {mesa.capacidad} personas</p>
                <p className="text-gray-600">Ubicación: {mesa.ubicacion}</p>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-100 border-2 border-amber-400/30">
                <span className="font-bold text-amber-800">{mesa.capacidad}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Productos seleccionados */}
        <div className="relative z-10 mb-6">
          <h2 className="font-bold text-xl border-b border-amber-400/30 pb-2 mb-4">Productos Seleccionados</h2>
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <thead className="bg-amber-50">
              <tr>
                <th className="text-left py-3 px-4 font-bold border-b-2 border-amber-200">Producto</th>
                <th className="text-center py-3 px-4 font-bold border-b-2 border-amber-200">Cantidad</th>
                <th className="text-center py-3 px-4 font-bold border-b-2 border-amber-200">Precio</th>
                <th className="text-right py-3 px-4 font-bold border-b-2 border-amber-200">Total</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto: any, index: number) => (
                <tr key={producto.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-3 px-4 border-b border-gray-200">{producto.nombre}</td>
                  <td className="text-center py-3 px-4 border-b border-gray-200">{producto.cantidad}</td>
                  <td className="text-center py-3 px-4 border-b border-gray-200">${producto.precio}</td>
                  <td className="text-right py-3 px-4 border-b border-gray-200">${producto.precio * producto.cantidad}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-amber-50">
                <td colSpan={3} className="text-right pt-4 pb-4 px-4 font-bold">Total:</td>
                <td className="text-right pt-4 pb-4 px-4 font-bold">${total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Información importante */}
        <div className="relative z-10 mb-10 bg-amber-50 p-5 rounded-lg border border-amber-200/50">
          <h2 className="font-bold text-xl mb-3">Información Importante</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-2 mt-0.5 text-amber-800 font-bold text-xs">1</div>
              <p>Llega 15 minutos antes para agilizar tu ingreso</p>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-2 mt-0.5 text-amber-800 font-bold text-xs">2</div>
              <p>Presenta esta confirmación de reserva al llegar</p>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-2 mt-0.5 text-amber-800 font-bold text-xs">3</div>
              <p>La reserva es válida hasta 1 hora después de la apertura</p>
            </li>
            <li className="flex items-start">
              <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center mr-2 mt-0.5 text-amber-800 font-bold text-xs">4</div>
              <p>Tus productos estarán listos en tu mesa al llegar</p>
            </li>
          </ul>
        </div>
        
        {/* Footer */}
        <div className="relative z-10 text-center border-t-2 border-amber-400/30 pt-6">
          <p className="font-bold text-lg">¡Gracias por tu reserva en THE NORMAL CLUB!</p>
          <div className="mt-2 text-gray-600">
            <p>Av. Ejemplo 123, Ciudad, CP 12345</p>
            <p>Tel: (555) 123-4567 | info@thenormalclub.com</p>
          </div>
          
          <div className="mt-6 flex justify-center">
            <svg
              className="h-20 w-20"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stylized QR code */}
              <rect x="10" y="10" width="80" height="80" rx="10" stroke="#D4AF37" strokeWidth="2" fill="none" />
              <rect x="20" y="20" width="60" height="60" rx="5" fill="#000" />
              <path
                d="M30 50H70M50 30V70"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          {/* Decorative line */}
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose, onComplete, total }: { isOpen: boolean, onClose: () => void, onComplete: () => void, total: number }) => {
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos de pago",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulación de procesamiento de pago
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "¡Pago procesado con éxito!",
        description: "Tu reserva ha sido confirmada",
      });
      onComplete();
    }, 2000);
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Procesar pago</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>
        
        <Separator className="my-4" />
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="card-number">Número de tarjeta</Label>
              <Input 
                id="card-number" 
                placeholder="1234 5678 9012 3456" 
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="card-name">Nombre en la tarjeta</Label>
              <Input 
                id="card-name" 
                placeholder="John Doe" 
                value={cardName}
                onChange={e => setCardName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry">Fecha de vencimiento</Label>
                <Input 
                  id="expiry" 
                  placeholder="MM/AA" 
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv" 
                  placeholder="123" 
                  value={cvv}
                  onChange={e => setCvv(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div>
              <p className="text-sm text-muted-foreground">Total a pagar:</p>
              <p className="text-xl font-bold">${total}</p>
            </div>
            <Button 
              type="submit" 
              className="bg-club-gold text-black hover:bg-opacity-90"
              disabled={isProcessing}
            >
              {isProcessing ? "Procesando..." : "Pagar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Confirmacion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reservaData = location.state;
  const printRef = useRef<HTMLDivElement>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for successful payment and session ID
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true' && sessionId) {
      setVerifyingPayment(true);
      verifyPayment(sessionId);
    } else if (canceled === 'true') {
      toast({
        title: "Pago cancelado",
        description: "Has cancelado el proceso de pago. Puedes intentarlo más tarde.",
        variant: "destructive",
      });
    }
    
    if (!reservaData) {
      navigate('/reservar');
    }
  }, [searchParams, reservaData, navigate]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { session_id: sessionId }
      });
      
      if (error) throw error;
      
      if (data.status === 'paid' || data.status === 'complete') {
        setIsPaid(true);
        toast({
          title: "¡Pago exitoso!",
          description: "Tu reserva ha sido confirmada y pagada.",
        });
      } else {
        toast({
          title: "Estado del pago",
          description: `El estado de tu pago es: ${data.status}`,
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Error al verificar el pago",
        description: "Hubo un problema al verificar el estado de tu pago.",
        variant: "destructive",
      });
    } finally {
      setVerifyingPayment(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePayment = async () => {
    if (!reservaData) return;
    
    const { mesa, productos, fecha, nombre, total } = reservaData;
    setIsLoading(true);
    
    try {
      // Create a reservation ID
      const reservationId = `RS${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;
      
      // Call the create-checkout edge function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          nombre,
          reservationId,
          total,
          productos,
          mesa,
          fecha
        }
      });
      
      if (error) throw error;
      
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error al procesar el pago",
        description: "No se pudo iniciar el proceso de pago. Intenta de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!reservaData) {
    return null;
  }

  const { mesa, productos, fecha, nombre, total } = reservaData;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="print:hidden">
        <Header />
      </div>
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 print:p-0">
          <div className="max-w-3xl mx-auto print:max-w-full">
            <div className="text-center mb-8 print:hidden">
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
            
            <Card className="mb-8 overflow-hidden print:hidden">
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
              <CardFooter className="flex flex-col items-stretch gap-4">
                <div className={`p-4 rounded-md ${isPaid ? 'bg-green-900/20 border border-green-900/30' : 'bg-amber-900/20 border border-amber-900/30'}`}>
                  <div className="flex items-center gap-2">
                    {isPaid ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <ReceiptText className="h-5 w-5 text-amber-500" />
                    )}
                    <h3 className="font-medium">Estado del pago</h3>
                  </div>
                  <p className={`text-sm mt-1 ${isPaid ? 'text-green-400' : 'text-amber-400'}`}>
                    {isPaid ? 'Pagado correctamente' : 'Pendiente de pago'}
                  </p>
                  {!isPaid && !verifyingPayment && (
                    <Button 
                      onClick={handlePayment} 
                      className="mt-3 w-full bg-club-gold text-black hover:bg-opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pagar ahora
                        </>
                      )}
                    </Button>
                  )}
                  {verifyingPayment && (
                    <div className="mt-3 flex items-center justify-center text-amber-400">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando pago...
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <Button 
                  onClick={handlePrint} 
                  className="flex items-center gap-2"
                  variant={isPaid ? "default" : "outline"}
                >
                  <Printer className="h-5 w-5" />
                  Imprimir confirmación
                </Button>
              </CardFooter>
            </Card>
            
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 mb-8 print:hidden">
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
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden">
              <Button 
                className="bg-club-gold text-black hover:bg-opacity-90"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
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
        
        {/* Versión para impresión */}
        <div ref={printRef}>
          <PrintableTicket reservaData={reservaData} />
        </div>
      </main>
      
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default Confirmacion;

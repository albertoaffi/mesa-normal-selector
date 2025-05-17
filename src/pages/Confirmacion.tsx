
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Printer, CreditCard, receipt as ReceiptIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      <div className="p-8 max-w-[800px] mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">THE NORMAL CLUB</h1>
          <p className="text-lg">Confirmación de reserva</p>
        </div>
        
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="font-bold">Detalles del cliente</h2>
            <p>Nombre: {nombre}</p>
            <p>Fecha: {formatDate(fecha)}</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold">Referencia</h2>
            <p>#{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="font-bold mb-2">Mesa reservada</h2>
          <div className="border p-4 rounded">
            <p className="font-medium">{mesa.nombre}</p>
            <p>Capacidad: {mesa.capacidad} personas</p>
            <p>Ubicación: {mesa.ubicacion}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="font-bold mb-2">Productos seleccionados</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Producto</th>
                <th className="text-center py-2">Cantidad</th>
                <th className="text-center py-2">Precio</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto: any) => (
                <tr key={producto.id} className="border-b">
                  <td className="py-2">{producto.nombre}</td>
                  <td className="text-center py-2">{producto.cantidad}</td>
                  <td className="text-center py-2">${producto.precio}</td>
                  <td className="text-right py-2">${producto.precio * producto.cantidad}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right pt-4 font-bold">Total:</td>
                <td className="text-right pt-4 font-bold">${total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="mb-6">
          <h2 className="font-bold mb-2">Información importante</h2>
          <ul className="list-disc pl-5">
            <li>Llega 15 minutos antes para agilizar tu ingreso</li>
            <li>Presenta esta confirmación de reserva al llegar</li>
            <li>La reserva es válida hasta 1 hora después de la apertura</li>
            <li>Tus productos estarán listos en tu mesa al llegar</li>
          </ul>
        </div>
        
        <div className="text-center mt-8">
          <p>¡Gracias por tu reserva en THE NORMAL CLUB!</p>
          <p className="text-sm">Av. Ejemplo 123, Ciudad, CP 12345</p>
          <p className="text-sm">Tel: (555) 123-4567 | info@thenormalclub.com</p>
        </div>
        
        <div className="text-center mt-6">
          <svg
            className="mx-auto h-12 w-12"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="10" y="10" width="80" height="80" rx="10" fill="black" />
            <path
              d="M30 50H70M50 30V70"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
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
  const reservaData = location.state;
  const printRef = useRef<HTMLDivElement>(null);
  const [isPaid, setIsPaid] = React.useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!reservaData) {
      navigate('/reservar');
    }
  }, [reservaData, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handlePayment = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = () => {
    setIsPaymentModalOpen(false);
    setIsPaid(true);
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
                      <ReceiptIcon className="h-5 w-5 text-amber-500" />
                    )}
                    <h3 className="font-medium">Estado del pago</h3>
                  </div>
                  <p className={`text-sm mt-1 ${isPaid ? 'text-green-400' : 'text-amber-400'}`}>
                    {isPaid ? 'Pagado correctamente' : 'Pendiente de pago'}
                  </p>
                  {!isPaid && (
                    <Button 
                      onClick={handlePayment} 
                      className="mt-3 w-full bg-club-gold text-black hover:bg-opacity-90"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pagar ahora
                    </Button>
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
        
        {/* Modal de pago */}
        <PaymentModal 
          isOpen={isPaymentModalOpen} 
          onClose={() => setIsPaymentModalOpen(false)} 
          onComplete={handlePaymentComplete}
          total={total}
        />
      </main>
      
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default Confirmacion;

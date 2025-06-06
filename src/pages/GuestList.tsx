
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import GuestListConfirmation from '@/components/GuestListConfirmation';
import { supabase } from '@/integrations/supabase/client';

const GuestList = () => {
  const { toast } = useToast();
  
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [invitados, setInvitados] = useState<string>("1");
  const [loading, setLoading] = useState(false);
  
  const [submitted, setSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  
  const generateConfirmationCode = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `GL-${date.getFullYear().toString().slice(2)}${month}${day}${randomDigits}`;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numInvitados = parseInt(invitados);
    
    if (!nombre || !email || !telefono || !fecha || isNaN(numInvitados) || numInvitados < 1) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos correctamente.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const code = generateConfirmationCode();
      
      console.log('Attempting to insert guest list entry:', {
        nombre,
        email,
        telefono,
        fecha: fecha.toISOString().split('T')[0],
        invitados: numInvitados,
        codigo: code
      });

      // Insertar directamente sin autenticación para la guest list pública
      const { error } = await supabase
        .from('guest_list')
        .insert({
          nombre,
          email,
          telefono,
          fecha: fecha.toISOString().split('T')[0],
          invitados: numInvitados,
          codigo: code
        });

      if (error) {
        console.error('Error saving to guest list:', error);
        throw error;
      }

      console.log('Guest list entry saved successfully');
      setConfirmationCode(code);
      setSubmitted(true);
      
      toast({
        title: "¡Registro exitoso!",
        description: "Has sido añadido a nuestra guest list.",
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al registrarte. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvitadosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir números
    if (value === '' || /^\d+$/.test(value)) {
      setInvitados(value);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-2">Guest List</h1>
          <p className="text-center text-gray-500 mb-8">Regístrate para entrar en nuestra lista de invitados</p>
          
          {!submitted ? (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Registro de Guest List</CardTitle>
                <CardDescription>
                  Completa tus datos para añadirte a la lista
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input
                      id="nombre"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      placeholder="Tu número de teléfono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fecha ? (
                            format(fecha, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={fecha}
                          onSelect={setFecha}
                          disabled={(date) => 
                            date < new Date() || 
                            [0, 1, 2, 3].includes(date.getDay()) // Disable Sunday, Monday, Tuesday, Wednesday
                          }
                          className="p-3 pointer-events-auto"
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invitados">Número de invitados</Label>
                    <Input
                      id="invitados"
                      type="text"
                      value={invitados}
                      onChange={handleInvitadosChange}
                      placeholder="1"
                    />
                    <p className="text-xs text-gray-500">
                      Inclúyete a ti mismo en el número total (mínimo 1, máximo 10)
                    </p>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Registrando...' : 'Unirse a la Guest List'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-center text-gray-500 w-full">
                  Al registrarte, aceptas nuestros términos y condiciones.
                </p>
              </CardFooter>
            </Card>
          ) : (
            <GuestListConfirmation
              nombre={nombre}
              email={email}
              telefono={telefono}
              confirmationCode={confirmationCode}
              fecha={fecha ? format(fecha, "EEEE, d 'de' MMMM", { locale: es }) : ""}
              invitados={parseInt(invitados)}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GuestList;

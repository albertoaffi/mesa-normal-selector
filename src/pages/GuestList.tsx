
import React, { useState } from 'react';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, Ticket, Plus, Minus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

// Define types for guest
type Guest = {
  name: string;
  email: string;
  phone: string;
};

const guestSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(10, {
    message: "El teléfono debe tener al menos 10 dígitos.",
  }),
});

const formSchema = z.object({
  primaryGuest: guestSchema,
  additionalGuests: z.array(guestSchema).optional(),
  date: z.date({
    required_error: "Por favor seleccione una fecha.",
  }),
  singleGuest: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const GuestList = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalGuests, setAdditionalGuests] = useState<Guest[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryGuest: {
        name: "",
        email: "",
        phone: "",
      },
      additionalGuests: [],
      singleGuest: true,
    },
  });

  const singleGuestMode = form.watch("singleGuest");

  const addGuest = () => {
    setAdditionalGuests([...additionalGuests, { name: "", email: "", phone: "" }]);
  };

  const removeGuest = (index: number) => {
    const newGuests = [...additionalGuests];
    newGuests.splice(index, 1);
    setAdditionalGuests(newGuests);
  };

  const updateGuestField = (index: number, field: keyof Guest, value: string) => {
    const newGuests = [...additionalGuests];
    newGuests[index] = { ...newGuests[index], [field]: value };
    setAdditionalGuests(newGuests);

    // Update form value
    const currentAdditionalGuests = form.getValues("additionalGuests") || [];
    currentAdditionalGuests[index] = { ...currentAdditionalGuests[index], [field]: value };
    form.setValue("additionalGuests", currentAdditionalGuests);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Add additional guests to form data if not in single guest mode
    if (!singleGuestMode) {
      data.additionalGuests = additionalGuests;
    }

    // Calculate total number of guests
    const totalGuests = singleGuestMode ? 1 : 1 + additionalGuests.length;
    
    // Simulamos una petición a un API
    setTimeout(() => {
      toast({
        title: "¡Registro exitoso!",
        description: `Te has agregado a la lista para el ${format(data.date, "EEEE d 'de' MMMM", { locale: es })}. ${
          totalGuests > 1 ? `Total de invitados: ${totalGuests}.` : ""
        } Recuerda llegar antes de las 11:00 PM para entrada gratis.`,
      });
      setIsSubmitting(false);
      navigate("/");
    }, 1500);
  };

  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <Ticket className="h-12 w-12 text-club-purple" />
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gold-gradient mb-2">Guest List</h1>
              <p className="text-gray-300">Regístrate en nuestra lista y disfruta de <span className="text-club-purple font-bold">entrada gratuita</span> llegando antes de las 11:00 PM.</p>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg p-6 border border-gray-800/80 shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Información de invitados</h3>
                  <div className="flex items-center space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className={singleGuestMode ? "bg-gray-800" : ""}
                      onClick={() => form.setValue("singleGuest", true)}
                    >
                      Individual
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className={!singleGuestMode ? "bg-gray-800" : ""}
                      onClick={() => form.setValue("singleGuest", false)}
                    >
                      Grupo
                    </Button>
                  </div>
                </div>

                <Card className="bg-black/40 border border-gray-800/50">
                  <CardHeader className="pb-2">
                    <h4 className="text-md font-medium">Invitado principal</h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="primaryGuest.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/90">Nombre completo</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Tu nombre" 
                                {...field}
                                className="bg-black/50 border-gray-700 focus:border-club-purple" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="primaryGuest.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/90">Teléfono</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Tu teléfono" 
                                {...field}
                                className="bg-black/50 border-gray-700 focus:border-club-purple" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="primaryGuest.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/90">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="tu@email.com" 
                              {...field}
                              className="bg-black/50 border-gray-700 focus:border-club-purple" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {!singleGuestMode && (
                  <div className="space-y-4">
                    {additionalGuests.map((guest, index) => (
                      <Card key={index} className="bg-black/40 border border-gray-800/50 relative">
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeGuest(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <CardHeader className="pb-2">
                          <h4 className="text-md font-medium">Invitado adicional {index + 1}</h4>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <FormLabel className="text-white/90">Nombre completo</FormLabel>
                              <Input 
                                placeholder="Nombre" 
                                value={guest.name}
                                onChange={(e) => updateGuestField(index, "name", e.target.value)}
                                className="bg-black/50 border-gray-700 focus:border-club-purple" 
                              />
                            </div>

                            <div>
                              <FormLabel className="text-white/90">Teléfono</FormLabel>
                              <Input 
                                placeholder="Teléfono" 
                                value={guest.phone}
                                onChange={(e) => updateGuestField(index, "phone", e.target.value)}
                                className="bg-black/50 border-gray-700 focus:border-club-purple" 
                              />
                            </div>
                          </div>

                          <div>
                            <FormLabel className="text-white/90">Email</FormLabel>
                            <Input 
                              placeholder="Email" 
                              value={guest.email}
                              onChange={(e) => updateGuestField(index, "email", e.target.value)}
                              className="bg-black/50 border-gray-700 focus:border-club-purple" 
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={addGuest}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" /> Añadir invitado
                    </Button>
                  </div>
                )}

                <Separator />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-white/90">¿Qué día quieres asistir?</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="glass"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "EEEE d 'de' MMMM", { locale: es })
                              ) : (
                                <span>Selecciona un día</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-900 border border-gray-800" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < today || date > nextMonth || 
                              [0, 1, 2, 3].includes(date.getDay()) // Disable Sunday-Wednesday
                            }
                            initialFocus
                            locale={es}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-club-purple hover:bg-club-purple/90 text-white py-6 text-lg shadow-lg shadow-club-purple/20 transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Unirme a la Guest List"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="mt-8 p-6 backdrop-blur-md bg-black/50 border border-gray-800/80 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-club-gold mb-3">Información importante:</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-club-gold">•</span>
                <span>Llegando antes de las 11:00 PM, tendrás <span className="font-bold text-white">entrada gratuita</span>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-club-gold">•</span>
                <span>Después de las 11:00 PM, aplicará el cover normal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-club-gold">•</span>
                <span>Es indispensable presentar una identificación oficial.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-club-gold">•</span>
                <span>La lista solo aplica para las noches de jueves, viernes y sábado.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-club-gold">•</span>
                <span>El registro en la lista no garantiza el acceso si el lugar está a su máxima capacidad.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GuestList;


import React, { useState } from 'react';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, Ticket } from "lucide-react";
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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(10, {
    message: "El teléfono debe tener al menos 10 dígitos.",
  }),
  date: z.date({
    required_error: "Por favor seleccione una fecha.",
  }),
  guests: z.string().transform(val => parseInt(val, 10)).refine(val => val > 0 && val <= 10, {
    message: "El número de invitados debe ser entre 1 y 10.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const GuestList = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guests: "1",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    // Simulamos una petición a un API
    setTimeout(() => {
      toast({
        title: "¡Registro exitoso!",
        description: `Te has agregado a la lista para el ${format(data.date, "EEEE d 'de' MMMM", { locale: es })}. Recuerda llegar antes de las 11:00 PM para entrada gratis.`,
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

          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="tu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu teléfono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>¿Qué día quieres asistir?</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
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
                          <PopoverContent className="w-auto p-0" align="start">
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

                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de personas</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-club-purple hover:bg-opacity-90 text-white py-6 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Unirme a la Guest List"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="mt-8 p-4 bg-gray-900/30 border border-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold text-club-gold mb-3">Información importante:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Llegando antes de las 11:00 PM, tendrás <span className="font-bold">entrada gratuita</span>.</li>
              <li>• Después de las 11:00 PM, aplicará el cover normal.</li>
              <li>• Es indispensable presentar una identificación oficial.</li>
              <li>• La lista solo aplica para las noches de jueves, viernes y sábado.</li>
              <li>• El registro en la lista no garantiza el acceso si el lugar está a su máxima capacidad.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GuestList;

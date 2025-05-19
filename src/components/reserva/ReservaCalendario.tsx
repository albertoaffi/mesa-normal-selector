
import React from 'react';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ReservaCalendarioProps {
  fecha: Date | undefined;
  setFecha: (date: Date | undefined) => void;
  eventosEspeciales: {
    fecha: Date;
    nombre: string;
    descripcion: string;
  }[];
}

const ReservaCalendario: React.FC<ReservaCalendarioProps> = ({
  fecha,
  setFecha,
  eventosEspeciales
}) => {
  // Filter out past dates, limit to next 30 days, and block Sunday(0), Monday(1), Tuesday(2), Wednesday(3)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  // Marcar días con eventos especiales en el calendario
  const eventDays = eventosEspeciales.map(evento => evento.fecha);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" /> 
          Selecciona una fecha
        </CardTitle>
        <CardDescription>
          Reserva con hasta 30 días de anticipación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={fecha}
          onSelect={setFecha}
          disabled={(date) => 
            date < today || 
            date > maxDate || 
            [0, 1, 2, 3].includes(date.getDay()) // Block Sunday(0), Monday(1), Tuesday(2), Wednesday(3)
          }
          modifiers={{
            event: eventDays
          }}
          modifiersStyles={{
            event: {
              color: '#f59e0b',
              fontWeight: 'bold',
              textDecoration: 'underline'
            }
          }}
          className="p-0 pointer-events-auto border rounded-md"
          locale={es}
        />
        
        {eventosEspeciales.some(evento => 
          fecha && evento.fecha.toDateString() === fecha.toDateString()
        ) && (
          <Alert className="mt-4 bg-amber-900/20 border-amber-900/30">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <AlertTitle className="text-amber-400">Evento especial</AlertTitle>
            <AlertDescription>
              {eventosEspeciales
                .find(evento => fecha && evento.fecha.toDateString() === fecha.toDateString())
                ?.descripcion
              }
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            Eventos especiales
          </p>
          <p className="text-sm text-muted-foreground">
            Abierto solo jueves, viernes y sábado
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservaCalendario;

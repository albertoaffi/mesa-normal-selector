
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
        <CardTitle className="flex items-center gap-2 text-high-contrast">
          <CalendarIcon className="h-5 w-5" /> 
          Selecciona una fecha
        </CardTitle>
        <CardDescription className="text-muted-contrast">
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
          className="p-0 pointer-events-auto border rounded-md bg-card text-foreground"
          locale={es}
          classNames={{
            day_selected: "bg-amber-500 text-black font-bold hover:bg-amber-400 hover:text-black",
            day_today: "bg-muted text-muted-foreground border border-primary",
            day: "text-foreground hover:bg-accent hover:text-accent-foreground",
            head_cell: "text-muted-foreground",
            caption: "text-foreground",
            nav_button: "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
          }}
        />
        
        {eventosEspeciales.some(evento => 
          fecha && evento.fecha.toDateString() === fecha.toDateString()
        ) && (
          <Alert className="mt-4 bg-amber-900/20 border-amber-900/30">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <AlertTitle className="text-amber-400">Evento especial</AlertTitle>
            <AlertDescription className="text-amber-100">
              {eventosEspeciales
                .find(evento => fecha && evento.fecha.toDateString() === fecha.toDateString())
                ?.descripcion
              }
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-4">
          <p className="text-sm text-muted-contrast flex items-center gap-1 mb-1">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            Eventos especiales
          </p>
          <p className="text-sm text-muted-contrast">
            Abierto solo jueves, viernes y sábado
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservaCalendario;

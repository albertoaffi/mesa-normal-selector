
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GuestListEntry } from '@/types/guestList';

interface GuestListCalendarViewProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  guestList: GuestListEntry[];
}

const GuestListCalendarView = ({ selectedDate, onDateSelect, guestList }: GuestListCalendarViewProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center text-muted-foreground mb-6">
          Vista de calendario de invitados por día
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="p-3 pointer-events-auto mx-auto"
          locale={es}
        />
        
        {selectedDate && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">
              Invitados para {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
            </h3>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Invitados</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guestList
                    .filter(guest => selectedDate && new Date(guest.fecha).toDateString() === selectedDate.toDateString())
                    .map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{guest.nombre}</div>
                            <div className="text-sm text-muted-foreground">{guest.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{guest.invitados}</TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                            guest.checked_in 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {guest.checked_in ? 'Registrado' : 'Pendiente'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GuestListCalendarView;

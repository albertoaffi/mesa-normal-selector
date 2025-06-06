
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, QrCode, Trash } from "lucide-react";
import { format } from "date-fns";
import { GuestListEntry } from '@/types/guestList';

interface GuestListTableProps {
  filteredGuests: GuestListEntry[];
  onCheckIn: (entry: GuestListEntry) => void;
  onDelete: (entry: GuestListEntry) => void;
  onViewQR: (entry: GuestListEntry) => void;
}

const GuestListTable = ({ filteredGuests, onCheckIn, onDelete, onViewQR }: GuestListTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Invitados</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGuests.length > 0 ? (
            filteredGuests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{guest.nombre}</div>
                    <div className="text-sm text-muted-foreground">{guest.email}</div>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(guest.fecha), "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    {guest.codigo}
                  </code>
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
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => onCheckIn(guest)}>
                      <ClipboardCheck className={`h-4 w-4 ${guest.checked_in ? 'text-green-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onViewQR(guest)}>
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(guest)}>
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No se encontraron invitados con los filtros seleccionados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GuestListTable;


import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GuestListEntry } from '@/types/guestList';

interface QRCodeModalProps {
  guest: GuestListEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal = ({ guest, isOpen, onClose }: QRCodeModalProps) => {
  if (!isOpen || !guest) return null;

  const getStatusColor = (status: boolean) => {
    return status ? "bg-green-500" : "bg-yellow-500";
  };

  const getStatusText = (status: boolean) => {
    return status ? "REGISTRADO" : "PENDIENTE";
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Código QR para {guest.nombre}</CardTitle>
          <CardDescription>Código: {guest.codigo}</CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant={guest.checked_in ? "default" : "secondary"}
              className={`${getStatusColor(guest.checked_in)} text-white font-bold`}
            >
              {getStatusText(guest.checked_in)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {guest.invitados} invitado{guest.invitados > 1 ? 's' : ''}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="p-4 bg-white rounded-lg">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                JSON.stringify({
                  code: guest.codigo,
                  name: guest.nombre,
                  email: guest.email,
                  guests: guest.invitados,
                  status: guest.checked_in ? 'REGISTRADO' : 'PENDIENTE',
                  date: guest.fecha
                })
              )}`} 
              alt="QR Code" 
              className="w-48 h-48"
            />
          </div>
        </CardContent>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div><strong>Email:</strong> {guest.email}</div>
            <div><strong>Teléfono:</strong> {guest.telefono}</div>
            <div><strong>Fecha:</strong> {new Date(guest.fecha).toLocaleDateString()}</div>
            <div className="flex items-center gap-2">
              <strong>Estado:</strong> 
              <Badge 
                className={`${getStatusColor(guest.checked_in)} text-white text-xs px-2 py-1`}
              >
                {getStatusText(guest.checked_in)}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onClose}>Cerrar</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QRCodeModal;

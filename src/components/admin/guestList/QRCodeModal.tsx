
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GuestListEntry } from '@/types/guestList';

interface QRCodeModalProps {
  guest: GuestListEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal = ({ guest, isOpen, onClose }: QRCodeModalProps) => {
  if (!isOpen || !guest) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Código QR para {guest.nombre}</CardTitle>
          <CardDescription>Código: {guest.codigo}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="p-4 bg-white rounded-lg">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                JSON.stringify({
                  code: guest.codigo,
                  name: guest.nombre,
                  email: guest.email
                })
              )}`} 
              alt="QR Code" 
              className="w-48 h-48"
            />
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

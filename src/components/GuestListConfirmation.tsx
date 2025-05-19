
import React from 'react';
import { Check, QrCode, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GuestListConfirmationProps {
  nombre: string;
  email: string;
  telefono: string;
  confirmationCode: string;
  fecha: string;
  invitados: number;
}

const GuestListConfirmation: React.FC<GuestListConfirmationProps> = ({
  nombre, 
  email,
  telefono,
  confirmationCode,
  fecha,
  invitados
}) => {
  const { toast } = useToast();
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(confirmationCode);
    toast({
      title: "Código copiado",
      description: "El código de confirmación ha sido copiado al portapapeles.",
    });
  };
  
  // Generar un QR simplificado con el código de confirmación (esto es una simulación, en producción usaría una librería como qrcode.react)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    JSON.stringify({
      code: confirmationCode,
      name: nombre,
      email: email
    })
  )}`;
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-center text-green-600 dark:text-green-400">¡Registro Exitoso!</CardTitle>
        <CardDescription className="text-center">
          Has sido añadido a nuestra Guest List
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="mb-4 p-2 bg-white rounded-lg">
            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
          </div>
          
          <div className="border rounded-md p-3 flex items-center justify-between w-full mb-4">
            <div className="flex items-center">
              <QrCode className="h-4 w-4 mr-2 text-primary" />
              <span className="font-mono font-bold">{confirmationCode}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCopyCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 w-full">
            <p><strong>Nombre:</strong> {nombre}</p>
            <p><strong>Fecha:</strong> {fecha}</p>
            <p><strong>Invitados:</strong> {invitados}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="text-sm text-center text-gray-500">
          Presenta este código QR en la entrada del club.
          Al llegar, nuestro staff escaneará tu código para verificar tu registro.
        </p>
      </CardFooter>
    </Card>
  );
};

export default GuestListConfirmation;

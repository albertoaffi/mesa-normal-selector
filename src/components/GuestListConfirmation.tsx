
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Users, Ticket, Share2 } from "lucide-react";
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

  const handleShare = () => {
    const message = `¡Estoy en la Guest List de The Normal! 🎉\n\nCódigo: ${confirmationCode}\nFecha: ${fecha}\nPersonas: ${invitados}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Guest List - The Normal',
        text: message
      });
    } else {
      navigator.clipboard.writeText(message);
      toast({
        title: "Información copiada",
        description: "Los detalles han sido copiados al portapapeles.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">¡Registro Exitoso!</CardTitle>
          <CardDescription>
            Has sido añadido a nuestra Guest List
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Confirmation Code */}
          <div className="text-center bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-gray-600 mb-1">Código de Confirmación</div>
            <div className="text-2xl font-mono font-bold text-gray-900 mb-3">
              {confirmationCode}
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyCode}>
              <Ticket className="mr-2 h-4 w-4" />
              Copiar Código
            </Button>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Fecha</div>
                <div className="text-sm text-gray-600">{fecha}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Invitados</div>
                <div className="text-sm text-gray-600">{invitados} personas</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Instrucciones Importantes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Presenta este código en la entrada</li>
              <li>• Llega antes de las 11:30 PM</li>
              <li>• Trae identificación válida</li>
              <li>• El código es válido solo para la fecha indicada</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center text-sm text-gray-600">
            <p>Datos registrados:</p>
            <p>{nombre}</p>
            <p>{email}</p>
            <p>{telefono}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleShare} className="w-full" variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Compartir Detalles
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Volver al Inicio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code placeholder */}
      <Card className="mt-6">
        <CardContent className="p-6 text-center">
          <div className="bg-white p-4 rounded-lg inline-block">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                JSON.stringify({
                  code: confirmationCode,
                  name: nombre,
                  email: email,
                  date: fecha,
                  guests: invitados
                })
              )}`} 
              alt="QR Code" 
              className="w-32 h-32 mx-auto"
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Escanea este código QR en la entrada
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestListConfirmation;


import React from 'react';
import { Info, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ReservaDetallesProps {
  hora: string;
  setHora: (hora: string) => void;
  personas: string;
  setPersonas: (personas: string) => void;
  codigoVIP: string;
  setCodigoVIP: (codigo: string) => void;
  tieneCodigoVIP: boolean;
  validarCodigoVIP: () => void;
  tieneMesasPremiumAccesibles: boolean;
  horariosDisponibles: string[];
}

const ReservaDetalles: React.FC<ReservaDetallesProps> = ({
  hora,
  setHora,
  personas,
  setPersonas,
  codigoVIP,
  setCodigoVIP,
  tieneCodigoVIP,
  validarCodigoVIP,
  tieneMesasPremiumAccesibles,
  horariosDisponibles
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la reserva</CardTitle>
        <CardDescription>
          Selecciona la hora y el número de personas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hora">Hora de llegada</Label>
            <Select value={hora} onValueChange={setHora}>
              <SelectTrigger id="hora">
                <SelectValue placeholder="Selecciona una hora" />
              </SelectTrigger>
              <SelectContent>
                {horariosDisponibles.map((horario) => (
                  <SelectItem key={horario} value={horario}>
                    {horario}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="personas">Número de personas</Label>
            <Select value={personas} onValueChange={setPersonas}>
              <SelectTrigger id="personas">
                <SelectValue placeholder="Número de personas" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'persona' : 'personas'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2 pt-2">
            <Label>¿Tienes un código VIP?</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Ingresa tu código VIP"
                value={codigoVIP}
                onChange={(e) => setCodigoVIP(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={validarCodigoVIP} disabled={!codigoVIP}>
                Validar
              </Button>
            </div>
            
            {tieneCodigoVIP && (
              <p className="text-sm text-green-500 mt-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> Código VIP válido. Tienes acceso a mesas premium.
              </p>
            )}
            
            {!tieneCodigoVIP && !tieneMesasPremiumAccesibles && (
              <p className="text-sm text-amber-500 mt-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> Las mesas Gold solo están disponibles con reserva anticipada o código VIP.
              </p>
            )}
            
            {!tieneCodigoVIP && tieneMesasPremiumAccesibles && (
              <p className="text-sm text-green-500 mt-2 flex items-center">
                <Info className="h-4 w-4 mr-1" /> Estás dentro del horario de reserva anticipada. Puedes seleccionar cualquier mesa disponible.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservaDetalles;

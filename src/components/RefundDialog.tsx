
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TicketMinus } from "lucide-react";

const RefundDialog = () => {
  const [open, setOpen] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reservationCode.trim() || !name.trim() || !phone.trim()) {
      toast({
        title: "Información incompleta",
        description: "Por favor completa todos los campos del formulario",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de reembolso ha sido recibida. Te contactaremos pronto.",
      });
      
      // Reset form
      setReservationCode('');
      setName('');
      setPhone('');
      setIsSubmitting(false);
      setOpen(false);
    }, 1500);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="rounded-md flex gap-2 items-center bg-black/30 border-white/10 hover:bg-black/40 text-white"
        >
          <TicketMinus className="h-4 w-4" />
          Solicitar Reembolso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-md bg-black/70 border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Solicitud de Reembolso</DialogTitle>
          <DialogDescription className="text-gray-300">
            Ingresa los detalles de tu reservación para solicitar un reembolso.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código de Reservación</Label>
            <Input
              id="code"
              value={reservationCode}
              onChange={(e) => setReservationCode(e.target.value)}
              placeholder="Ej: RS12345"
              className="bg-black/40 border-white/20 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre y apellido"
              className="bg-black/40 border-white/20 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Número de Teléfono</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Teléfono de contacto"
              className="bg-black/40 border-white/20 text-white"
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="border border-white/10 text-white hover:bg-white/10"
              type="button"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="gold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Solicitar Reembolso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;

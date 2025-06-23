
import { useToast } from "@/hooks/use-toast";
import { Mesa } from '@/components/MesaCard';
import { Producto } from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';

interface UseReservaValidationProps {
  fecha: Date | undefined;
  mesaSeleccionada: Mesa | null;
  hora: string;
  personas: string;
  nombre: string;
  telefono: string;
  email: string;
  productos: Producto[];
  productosCantidad: Record<number, number>;
  totalProductos: number;
  consumoMinimo: number;
  consumoSuficiente: boolean;
  tieneCodigoVIP: boolean;
  codigoVIP: string;
  usarCodigo: (codigo: string) => Promise<void>;
}

export const useReservaValidation = ({
  fecha,
  mesaSeleccionada,
  hora,
  personas,
  nombre,
  telefono,
  email,
  productos,
  productosCantidad,
  totalProductos,
  consumoMinimo,
  consumoSuficiente,
  tieneCodigoVIP,
  codigoVIP,
  usarCodigo
}: UseReservaValidationProps) => {
  const { toast } = useToast();

  const crearReserva = async () => {
    try {
      if (!mesaSeleccionada || !fecha) {
        throw new Error('Datos incompletos para crear reserva');
      }

      // Crear la reserva
      const { data: reserva, error: reservaError } = await supabase
        .from('reservas')
        .insert({
          mesa_id: mesaSeleccionada.id,
          nombre,
          email,
          telefono,
          fecha: fecha.toISOString().split('T')[0],
          hora,
          personas: parseInt(personas),
          total: totalProductos,
          codigo_vip: tieneCodigoVIP ? codigoVIP : null,
          estado: 'pendiente'
        })
        .select()
        .single();

      if (reservaError) throw reservaError;

      // Crear los productos de la reserva
      const productosReserva = productos
        .filter(p => (productosCantidad[p.id] || 0) > 0)
        .map(p => ({
          reserva_id: reserva.id,
          producto_id: p.id,
          cantidad: productosCantidad[p.id],
          precio_unitario: p.precio
        }));

      if (productosReserva.length > 0) {
        const { error: productosError } = await supabase
          .from('reserva_productos')
          .insert(productosReserva);

        if (productosError) throw productosError;
      }

      // Usar el código VIP si se aplicó
      if (tieneCodigoVIP && codigoVIP) {
        await usarCodigo(codigoVIP);
      }

      return reserva.id;
    } catch (error) {
      console.error('Error creating reserva:', error);
      throw error;
    }
  };

  const validateStep = (paso: number) => {
    if (paso === 1) {
      if (!fecha) {
        toast({
          title: "Selecciona una fecha",
          description: "Debes seleccionar una fecha para continuar",
          variant: "destructive",
        });
        return false;
      }
      
      if (!mesaSeleccionada) {
        toast({
          title: "Selecciona una mesa",
          description: "Debes seleccionar una mesa para continuar",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } else if (paso === 2) {
      if (!consumoSuficiente) {
        toast({
          title: "Consumo mínimo no alcanzado",
          description: `Debes seleccionar productos por al menos $${consumoMinimo}`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    } else if (paso === 3) {
      if (!nombre || !telefono || !email) {
        toast({
          title: "Datos incompletos",
          description: "Por favor completa todos los campos del formulario",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }
    
    return false;
  };

  return {
    crearReserva,
    validateStep
  };
};

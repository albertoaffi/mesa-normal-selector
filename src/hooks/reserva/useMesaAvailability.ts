
import { supabase } from '@/integrations/supabase/client';

export const checkMesaDisponibilidad = async (mesaId: number, fecha: Date, tieneCodigoVIP: boolean): Promise<{ disponible: boolean, motivo?: string }> => {
  try {
    // Verificar reservas existentes para esa mesa y fecha
    const { data: reservas, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('mesa_id', mesaId)
      .eq('fecha', fecha.toISOString().split('T')[0])
      .in('estado', ['pendiente', 'confirmada']);

    if (error) {
      console.error('Error checking availability:', error);
      return { disponible: false, motivo: "Error al verificar disponibilidad" };
    }

    if (reservas && reservas.length > 0) {
      return { disponible: false, motivo: "Mesa ya reservada para esta fecha" };
    }

    // Verificar si es mesa Gold y requiere código VIP
    const { data: mesa } = await supabase
      .from('mesas')
      .select('categoria')
      .eq('id', mesaId)
      .single();

    if (mesa?.categoria === 'gold' && !tieneCodigoVIP) {
      return { disponible: false, motivo: "Mesa Gold solo disponible con código VIP" };
    }

    return { disponible: true };
  } catch (error) {
    console.error('Error in checkMesaDisponibilidad:', error);
    return { disponible: false, motivo: "Error al verificar disponibilidad" };
  }
};

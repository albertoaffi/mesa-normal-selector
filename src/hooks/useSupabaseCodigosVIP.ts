
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CodigoVIP {
  id: string;
  codigo: string;
  descripcion: string | null;
  activo: boolean;
  fecha_expiracion: string | null;
  usos_maximos: number | null;
  usos_actuales: number;
  created_at: string;
  updated_at: string;
}

export const useSupabaseCodigosVIP = () => {
  const [codigos, setCodigos] = useState<CodigoVIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCodigos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('codigos_vip')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching codigos VIP:', error);
        setError(error.message);
        return;
      }

      setCodigos(data || []);
    } catch (err) {
      console.error('Error in fetchCodigos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodigos();
  }, []);

  const validarCodigo = async (codigo: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('codigos_vip')
        .select('*')
        .eq('codigo', codigo.toUpperCase())
        .eq('activo', true)
        .single();

      if (error || !data) {
        return false;
      }

      // Verificar si el código ha expirado
      if (data.fecha_expiracion && new Date(data.fecha_expiracion) < new Date()) {
        return false;
      }

      // Verificar si ha alcanzado el límite de usos
      if (data.usos_maximos && data.usos_actuales >= data.usos_maximos) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating codigo VIP:', error);
      return false;
    }
  };

  const usarCodigo = async (codigo: string) => {
    try {
      const { data, error } = await supabase
        .from('codigos_vip')
        .select('usos_actuales')
        .eq('codigo', codigo.toUpperCase())
        .single();

      if (error || !data) throw new Error('Código no encontrado');

      const { error: updateError } = await supabase
        .from('codigos_vip')
        .update({ usos_actuales: data.usos_actuales + 1 })
        .eq('codigo', codigo.toUpperCase());

      if (updateError) throw updateError;

      await fetchCodigos();
    } catch (error) {
      console.error('Error using codigo VIP:', error);
      throw error;
    }
  };

  const createCodigo = async (codigo: Omit<CodigoVIP, 'id' | 'created_at' | 'updated_at' | 'usos_actuales'>) => {
    try {
      const { data, error } = await supabase
        .from('codigos_vip')
        .insert({
          codigo: codigo.codigo.toUpperCase(),
          descripcion: codigo.descripcion,
          activo: codigo.activo,
          fecha_expiracion: codigo.fecha_expiracion,
          usos_maximos: codigo.usos_maximos
        })
        .select()
        .single();

      if (error) throw error;

      await fetchCodigos();
      return data;
    } catch (error) {
      console.error('Error creating codigo VIP:', error);
      throw error;
    }
  };

  const updateCodigo = async (id: string, updates: Partial<CodigoVIP>) => {
    try {
      const { error } = await supabase
        .from('codigos_vip')
        .update({
          codigo: updates.codigo?.toUpperCase(),
          descripcion: updates.descripcion,
          activo: updates.activo,
          fecha_expiracion: updates.fecha_expiracion,
          usos_maximos: updates.usos_maximos
        })
        .eq('id', id);

      if (error) throw error;

      await fetchCodigos();
    } catch (error) {
      console.error('Error updating codigo VIP:', error);
      throw error;
    }
  };

  const deleteCodigo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('codigos_vip')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCodigos();
    } catch (error) {
      console.error('Error deleting codigo VIP:', error);
      throw error;
    }
  };

  return {
    codigos,
    loading,
    error,
    fetchCodigos,
    validarCodigo,
    usarCodigo,
    createCodigo,
    updateCodigo,
    deleteCodigo
  };
};

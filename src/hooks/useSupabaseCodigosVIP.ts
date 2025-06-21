
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
      console.log('Fetching codigos VIP...');
      
      // Hacer la consulta directamente sin políticas RLS problemáticas
      const { data, error } = await supabase
        .from('codigos_vip')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Fetch result:', { data, error });

      if (error) {
        console.error('Error fetching codigos VIP:', error);
        setError(error.message);
        return;
      }

      setCodigos(data || []);
      setError(null);
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
      console.log('Validating VIP code:', codigo);
      const { data, error } = await supabase
        .from('codigos_vip')
        .select('*')
        .eq('codigo', codigo.toUpperCase())
        .eq('activo', true)
        .maybeSingle();

      if (error) {
        console.error('Error validating codigo:', error);
        return false;
      }

      if (!data) {
        console.log('No code found');
        return false;
      }

      // Verificar si el código ha expirado
      if (data.fecha_expiracion && new Date(data.fecha_expiracion) < new Date()) {
        console.log('Code expired');
        return false;
      }

      // Verificar si ha alcanzado el límite de usos
      if (data.usos_maximos && data.usos_actuales >= data.usos_maximos) {
        console.log('Code usage limit reached');
        return false;
      }

      console.log('Code is valid');
      return true;
    } catch (error) {
      console.error('Error validating codigo VIP:', error);
      return false;
    }
  };

  const usarCodigo = async (codigo: string) => {
    try {
      console.log('Using VIP code:', codigo);
      const { data, error } = await supabase
        .from('codigos_vip')
        .select('usos_actuales')
        .eq('codigo', codigo.toUpperCase())
        .maybeSingle();

      if (error || !data) {
        console.error('Error finding code:', error);
        throw new Error('Código no encontrado');
      }

      const { error: updateError } = await supabase
        .from('codigos_vip')
        .update({ usos_actuales: data.usos_actuales + 1 })
        .eq('codigo', codigo.toUpperCase());

      if (updateError) {
        console.error('Error updating code usage:', updateError);
        throw updateError;
      }

      console.log('Code used successfully');
      await fetchCodigos();
    } catch (error) {
      console.error('Error using codigo VIP:', error);
      throw error;
    }
  };

  const createCodigo = async (codigo: Omit<CodigoVIP, 'id' | 'created_at' | 'updated_at' | 'usos_actuales'>) => {
    try {
      console.log('Creating VIP code:', codigo);
      const { data, error } = await supabase
        .from('codigos_vip')
        .insert({
          codigo: codigo.codigo.toUpperCase(),
          descripcion: codigo.descripcion,
          activo: codigo.activo,
          fecha_expiracion: codigo.fecha_expiracion,
          usos_maximos: codigo.usos_maximos,
          usos_actuales: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating codigo:', error);
        throw error;
      }

      console.log('Code created successfully:', data);
      await fetchCodigos();
      return data;
    } catch (error) {
      console.error('Error creating codigo VIP:', error);
      throw error;
    }
  };

  const updateCodigo = async (id: string, updates: Partial<CodigoVIP>) => {
    try {
      console.log('Updating VIP code:', id, updates);
      const updateData: any = {};
      
      if (updates.codigo) updateData.codigo = updates.codigo.toUpperCase();
      if (updates.descripcion !== undefined) updateData.descripcion = updates.descripcion;
      if (updates.activo !== undefined) updateData.activo = updates.activo;
      if (updates.fecha_expiracion !== undefined) updateData.fecha_expiracion = updates.fecha_expiracion;
      if (updates.usos_maximos !== undefined) updateData.usos_maximos = updates.usos_maximos;

      const { error } = await supabase
        .from('codigos_vip')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating codigo:', error);
        throw error;
      }

      console.log('Code updated successfully');
      await fetchCodigos();
    } catch (error) {
      console.error('Error updating codigo VIP:', error);
      throw error;
    }
  };

  const deleteCodigo = async (id: string) => {
    try {
      console.log('Deleting VIP code:', id);
      const { error } = await supabase
        .from('codigos_vip')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting codigo:', error);
        throw error;
      }

      console.log('Code deleted successfully');
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


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Mesa } from '@/components/MesaCard';

export const useSupabaseMesas = () => {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMesas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mesas')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error fetching mesas:', error);
        setError(error.message);
        return;
      }

      const mesasFormatted: Mesa[] = data.map(mesa => ({
        id: mesa.id,
        nombre: mesa.nombre,
        categoria: mesa.categoria as Mesa['categoria'],
        capacidad: mesa.capacidad,
        ubicacion: mesa.ubicacion,
        precioMinimo: mesa.precio_minimo,
        disponible: mesa.disponible,
        descripcion: mesa.descripcion || ''
      }));

      setMesas(mesasFormatted);
    } catch (err) {
      console.error('Error in fetchMesas:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMesas();
  }, []);

  const createMesa = async (mesa: Omit<Mesa, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('mesas')
        .insert({
          nombre: mesa.nombre,
          categoria: mesa.categoria,
          capacidad: mesa.capacidad,
          ubicacion: mesa.ubicacion,
          precio_minimo: mesa.precioMinimo,
          disponible: mesa.disponible,
          descripcion: mesa.descripcion
        })
        .select()
        .single();

      if (error) throw error;

      await fetchMesas();
      return data;
    } catch (error) {
      console.error('Error creating mesa:', error);
      throw error;
    }
  };

  const updateMesa = async (id: number, updates: Partial<Mesa>) => {
    try {
      const { error } = await supabase
        .from('mesas')
        .update({
          nombre: updates.nombre,
          categoria: updates.categoria,
          capacidad: updates.capacidad,
          ubicacion: updates.ubicacion,
          precio_minimo: updates.precioMinimo,
          disponible: updates.disponible,
          descripcion: updates.descripcion
        })
        .eq('id', id);

      if (error) throw error;

      await fetchMesas();
    } catch (error) {
      console.error('Error updating mesa:', error);
      throw error;
    }
  };

  const deleteMesa = async (id: number) => {
    try {
      const { error } = await supabase
        .from('mesas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchMesas();
    } catch (error) {
      console.error('Error deleting mesa:', error);
      throw error;
    }
  };

  return {
    mesas,
    loading,
    error,
    fetchMesas,
    createMesa,
    updateMesa,
    deleteMesa
  };
};

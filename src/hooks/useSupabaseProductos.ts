
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen?: string;
  descripcion?: string;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

export const useSupabaseProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      console.log('Fetching productos...');
      
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Productos fetch result:', { data, error });

      if (error) {
        console.error('Error fetching productos:', error);
        setError(error.message);
        return;
      }

      setProductos(data || []);
      setError(null);
    } catch (err) {
      console.error('Error in fetchProductos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const createProducto = async (producto: Omit<Producto, 'id' | 'created_at' | 'updated_at' | 'disponible'>) => {
    try {
      console.log('Creating producto:', producto);
      const { data, error } = await supabase
        .from('productos')
        .insert({
          nombre: producto.nombre,
          precio: producto.precio,
          categoria: producto.categoria,
          imagen: producto.imagen || null,
          descripcion: producto.descripcion || null,
          disponible: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating producto:', error);
        throw error;
      }

      console.log('Producto created successfully:', data);
      await fetchProductos();
      return data;
    } catch (error) {
      console.error('Error creating producto:', error);
      throw error;
    }
  };

  const updateProducto = async (id: number, updates: Partial<Producto>) => {
    try {
      console.log('Updating producto:', id, updates);
      const { error } = await supabase
        .from('productos')
        .update({
          nombre: updates.nombre,
          precio: updates.precio,
          categoria: updates.categoria,
          imagen: updates.imagen,
          descripcion: updates.descripcion,
          disponible: updates.disponible
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating producto:', error);
        throw error;
      }

      console.log('Producto updated successfully');
      await fetchProductos();
    } catch (error) {
      console.error('Error updating producto:', error);
      throw error;
    }
  };

  const deleteProducto = async (id: number) => {
    try {
      console.log('Deleting producto:', id);
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting producto:', error);
        throw error;
      }

      console.log('Producto deleted successfully');
      await fetchProductos();
    } catch (error) {
      console.error('Error deleting producto:', error);
      throw error;
    }
  };

  return {
    productos,
    loading,
    error,
    fetchProductos,
    createProducto,
    updateProducto,
    deleteProducto
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Producto } from '@/components/ProductCard';

export const useSupabaseProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error fetching productos:', error);
        setError(error.message);
        return;
      }

      const productosFormatted: Producto[] = data.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        imagen: producto.imagen || '',
        descripcion: producto.descripcion || ''
      }));

      setProductos(productosFormatted);
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

  const createProducto = async (producto: Omit<Producto, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .insert({
          nombre: producto.nombre,
          precio: producto.precio,
          categoria: producto.categoria,
          imagen: producto.imagen,
          descripcion: producto.descripcion
        })
        .select()
        .single();

      if (error) throw error;

      await fetchProductos();
      return data;
    } catch (error) {
      console.error('Error creating producto:', error);
      throw error;
    }
  };

  const updateProducto = async (id: number, updates: Partial<Producto>) => {
    try {
      const { error } = await supabase
        .from('productos')
        .update({
          nombre: updates.nombre,
          precio: updates.precio,
          categoria: updates.categoria,
          imagen: updates.imagen,
          descripcion: updates.descripcion
        })
        .eq('id', id);

      if (error) throw error;

      await fetchProductos();
    } catch (error) {
      console.error('Error updating producto:', error);
      throw error;
    }
  };

  const deleteProducto = async (id: number) => {
    try {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', id);

      if (error) throw error;

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

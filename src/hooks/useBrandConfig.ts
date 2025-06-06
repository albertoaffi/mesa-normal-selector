
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BrandConfig {
  id: string;
  name: string;
  logo_url: string | null;
  background_image_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
}

export const useBrandConfig = () => {
  const [config, setConfig] = useState<BrandConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_config')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Error fetching brand config:', error);
        // Create default config if none exists
        await createDefaultConfig();
        return;
      }

      if (data && data.length > 0) {
        setConfig(data[0]);
      } else {
        // No data found, create default
        await createDefaultConfig();
      }
    } catch (error) {
      console.error('Error in fetchConfig:', error);
      // Create default config if there's an error
      await createDefaultConfig();
    } finally {
      setLoading(false);
    }
  };

  const createDefaultConfig = async () => {
    try {
      const defaultConfig = {
        name: 'THE NORMAL',
        primary_color: '#FFD700',
        secondary_color: '#9932CC',
        accent_color: '#FF2400',
        text_color: '#FFFFFF',
        background_color: '#000000'
      };

      const { data, error } = await supabase
        .from('brand_config')
        .insert([defaultConfig])
        .select()
        .single();

      if (error) {
        console.error('Error creating default config:', error);
        return;
      }

      setConfig(data);
    } catch (error) {
      console.error('Error creating default config:', error);
    }
  };

  const updateConfig = async (updates: Partial<BrandConfig>) => {
    if (!config) {
      console.error('No config to update');
      return;
    }

    try {
      console.log('Updating config with:', updates);
      
      const { data, error } = await supabase
        .from('brand_config')
        .update(updates)
        .eq('id', config.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating brand config:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar la configuración: " + error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Config updated successfully:', data);
      setConfig(data);
      toast({
        title: "Configuración actualizada",
        description: "Los cambios se han guardado exitosamente.",
      });
    } catch (error) {
      console.error('Error updating brand config:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    updateConfig,
    refetch: fetchConfig
  };
};

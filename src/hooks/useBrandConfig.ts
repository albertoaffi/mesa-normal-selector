
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
      console.log('Fetching brand config...');
      const { data, error } = await supabase
        .from('brand_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      console.log('Fetch result:', { data, error });

      if (error) {
        console.error('Error fetching brand config:', error);
        // Use default config if there's an error
        const defaultConfig: BrandConfig = {
          id: 'default',
          name: 'THE NORMAL',
          logo_url: null,
          background_image_url: null,
          primary_color: '#FFD700',
          secondary_color: '#9932CC',
          accent_color: '#FF2400',
          text_color: '#FFFFFF',
          background_color: '#000000'
        };
        setConfig(defaultConfig);
        return;
      }

      if (data) {
        console.log('Config found:', data);
        setConfig(data);
      } else {
        console.log('No config found, using defaults');
        // Si no hay config, usar valores por defecto
        const defaultConfig: BrandConfig = {
          id: 'default',
          name: 'THE NORMAL',
          logo_url: null,
          background_image_url: null,
          primary_color: '#FFD700',
          secondary_color: '#9932CC',
          accent_color: '#FF2400',
          text_color: '#FFFFFF',
          background_color: '#000000'
        };
        setConfig(defaultConfig);
      }
    } catch (error) {
      console.error('Error in fetchConfig:', error);
      // Use default config as fallback
      const defaultConfig: BrandConfig = {
        id: 'default',
        name: 'THE NORMAL',
        logo_url: null,
        background_image_url: null,
        primary_color: '#FFD700',
        secondary_color: '#9932CC',
        accent_color: '#FF2400',
        text_color: '#FFFFFF',
        background_color: '#000000'
      };
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<BrandConfig>) => {
    if (!config) {
      console.error('No config to update');
      toast({
        title: "Error",
        description: "No hay configuración disponible para actualizar.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Updating config with:', updates);
      
      if (config.id === 'default') {
        // Si es config por defecto, crear nuevo registro
        const newConfig = {
          name: updates.name || config.name,
          logo_url: updates.logo_url !== undefined ? updates.logo_url : config.logo_url,
          background_image_url: updates.background_image_url !== undefined ? updates.background_image_url : config.background_image_url,
          primary_color: updates.primary_color || config.primary_color,
          secondary_color: updates.secondary_color || config.secondary_color,
          accent_color: updates.accent_color || config.accent_color,
          text_color: updates.text_color || config.text_color,
          background_color: updates.background_color || config.background_color
        };

        console.log('Creating new config:', newConfig);
        
        const { data, error } = await supabase
          .from('brand_config')
          .insert([newConfig])
          .select()
          .single();

        if (error) {
          console.error('Error creating brand config:', error);
          toast({
            title: "Error",
            description: "No se pudo crear la configuración: " + error.message,
            variant: "destructive",
          });
          return;
        }

        console.log('Config created successfully:', data);
        setConfig(data);
      } else {
        // Actualizar registro existente
        console.log('Updating existing config with ID:', config.id);
        
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
      }

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

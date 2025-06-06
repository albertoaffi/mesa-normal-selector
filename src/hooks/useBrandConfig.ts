
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
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching brand config:', error);
        return;
      }

      setConfig(data);
    } catch (error) {
      console.error('Error in fetchConfig:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<BrandConfig>) => {
    if (!config) return;

    try {
      const { error } = await supabase
        .from('brand_config')
        .update(updates)
        .eq('id', config.id);

      if (error) {
        throw error;
      }

      setConfig({ ...config, ...updates });
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

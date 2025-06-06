
import React, { createContext, useContext, useEffect } from 'react';
import { useBrandConfig, BrandConfig } from '@/hooks/useBrandConfig';

interface BrandContextType {
  config: BrandConfig | null;
  loading: boolean;
  updateConfig: (updates: Partial<BrandConfig>) => Promise<void>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config, loading, updateConfig } = useBrandConfig();

  useEffect(() => {
    if (config) {
      console.log('Applying brand config:', config);
      
      // Aplicar estilos CSS custom properties
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', config.primary_color);
      root.style.setProperty('--brand-secondary', config.secondary_color);
      root.style.setProperty('--brand-accent', config.accent_color);
      root.style.setProperty('--brand-text', config.text_color);
      root.style.setProperty('--brand-background', config.background_color);
      
      // Actualizar título de la página
      document.title = config.name || 'THE NORMAL';
    }
  }, [config]);

  return (
    <BrandContext.Provider value={{ config, loading, updateConfig }}>
      {children}
    </BrandContext.Provider>
  );
};

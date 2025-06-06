
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Palette, Upload, Eye, Save } from "lucide-react";
import { useBrandConfig } from '@/hooks/useBrandConfig';

const BrandManagement = () => {
  const { config, loading, updateConfig } = useBrandConfig();
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    background_image_url: '',
    primary_color: '#FFD700',
    secondary_color: '#9932CC',
    accent_color: '#FF2400',
    text_color: '#FFFFFF',
    background_color: '#000000'
  });

  React.useEffect(() => {
    if (config) {
      setFormData({
        name: config.name,
        logo_url: config.logo_url || '',
        background_image_url: config.background_image_url || '',
        primary_color: config.primary_color,
        secondary_color: config.secondary_color,
        accent_color: config.accent_color,
        text_color: config.text_color,
        background_color: config.background_color
      });
    }
  }, [config]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    await updateConfig(formData);
  };

  const handlePreview = () => {
    // Aplicar estilos temporalmente para vista previa
    const root = document.documentElement;
    root.style.setProperty('--primary-color', formData.primary_color);
    root.style.setProperty('--secondary-color', formData.secondary_color);
    root.style.setProperty('--accent-color', formData.accent_color);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuración de Marca</h2>
          <p className="text-muted-foreground">
            Personaliza la apariencia y marca de tu plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Marca</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Mi Club"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">URL del Logo</Label>
              <Input
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => handleInputChange('logo_url', e.target.value)}
                placeholder="https://ejemplo.com/logo.png"
              />
              {formData.logo_url && (
                <div className="mt-2">
                  <img 
                    src={formData.logo_url} 
                    alt="Logo preview" 
                    className="max-h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="background_image_url">URL de Imagen de Fondo</Label>
              <Input
                id="background_image_url"
                value={formData.background_image_url}
                onChange={(e) => handleInputChange('background_image_url', e.target.value)}
                placeholder="https://ejemplo.com/fondo.jpg"
              />
              {formData.background_image_url && (
                <div className="mt-2">
                  <img 
                    src={formData.background_image_url} 
                    alt="Background preview" 
                    className="max-h-32 w-full object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Colores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Esquema de Colores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Color Primario</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    placeholder="#FFD700"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary_color">Color Secundario</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    placeholder="#9932CC"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent_color">Color de Acento</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent_color"
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={formData.accent_color}
                    onChange={(e) => handleInputChange('accent_color', e.target.value)}
                    placeholder="#FF2400"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text_color">Color de Texto</Label>
                <div className="flex gap-2">
                  <Input
                    id="text_color"
                    type="color"
                    value={formData.text_color}
                    onChange={(e) => handleInputChange('text_color', e.target.value)}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={formData.text_color}
                    onChange={(e) => handleInputChange('text_color', e.target.value)}
                    placeholder="#FFFFFF"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="background_color">Color de Fondo</Label>
                <div className="flex gap-2">
                  <Input
                    id="background_color"
                    type="color"
                    value={formData.background_color}
                    onChange={(e) => handleInputChange('background_color', e.target.value)}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={formData.background_color}
                    onChange={(e) => handleInputChange('background_color', e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <Separator />
            
            {/* Vista previa de colores */}
            <div className="space-y-2">
              <Label>Vista Previa de Colores</Label>
              <div className="grid grid-cols-5 gap-2">
                <div className="text-center">
                  <div 
                    className="w-full h-12 rounded border"
                    style={{ backgroundColor: formData.primary_color }}
                  ></div>
                  <p className="text-xs mt-1">Primario</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-12 rounded border"
                    style={{ backgroundColor: formData.secondary_color }}
                  ></div>
                  <p className="text-xs mt-1">Secundario</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-12 rounded border"
                    style={{ backgroundColor: formData.accent_color }}
                  ></div>
                  <p className="text-xs mt-1">Acento</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-12 rounded border"
                    style={{ backgroundColor: formData.text_color }}
                  ></div>
                  <p className="text-xs mt-1">Texto</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-12 rounded border"
                    style={{ backgroundColor: formData.background_color }}
                  ></div>
                  <p className="text-xs mt-1">Fondo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-medium">Instrucciones:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Los cambios se aplicarán inmediatamente después de guardar</li>
              <li>• Para las imágenes, asegúrate de usar URLs accesibles públicamente</li>
              <li>• El logo se mostrará en el header de todas las páginas</li>
              <li>• La imagen de fondo se usará en la página principal</li>
              <li>• Los colores se aplicarán en toda la plataforma</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandManagement;

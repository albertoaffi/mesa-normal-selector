import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Palette, Upload, Eye, Save } from "lucide-react";
import { useBrandConfig } from '@/hooks/useBrandConfig';
const BrandManagement = () => {
  const {
    config,
    loading,
    updateConfig
  } = useBrandConfig();
  const [formData, setFormData] = useState({
    name: 'THE NORMAL',
    logo_url: '',
    background_image_url: '',
    primary_color: '#FFD700',
    secondary_color: '#9932CC',
    accent_color: '#FF2400',
    text_color: '#FFFFFF',
    background_color: '#000000'
  });
  useEffect(() => {
    if (config) {
      console.log('Config loaded in component:', config);
      setFormData({
        name: config.name || 'THE NORMAL',
        logo_url: config.logo_url || '',
        background_image_url: config.background_image_url || '',
        primary_color: config.primary_color || '#FFD700',
        secondary_color: config.secondary_color || '#9932CC',
        accent_color: config.accent_color || '#FF2400',
        text_color: config.text_color || '#FFFFFF',
        background_color: config.background_color || '#000000'
      });
    }
  }, [config]);
  const handleInputChange = (field: string, value: string) => {
    console.log(`Changing ${field} to:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSave = async () => {
    console.log('Saving changes with data:', formData);
    console.log('Current config:', config);
    await updateConfig({
      name: formData.name,
      logo_url: formData.logo_url || null,
      background_image_url: formData.background_image_url || null,
      primary_color: formData.primary_color,
      secondary_color: formData.secondary_color,
      accent_color: formData.accent_color,
      text_color: formData.text_color,
      background_color: formData.background_color
    });
  };
  const handlePreview = () => {
    console.log('Applying preview with colors:', formData);
    // Aplicar estilos CSS custom properties para vista previa
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', formData.primary_color);
    root.style.setProperty('--brand-secondary', formData.secondary_color);
    root.style.setProperty('--brand-accent', formData.accent_color);
    root.style.setProperty('--brand-text', formData.text_color);
    root.style.setProperty('--brand-background', formData.background_color);

    // Actualizar título de la página temporalmente
    document.title = formData.name;
  };
  if (loading) {
    return <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Cargando configuración...</p>
        </div>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800">Configuración de Marca</h2>
          <p className="text-zinc-700">
            Personaliza la apariencia y marca de tu plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview} className="text-white border-white hover:bg-white hover:text-black">
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          <Button onClick={handleSave} className="bg-primary text-black hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Debug info */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="text-sm text-gray-300">
            <p>Config ID: {config?.id || 'No config'}</p>
            <p>Config status: {config ? 'Loaded' : 'Not loaded'}</p>
            <p>Form data status: {JSON.stringify(formData)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información General */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Upload className="w-5 h-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nombre de la Marca</Label>
              <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Ej: Mi Club" className="bg-gray-700 border-gray-600 text-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url" className="text-white">URL del Logo</Label>
              <Input id="logo_url" value={formData.logo_url} onChange={e => handleInputChange('logo_url', e.target.value)} placeholder="https://ejemplo.com/logo.png" className="bg-gray-700 border-gray-600 text-white" />
              {formData.logo_url && <div className="mt-2">
                  <img src={formData.logo_url} alt="Logo preview" className="max-h-16 object-contain" onError={e => {
                e.currentTarget.style.display = 'none';
              }} />
                </div>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="background_image_url" className="text-white">URL de Imagen de Fondo</Label>
              <Input id="background_image_url" value={formData.background_image_url} onChange={e => handleInputChange('background_image_url', e.target.value)} placeholder="https://ejemplo.com/fondo.jpg" className="bg-gray-700 border-gray-600 text-white" />
              {formData.background_image_url && <div className="mt-2">
                  <img src={formData.background_image_url} alt="Background preview" className="max-h-32 w-full object-cover rounded" onError={e => {
                e.currentTarget.style.display = 'none';
              }} />
                </div>}
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Colores */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Palette className="w-5 h-5" />
              Esquema de Colores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color" className="text-white">Color Primario</Label>
                <div className="flex gap-2">
                  <Input id="primary_color" type="color" value={formData.primary_color} onChange={e => handleInputChange('primary_color', e.target.value)} className="w-16 h-10 p-1 rounded bg-gray-700 border-gray-600" />
                  <Input value={formData.primary_color} onChange={e => handleInputChange('primary_color', e.target.value)} placeholder="#FFD700" className="flex-1 bg-gray-700 border-gray-600 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary_color" className="text-white">Color Secundario</Label>
                <div className="flex gap-2">
                  <Input id="secondary_color" type="color" value={formData.secondary_color} onChange={e => handleInputChange('secondary_color', e.target.value)} className="w-16 h-10 p-1 rounded bg-gray-700 border-gray-600" />
                  <Input value={formData.secondary_color} onChange={e => handleInputChange('secondary_color', e.target.value)} placeholder="#9932CC" className="flex-1 bg-gray-700 border-gray-600 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent_color" className="text-white">Color de Acento</Label>
                <div className="flex gap-2">
                  <Input id="accent_color" type="color" value={formData.accent_color} onChange={e => handleInputChange('accent_color', e.target.value)} className="w-16 h-10 p-1 rounded bg-gray-700 border-gray-600" />
                  <Input value={formData.accent_color} onChange={e => handleInputChange('accent_color', e.target.value)} placeholder="#FF2400" className="flex-1 bg-gray-700 border-gray-600 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text_color" className="text-white">Color de Texto</Label>
                <div className="flex gap-2">
                  <Input id="text_color" type="color" value={formData.text_color} onChange={e => handleInputChange('text_color', e.target.value)} className="w-16 h-10 p-1 rounded bg-gray-700 border-gray-600" />
                  <Input value={formData.text_color} onChange={e => handleInputChange('text_color', e.target.value)} placeholder="#FFFFFF" className="flex-1 bg-gray-700 border-gray-600 text-white" />
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="background_color" className="text-white">Color de Fondo</Label>
                <div className="flex gap-2">
                  <Input id="background_color" type="color" value={formData.background_color} onChange={e => handleInputChange('background_color', e.target.value)} className="w-16 h-10 p-1 rounded bg-gray-700 border-gray-600" />
                  <Input value={formData.background_color} onChange={e => handleInputChange('background_color', e.target.value)} placeholder="#000000" className="flex-1 bg-gray-700 border-gray-600 text-white" />
                </div>
              </div>
            </div>

            <Separator className="bg-gray-600" />
            
            {/* Vista previa de colores */}
            <div className="space-y-2">
              <Label className="text-white">Vista Previa de Colores</Label>
              <div className="grid grid-cols-5 gap-2">
                <div className="text-center">
                  <div className="w-full h-12 rounded border border-gray-600" style={{
                  backgroundColor: formData.primary_color
                }}></div>
                  <p className="text-xs mt-1 text-gray-300">Primario</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-12 rounded border border-gray-600" style={{
                  backgroundColor: formData.secondary_color
                }}></div>
                  <p className="text-xs mt-1 text-gray-300">Secundario</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-12 rounded border border-gray-600" style={{
                  backgroundColor: formData.accent_color
                }}></div>
                  <p className="text-xs mt-1 text-gray-300">Acento</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-12 rounded border border-gray-600" style={{
                  backgroundColor: formData.text_color
                }}></div>
                  <p className="text-xs mt-1 text-gray-300">Texto</p>
                </div>
                <div className="text-center">
                  <div className="w-full h-12 rounded border border-gray-600" style={{
                  backgroundColor: formData.background_color
                }}></div>
                  <p className="text-xs mt-1 text-gray-300">Fondo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h4 className="font-medium text-white">Instrucciones:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Los cambios se aplicarán inmediatamente después de guardar</li>
              <li>• Para las imágenes, asegúrate de usar URLs accesibles públicamente</li>
              <li>• El logo se mostrará en el header de todas las páginas</li>
              <li>• La imagen de fondo se usará en la página principal</li>
              <li>• Los colores se aplicarán en toda la plataforma</li>
              <li>• Usa "Vista Previa" para ver los cambios antes de guardar</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default BrandManagement;
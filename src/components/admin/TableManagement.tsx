import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Copy, Save, Template } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import AdminTableMap from './AdminTableMap';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Define the Table interface to ensure type safety
interface TableData {
  id: number;
  nombre: string;
  categoria: 'gold' | 'silver' | 'bronze' | 'purple' | 'red';
  capacidad: number;
  ubicacion: string;
  precioMinimo: number;
  disponible: boolean;
  descripcion: string;
  x?: number;
  y?: number;
}

// Initial sample tables
const initialTables: TableData[] = [
  { id: 1, nombre: "Mesa Gold 1", categoria: "gold", capacidad: 8, ubicacion: "VIP", precioMinimo: 5000, disponible: true, descripcion: "Mesa VIP con vista privilegiada" },
  { id: 2, nombre: "Mesa Silver 1", categoria: "silver", capacidad: 6, ubicacion: "Área Silver", precioMinimo: 3000, disponible: true, descripcion: "Mesa con buena ubicación" },
  { id: 3, nombre: "Mesa Bronze 1", categoria: "bronze", capacidad: 4, ubicacion: "Área Bronze", precioMinimo: 2000, disponible: true, descripcion: "Mesa estándar" },
];

// Template for quick adding tables - now properly typed
const tableTemplates: {
  nombre: string;
  categoria: 'gold' | 'silver' | 'bronze' | 'purple' | 'red';
  capacidad: number;
  ubicacion: string;
  precioMinimo: number;
  disponible: boolean;
  descripcion: string;
}[] = [
  { nombre: "Mesa Gold", categoria: "gold", capacidad: 8, ubicacion: "VIP", precioMinimo: 5000, disponible: true, descripcion: "Mesa VIP con vista privilegiada" },
  { nombre: "Mesa Silver", categoria: "silver", capacidad: 6, ubicacion: "Área Silver", precioMinimo: 3000, disponible: true, descripcion: "Mesa con buena ubicación" },
  { nombre: "Mesa Bronze", categoria: "bronze", capacidad: 4, ubicacion: "Área Bronze", precioMinimo: 2000, disponible: true, descripcion: "Mesa estándar" },
  { nombre: "Mesa Purple", categoria: "purple", capacidad: 4, ubicacion: "Área Purple", precioMinimo: 2500, disponible: true, descripcion: "Mesa zona premium" },
  { nombre: "Mesa Red", categoria: "red", capacidad: 2, ubicacion: "Área Red", precioMinimo: 1500, disponible: true, descripcion: "Mesa cerca de pista" }
];

const TableManagement = () => {
  const [tables, setTables] = useState<TableData[]>(initialTables);
  const [editMode, setEditMode] = useState(false);
  const [currentTable, setCurrentTable] = useState<TableData | null>(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [saveTemplateDialog, setSaveTemplateDialog] = useState(false);
  const [templateName, setTemplateName] = useState(""); 
  const [formData, setFormData] = useState<TableData>({
    id: 0,
    nombre: "",
    categoria: "gold",
    capacidad: 4,
    ubicacion: "",
    precioMinimo: 1000,
    disponible: true,
    descripcion: ""
  });
  
  // Get stored templates from localStorage or initialize empty array
  const getStoredTemplates = () => {
    const storedTemplates = localStorage.getItem('tableTemplates');
    return storedTemplates ? JSON.parse(storedTemplates) : [];
  };
  
  const [savedTemplates, setSavedTemplates] = useState(getStoredTemplates());
  
  // Save current table arrangement as template
  const saveCurrentArrangement = () => {
    if (templateName.trim() === "") {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa un nombre para la plantilla.",
        variant: "destructive"
      });
      return;
    }

    // Create template object with name and tables data
    const newTemplate = {
      id: Date.now(),
      name: templateName,
      tables: tables,
      backgroundImage: backgroundImage
    };

    const updatedTemplates = [...savedTemplates, newTemplate];
    
    // Update state and localStorage
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('tableTemplates', JSON.stringify(updatedTemplates));
    
    // Also save the current state as the "active" template for reservations
    localStorage.setItem('activeTemplate', JSON.stringify({
      tables: tables,
      backgroundImage: backgroundImage
    }));

    toast({
      title: "Plantilla guardada",
      description: `La plantilla "${templateName}" ha sido guardada y activada para reservaciones.`
    });

    // Reset and close dialog
    setTemplateName("");
    setSaveTemplateDialog(false);
  };

  // Load a saved template
  const loadTemplate = (template: any) => {
    setTables(template.tables);
    setBackgroundImage(template.backgroundImage || "");
    
    // Save as active template for reservations
    localStorage.setItem('activeTemplate', JSON.stringify({
      tables: template.tables,
      backgroundImage: template.backgroundImage
    }));
    
    toast({
      title: "Plantilla cargada",
      description: `La plantilla "${template.name}" ha sido cargada y activada para reservaciones.`
    });
  };
  
  // Delete a saved template
  const deleteTemplate = (templateId: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta plantilla?")) {
      const updatedTemplates = savedTemplates.filter((t: any) => t.id !== templateId);
      setSavedTemplates(updatedTemplates);
      localStorage.setItem('tableTemplates', JSON.stringify(updatedTemplates));
      
      toast({
        title: "Plantilla eliminada",
        description: "La plantilla ha sido eliminada correctamente.",
        variant: "destructive"
      });
    }
  };
  
  // Also save current arrangement as active whenever tables are updated
  const updateTablesAndActive = (newTables: TableData[]) => {
    setTables(newTables);
    localStorage.setItem('activeTemplate', JSON.stringify({
      tables: newTables,
      backgroundImage: backgroundImage
    }));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editMode && currentTable) {
      // Edit existing table
      const updatedTables = tables.map(table => 
        table.id === currentTable.id ? { ...formData } : table
      );
      updateTablesAndActive(updatedTables);
      toast({
        title: "Mesa actualizada",
        description: `La mesa ${formData.nombre} ha sido actualizada correctamente.`
      });
    } else {
      // Add new table
      const newId = tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1;
      const updatedTables = [...tables, { ...formData, id: newId }];
      updateTablesAndActive(updatedTables);
      toast({
        title: "Mesa añadida",
        description: `La mesa ${formData.nombre} ha sido añadida correctamente.`
      });
    }
    
    // Reset form
    setShowForm(false);
    setEditMode(false);
    setCurrentTable(null);
    resetForm();
  };
  
  const resetForm = () => {
    setFormData({
      id: 0,
      nombre: "",
      categoria: "gold",
      capacidad: 4,
      ubicacion: "",
      precioMinimo: 1000,
      disponible: true,
      descripcion: ""
    });
  };

  const handleCloneTable = (table: TableData) => {
    const newId = tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1;
    const clonedTable = { 
      ...table, 
      id: newId,
      nombre: `${table.nombre} (Copia)`,
      x: table.x ? table.x + 20 : undefined, // Offset position slightly
      y: table.y ? table.y + 20 : undefined
    };
    
    const updatedTables = [...tables, clonedTable];
    updateTablesAndActive(updatedTables);
    
    toast({
      title: "Mesa clonada",
      description: `La mesa ${table.nombre} ha sido clonada correctamente.`
    });
  };
  
  const handleEditTable = (table: TableData) => {
    setEditMode(true);
    setCurrentTable(table);
    setFormData(table);
    setShowForm(true);
  };
  
  const handleDeleteTable = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta mesa?")) {
      const updatedTables = tables.filter(table => table.id !== id);
      updateTablesAndActive(updatedTables);
      
      toast({
        title: "Mesa eliminada",
        description: "La mesa ha sido eliminada correctamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setBackgroundImage(result);
          
          // Update active template with new background
          const activeTemplate = JSON.parse(localStorage.getItem('activeTemplate') || '{}');
          localStorage.setItem('activeTemplate', JSON.stringify({
            ...activeTemplate,
            backgroundImage: result
          }));
          
          toast({
            title: "Imagen cargada",
            description: "La imagen de fondo ha sido actualizada."
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickAdd = (template: {
    nombre: string;
    categoria: 'gold' | 'silver' | 'bronze' | 'purple' | 'red';
    capacidad: number;
    ubicacion: string;
    precioMinimo: number;
    disponible: boolean;
    descripcion: string;
  }) => {
    const newId = tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1;
    const number = tables.filter(t => t.categoria === template.categoria).length + 1;
    
    const newTable = {
      ...template,
      id: newId,
      nombre: `${template.nombre} ${number}`,
    };
    
    const updatedTables = [...tables, newTable];
    updateTablesAndActive(updatedTables);
    
    toast({
      title: "Mesa añadida",
      description: `${newTable.nombre} ha sido añadida correctamente.`
    });
    
    setShowQuickAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gestión de Mesas</h2>
          <div className="flex gap-2">
            <Button onClick={() => setSaveTemplateDialog(true)} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Guardar Plantilla
            </Button>
            <Button onClick={() => setShowQuickAdd(true)} variant="secondary">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Rápido
            </Button>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Mesa Personalizada
            </Button>
          </div>
        </div>
        
        {/* Save Template Dialog */}
        <Dialog open={saveTemplateDialog} onOpenChange={setSaveTemplateDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Guardar Plantilla de Mesas</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="templateName">Nombre de la Plantilla</Label>
              <Input 
                id="templateName" 
                value={templateName} 
                onChange={(e) => setTemplateName(e.target.value)} 
                placeholder="Ej: Evento Especial, Noche de Viernes, etc."
              />
              <p className="text-sm text-gray-500">
                Esta plantilla guardará la posición actual de todas las mesas y estará disponible para ser utilizada en reservaciones.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveTemplateDialog(false)}>Cancelar</Button>
              <Button onClick={saveCurrentArrangement}>Guardar Plantilla</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Quick Add Dialog */}
        <Dialog open={showQuickAdd} onOpenChange={setShowQuickAdd}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir Mesa Rápidamente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p className="text-sm text-gray-500">Selecciona un tipo de mesa para añadir rápidamente:</p>
              <div className="grid grid-cols-1 gap-3">
                {tableTemplates.map((template, idx) => (
                  <Button 
                    key={idx} 
                    onClick={() => handleQuickAdd(template)}
                    className={`justify-start text-left h-auto py-3`}
                    variant="outline"
                  >
                    <div className="flex items-center w-full">
                      <div className={`w-3 h-3 rounded-full mr-2 mesa-${template.categoria}`}></div>
                      <div>
                        <div className="font-medium">{template.nombre}</div>
                        <div className="text-xs text-gray-500">{template.capacidad} personas - ${template.precioMinimo}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQuickAdd(false)}>Cancelar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Saved Templates Section */}
        {savedTemplates.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Plantillas Guardadas</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {savedTemplates.map((template: any) => (
                <div key={template.id} className="border rounded-md p-3 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => loadTemplate(template)}>
                        <Template className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {template.tables.length} mesas
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium">{editMode ? 'Editar Mesa' : 'Agregar Mesa'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              </div>
              
              <div>
                <Label htmlFor="categoria">Categoría</Label>
                <select 
                  id="categoria" 
                  name="categoria" 
                  value={formData.categoria} 
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                  <option value="purple">Purple</option>
                  <option value="red">Red</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="capacidad">Capacidad</Label>
                <Input id="capacidad" name="capacidad" type="number" min="1" max="20" value={formData.capacidad} onChange={handleInputChange} required />
              </div>
              
              <div>
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} required />
              </div>
              
              <div>
                <Label htmlFor="precioMinimo">Precio Mínimo</Label>
                <Input id="precioMinimo" name="precioMinimo" type="number" min="0" step="100" value={formData.precioMinimo} onChange={handleInputChange} required />
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <input 
                  type="checkbox" 
                  id="disponible" 
                  name="disponible" 
                  checked={formData.disponible} 
                  onChange={handleInputChange} 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="disponible">Disponible</Label>
              </div>
            </div>
            
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditMode(false); }}>
                Cancelar
              </Button>
              <Button type="submit">
                {editMode ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </form>
        )}
        
        {/* Background Image Upload */}
        <div className="mb-6 p-4 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">Imagen de Fondo</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Sube una imagen del plano del local para posicionar las mesas.
          </p>
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="mb-2"
          />
          {backgroundImage && (
            <div className="mt-2">
              <p className="text-sm text-green-600 dark:text-green-400">Imagen cargada correctamente.</p>
            </div>
          )}
        </div>

        {/* Table Map */}
        <AdminTableMap 
          tables={tables} 
          backgroundImage={backgroundImage}
          onUpdateTable={(updatedTable) => {
            const updatedTables = tables.map(table => 
              table.id === updatedTable.id ? updatedTable : table
            );
            updateTablesAndActive(updatedTables);
          }}
        />
        
        {/* Table List */}
        <div className="overflow-x-auto">
          <h3 className="text-lg font-medium my-4">Listado de Mesas</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Precio Min.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map(table => (
                <TableRow key={table.id}>
                  <TableCell>{table.nombre}</TableCell>
                  <TableCell>
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 mesa-${table.categoria}`}></span>
                    {table.categoria.charAt(0).toUpperCase() + table.categoria.slice(1)}
                  </TableCell>
                  <TableCell>{table.capacidad}</TableCell>
                  <TableCell>{table.ubicacion}</TableCell>
                  <TableCell>${table.precioMinimo}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${table.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {table.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTable(table)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleCloneTable(table)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTable(table.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TableManagement;

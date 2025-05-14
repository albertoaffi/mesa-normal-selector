
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import AdminTableMap from './AdminTableMap';

// Initial sample tables
const initialTables = [
  { id: 1, nombre: "Mesa Gold 1", categoria: "gold", capacidad: 8, ubicacion: "VIP", precioMinimo: 5000, disponible: true, descripcion: "Mesa VIP con vista privilegiada" },
  { id: 2, nombre: "Mesa Silver 1", categoria: "silver", capacidad: 6, ubicacion: "Área Silver", precioMinimo: 3000, disponible: true, descripcion: "Mesa con buena ubicación" },
  { id: 3, nombre: "Mesa Bronze 1", categoria: "bronze", capacidad: 4, ubicacion: "Área Bronze", precioMinimo: 2000, disponible: true, descripcion: "Mesa estándar" },
];

const TableManagement = () => {
  const [tables, setTables] = useState(initialTables);
  const [editMode, setEditMode] = useState(false);
  const [currentTable, setCurrentTable] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    nombre: "",
    categoria: "gold",
    capacidad: 4,
    ubicacion: "",
    precioMinimo: 1000,
    disponible: true,
    descripcion: ""
  });
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editMode && currentTable) {
      // Edit existing table
      setTables(tables.map(table => 
        table.id === currentTable.id ? { ...formData } : table
      ));
      toast({
        title: "Mesa actualizada",
        description: `La mesa ${formData.nombre} ha sido actualizada correctamente.`
      });
    } else {
      // Add new table
      const newId = tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1;
      setTables([...tables, { ...formData, id: newId }]);
      toast({
        title: "Mesa añadida",
        description: `La mesa ${formData.nombre} ha sido añadida correctamente.`
      });
    }
    
    // Reset form
    setShowForm(false);
    setEditMode(false);
    setCurrentTable(null);
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
  
  const handleEditTable = (table) => {
    setEditMode(true);
    setCurrentTable(table);
    setFormData(table);
    setShowForm(true);
  };
  
  const handleDeleteTable = (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta mesa?")) {
      setTables(tables.filter(table => table.id !== id));
      toast({
        title: "Mesa eliminada",
        description: "La mesa ha sido eliminada correctamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result);
        toast({
          title: "Imagen cargada",
          description: "La imagen de fondo ha sido actualizada."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gestión de Mesas</h2>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Mesa
          </Button>
        </div>
        
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
            setTables(tables.map(table => 
              table.id === updatedTable.id ? updatedTable : table
            ));
          }}
        />
        
        {/* Table List */}
        <div className="overflow-x-auto">
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

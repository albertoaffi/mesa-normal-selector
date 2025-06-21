
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Package, DollarSign, Upload, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseProductos } from "@/hooks/useSupabaseProductos";

const ProductManagement = () => {
  const { toast } = useToast();
  const { productos, loading, createProducto, updateProducto, deleteProducto } = useSupabaseProductos();
  
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: 'Botellas',
    imagen: '',
    descripcion: ''
  });

  const categorias = ['Botellas', 'Cervezas', 'Cocteles', 'Alimentos', 'Paquetes'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.precio || !formData.categoria) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const productData = {
        nombre: formData.nombre,
        precio: parseInt(formData.precio),
        categoria: formData.categoria,
        imagen: formData.imagen || '',
        descripcion: formData.descripcion || ''
      };

      if (editingProduct) {
        await updateProducto(editingProduct.id, productData);
        toast({
          title: "Producto actualizado",
          description: `${formData.nombre} ha sido actualizado correctamente.`
        });
      } else {
        await createProducto(productData);
        toast({
          title: "Producto creado",
          description: `${formData.nombre} ha sido creado correctamente.`
        });
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar el producto.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (product: any) => {
    console.log('Editing product:', product);
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      precio: product.precio.toString(),
      categoria: product.categoria,
      imagen: product.imagen || '',
      descripcion: product.descripcion || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar ${nombre}?`)) {
      try {
        await deleteProducto(id);
        toast({
          title: "Producto eliminado",
          description: `${nombre} ha sido eliminado correctamente.`,
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "Hubo un problema al eliminar el producto.",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Verificar que el CSV tenga las columnas necesarias
        const requiredHeaders = ['nombre', 'precio', 'categoria'];
        const hasRequired = requiredHeaders.every(h => headers.includes(h));
        
        if (!hasRequired) {
          toast({
            title: "Error en el archivo",
            description: "El archivo debe contener las columnas: nombre, precio, categoria",
            variant: "destructive"
          });
          return;
        }

        let importedCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => v.trim());
          const row: any = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });

          if (row.nombre && row.precio && row.categoria) {
            try {
              await createProducto({
                nombre: row.nombre,
                precio: parseInt(row.precio),
                categoria: row.categoria,
                imagen: row.imagen || '',
                descripcion: row.descripcion || ''
              });
              importedCount++;
            } catch (error) {
              console.error(`Error importing product ${row.nombre}:`, error);
            }
          }
        }

        toast({
          title: "Importación completada",
          description: `Se importaron ${importedCount} productos exitosamente.`
        });
        
        setShowImport(false);
      } catch (error) {
        console.error('Error importing file:', error);
        toast({
          title: "Error",
          description: "Hubo un problema al importar el archivo.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      precio: '',
      categoria: 'Botellas',
      imagen: '',
      descripcion: ''
    });
    setEditingProduct(null);
  };

  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando productos...</div>
      </div>
    );
  }

  // Group products by category
  const productosPorCategoria = productos.reduce((acc, producto) => {
    if (!acc[producto.categoria]) {
      acc[producto.categoria] = [];
    }
    acc[producto.categoria].push(producto);
    return acc;
  }, {} as Record<string, typeof productos>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Gestión de Productos</CardTitle>
              <CardDescription>
                Administra los productos disponibles para reservas
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowImport(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Importar CSV
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                    <p className="text-2xl font-bold">{productos.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Precio Promedio</p>
                    <p className="text-2xl font-bold">
                      ${productos.length > 0 ? Math.round(productos.reduce((sum, p) => sum + p.precio, 0) / productos.length) : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Categorías</p>
                    <p className="text-2xl font-bold">{Object.keys(productosPorCategoria).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products by Category */}
          {Object.entries(productosPorCategoria).map(([categoria, productosCategoria]) => (
            <div key={categoria} className="mb-8">
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-semibold mr-2">{categoria}</h3>
                <Badge variant="outline">{productosCategoria.length} productos</Badge>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productosCategoria.map((producto) => (
                      <TableRow key={producto.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {producto.imagen && (
                              <img 
                                src={producto.imagen} 
                                alt={producto.nombre}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{producto.nombre}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono">${producto.precio}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm text-muted-foreground">
                            {producto.descripcion}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(producto)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(producto.id, producto.nombre)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}

          {productos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 mb-4" />
              <p>No hay productos registrados aún</p>
              <p className="text-sm">Comienza añadiendo tu primer producto</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={handleCloseForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="precio">Precio *</Label>
                  <Input
                    id="precio"
                    name="precio"
                    type="number"
                    min="0"
                    step="10"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoria">Categoría *</Label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="imagen">URL de Imagen</Label>
                <Input
                  id="imagen"
                  name="imagen"
                  type="url"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Descripción del producto..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingProduct ? 'Actualizar' : 'Crear'} Producto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Importar Productos desde CSV
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="csvFile">Archivo CSV</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileImport}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Formato requerido:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>nombre (obligatorio)</li>
                <li>precio (obligatorio)</li>
                <li>categoria (obligatorio)</li>
                <li>imagen (opcional)</li>
                <li>descripcion (opcional)</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImport(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;

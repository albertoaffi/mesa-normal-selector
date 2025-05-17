
import React, { useState } from 'react';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

// Importar el tipo Producto de ProductCard
import { Producto } from '@/components/ProductCard';

// Datos de ejemplo para productos
const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: "Botella Premium Vodka",
    precio: 1800,
    categoria: "Botellas",
    imagen: "https://images.unsplash.com/photo-1613521298048-5252e6ae5485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    descripcion: "Botella premium de vodka con mezcladores incluidos."
  },
  {
    id: 2,
    nombre: "Botella Whisky",
    precio: 2200,
    categoria: "Botellas",
    imagen: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    descripcion: "Botella de whisky añejado con hielo y mezcladores."
  },
  {
    id: 3,
    nombre: "Botella Tequila",
    precio: 1500,
    categoria: "Botellas",
    imagen: "https://images.unsplash.com/photo-1550985105-80f5d89d8912?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    descripcion: "Tequila premium con limones, sal y mezcladores."
  },
  {
    id: 4,
    nombre: "Bucket Cervezas",
    precio: 600,
    categoria: "Cervezas",
    imagen: "https://images.unsplash.com/photo-1546636889-ba9fdd63583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    descripcion: "6 cervezas premium heladas en cubeta con hielo."
  },
  {
    id: 5,
    nombre: "Tabla de Botanas",
    precio: 450,
    categoria: "Alimentos",
    imagen: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    descripcion: "Selección de botanas premium para acompañar bebidas."
  },
  {
    id: 6,
    nombre: "Set de Coctelería",
    precio: 800,
    categoria: "Cocteles",
    imagen: "https://images.unsplash.com/photo-1557345104-66e27c12f660?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    descripcion: "4 cocteles de la casa preparados por nuestros bartenders."
  }
];

// Categorías disponibles para los productos
const categorias = ["Botellas", "Cervezas", "Cocteles", "Alimentos"];

const ProductManagement = () => {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Producto | null>(null);
  const [formData, setFormData] = useState<Producto>({
    id: 0,
    nombre: "",
    precio: 0,
    categoria: "Botellas",
    descripcion: "",
    imagen: ""
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'precio' ? Number(value) : value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, categoria: value });
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, descripcion: e.target.value });
  };

  const openAddDialog = () => {
    setCurrentProduct(null);
    setFormData({
      id: Date.now(),
      nombre: "",
      precio: 0,
      categoria: "Botellas",
      descripcion: "",
      imagen: "https://images.unsplash.com/photo-1613521298048-5252e6ae5485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (producto: Producto) => {
    setCurrentProduct(producto);
    setFormData({ ...producto });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setProductos(productos.filter(producto => producto.id !== id));
  };

  const handleSubmit = () => {
    if (currentProduct) {
      // Editar producto existente
      setProductos(productos.map(p => p.id === currentProduct.id ? formData : p));
    } else {
      // Añadir nuevo producto
      setProductos([...productos, formData]);
    }
    setIsDialogOpen(false);
  };

  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Productos</CardTitle>
          <Button onClick={openAddDialog} className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Añadir Producto
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar productos..." 
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="w-[150px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.id}</TableCell>
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img 
                          src={producto.imagen} 
                          alt={producto.nombre} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>${producto.precio}</TableCell>
                    <TableCell>{producto.categoria}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => openEditDialog(producto)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDelete(producto.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentProduct ? "Editar Producto" : "Añadir Producto"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">Nombre</Label>
              <Input 
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del producto"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precio" className="text-right">Precio</Label>
              <Input 
                id="precio"
                name="precio"
                type="number"
                value={formData.precio}
                onChange={handleInputChange}
                placeholder="Precio"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria" className="text-right">Categoría</Label>
              <Select
                value={formData.categoria}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imagen" className="text-right">URL Imagen</Label>
              <Input 
                id="imagen"
                name="imagen"
                value={formData.imagen}
                onChange={handleInputChange}
                placeholder="URL de la imagen"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">Descripción</Label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleTextareaChange}
                placeholder="Descripción del producto"
                className="col-span-3 min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;

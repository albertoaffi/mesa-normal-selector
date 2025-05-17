
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Producto } from "@/components/ProductCard";

// Schema de validación para productos
const productSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  precio: z.coerce.number().min(0.01, "El precio debe ser mayor a 0"),
  categoria: z.string().min(1, "Selecciona una categoría"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  imagen: z.string().url("Ingresa una URL de imagen válida").or(z.string().min(1, "La imagen es requerida")),
});

type ProductFormValues = z.infer<typeof productSchema>;

// Datos de ejemplo
const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: "Martini Clásico",
    precio: 12.99,
    categoria: "Cócteles",
    imagen: "https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=1974&auto=format&fit=crop",
    descripcion: "Ginebra y vermut seco, guarnecido con una aceituna o twist de limón."
  },
  {
    id: 2,
    nombre: "Botella de Whisky Premium",
    precio: 89.99,
    categoria: "Botellas",
    imagen: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=1974&auto=format&fit=crop",
    descripcion: "Whisky premium añejado durante 12 años en barricas de roble."
  },
  {
    id: 3,
    nombre: "Tabla de Quesos",
    precio: 24.50,
    categoria: "Alimentos",
    imagen: "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=1965&auto=format&fit=crop",
    descripcion: "Selección de quesos gourmet acompañados de frutas y crackers."
  },
  {
    id: 4,
    nombre: "Mojito Cubano",
    precio: 10.99,
    categoria: "Cócteles",
    imagen: "https://images.unsplash.com/photo-1546171753-97d7676e4602?q=80&w=1974&auto=format&fit=crop",
    descripcion: "Ron blanco, menta fresca, azúcar, lima y soda."
  },
  {
    id: 5,
    nombre: "Botella de Champagne",
    precio: 75.00,
    categoria: "Botellas",
    imagen: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=1974&auto=format&fit=crop",
    descripcion: "Champagne francés premium, perfecto para celebraciones especiales."
  }
];

// Categorías disponibles
const categorias = ["Cócteles", "Botellas", "Alimentos", "Sin Alcohol", "Promociones"];

const ProductManagement: React.FC = () => {
  const { toast } = useToast();
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: "",
      precio: 0,
      categoria: "",
      descripcion: "",
      imagen: "",
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (editingProduct) {
      // Actualizar producto existente
      const updatedProductos = productos.map(p => 
        p.id === editingProduct.id ? { ...data, id: p.id } : p
      );
      setProductos(updatedProductos);
      toast({
        title: "Producto actualizado",
        description: `${data.nombre} ha sido actualizado correctamente.`,
      });
    } else {
      // Crear nuevo producto
      const newProduct = {
        ...data,
        id: Math.max(0, ...productos.map(p => p.id)) + 1,
      };
      setProductos([...productos, newProduct]);
      toast({
        title: "Producto creado",
        description: `${data.nombre} ha sido añadido correctamente.`,
      });
    }
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (id: number) => {
    setProductos(productos.filter(p => p.id !== id));
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado correctamente.",
      variant: "destructive",
    });
  };

  const handleEdit = (producto: Producto) => {
    setEditingProduct(producto);
    form.reset({
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
    });
    setIsDialogOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    form.reset({
      nombre: "",
      precio: 0,
      categoria: "",
      descripcion: "",
      imagen: "",
    });
    setIsDialogOpen(true);
  };

  const filteredProducts = searchTerm 
    ? productos.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : productos;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Productos</CardTitle>
          <CardDescription>
            Administra el catálogo de productos del club.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewProduct} className="flex gap-1.5">
                  <Plus className="h-4 w-4" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Editar Producto" : "Añadir Nuevo Producto"}
                  </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nombre del producto" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="precio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categorias.map(categoria => (
                                <SelectItem key={categoria} value={categoria}>
                                  {categoria}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Descripción del producto" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imagen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de Imagen</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://ejemplo.com/imagen.jpg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingProduct ? "Actualizar" : "Crear"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>
                        <div className="h-12 w-12 overflow-hidden rounded-sm">
                          <img 
                            src={producto.imagen} 
                            alt={producto.nombre}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{producto.nombre}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{producto.descripcion}</p>
                        </div>
                      </TableCell>
                      <TableCell>${producto.precio.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-accent/30">
                          {producto.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleEdit(producto)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleDelete(producto.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No se encontraron productos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;

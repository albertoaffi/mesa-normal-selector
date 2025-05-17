
import React, { useState } from 'react';
import { 
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Pencil, Trash2, Upload, FileSpreadsheet, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Producto | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<Array<any>>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<{[key: string]: string}>({
    nombre: "",
    precio: "",
    categoria: "",
    descripcion: "",
    imagen: ""
  });
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

  // CSV Import Functions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        processCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const processCSV = (text: string) => {
    // Simple CSV parsing (could be replaced with a more robust library)
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    setCsvHeaders(headers);
    
    // Initialize default mappings if headers match expected fields
    const newMapping = { ...headerMapping };
    headers.forEach(header => {
      const normalized = header.toLowerCase();
      if (normalized.includes('nombre') || normalized.includes('name')) {
        newMapping.nombre = header;
      } else if (normalized.includes('precio') || normalized.includes('price')) {
        newMapping.precio = header;
      } else if (normalized.includes('categoria') || normalized.includes('category')) {
        newMapping.categoria = header;
      } else if (normalized.includes('descripcion') || normalized.includes('description')) {
        newMapping.descripcion = header;
      } else if (normalized.includes('imagen') || normalized.includes('image')) {
        newMapping.imagen = header;
      }
    });
    setHeaderMapping(newMapping);
    
    // Create preview data (first 3 rows)
    const preview = [];
    for (let i = 1; i < Math.min(4, lines.length); i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: {[key: string]: string} = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        preview.push(row);
      }
    }
    setCsvPreview(preview);
  };

  const handleMappingChange = (field: string, header: string) => {
    setHeaderMapping({
      ...headerMapping,
      [field]: header
    });
  };

  const importProducts = () => {
    if (!csvFile) return;
    
    // Read the entire CSV file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Find column indexes based on mapping
        const nombreIdx = headers.indexOf(headerMapping.nombre);
        const precioIdx = headers.indexOf(headerMapping.precio);
        const categoriaIdx = headers.indexOf(headerMapping.categoria);
        const descripcionIdx = headers.indexOf(headerMapping.descripcion);
        const imagenIdx = headers.indexOf(headerMapping.imagen);
        
        // Validate required mappings
        if (nombreIdx === -1 || precioIdx === -1) {
          toast({
            title: "Error de mapeo",
            description: "Es necesario mapear al menos los campos de nombre y precio",
            variant: "destructive"
          });
          return;
        }
        
        // Process products
        const newProducts: Producto[] = [];
        const errors: string[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => v.trim());
          
          // Get values based on mapping
          const nombre = values[nombreIdx];
          const precioStr = values[precioIdx];
          let precio = 0;
          
          try {
            precio = parseFloat(precioStr);
            if (isNaN(precio)) {
              errors.push(`Fila ${i+1}: Precio inválido "${precioStr}"`);
              continue;
            }
          } catch (e) {
            errors.push(`Fila ${i+1}: Precio inválido "${precioStr}"`);
            continue;
          }
          
          let categoria = "Botellas"; // default
          if (categoriaIdx !== -1) {
            const catValue = values[categoriaIdx];
            if (categorias.includes(catValue)) {
              categoria = catValue;
            } else {
              errors.push(`Fila ${i+1}: Categoría "${catValue}" no válida. Usando "Botellas" por defecto.`);
            }
          }
          
          const descripcion = descripcionIdx !== -1 ? values[descripcionIdx] : "";
          const imagen = imagenIdx !== -1 ? values[imagenIdx] : "https://images.unsplash.com/photo-1613521298048-5252e6ae5485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
          
          newProducts.push({
            id: Date.now() + i,
            nombre,
            precio,
            categoria: categoria as "Botellas" | "Cervezas" | "Cocteles" | "Alimentos",
            descripcion,
            imagen
          });
        }
        
        if (newProducts.length > 0) {
          setProductos([...productos, ...newProducts]);
          
          toast({
            title: "Importación completa",
            description: `${newProducts.length} productos importados exitosamente${errors.length > 0 ? ' con algunos errores' : ''}`,
            variant: errors.length > 0 ? "default" : "default"
          });
          
          if (errors.length > 0) {
            console.error("Errores de importación:", errors);
          }
        } else {
          toast({
            title: "Error de importación",
            description: "No se pudo importar ningún producto",
            variant: "destructive"
          });
        }
        
        setIsCsvDialogOpen(false);
        setCsvFile(null);
        setCsvPreview([]);
        setCsvHeaders([]);
        
      } catch (error) {
        toast({
          title: "Error de procesamiento",
          description: "Ocurrió un error al procesar el archivo CSV",
          variant: "destructive"
        });
        console.error("CSV processing error:", error);
      }
    };
    
    reader.readAsText(csvFile);
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
          <div className="flex gap-2">
            <Button onClick={() => setIsCsvDialogOpen(true)} variant="outline" className="flex items-center gap-1">
              <FileSpreadsheet className="w-4 h-4" />
              Importar CSV
            </Button>
            <Button onClick={openAddDialog} className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Añadir Producto
            </Button>
          </div>
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
      
      {/* CSV Import Dialog */}
      <Dialog open={isCsvDialogOpen} onOpenChange={setIsCsvDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Importar Productos desde CSV</DialogTitle>
            <DialogDescription>
              Sube un archivo CSV con tus productos. El archivo debe tener encabezados que luego podrás mapear a los campos requeridos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!csvFile ? (
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="mb-2 font-medium">Selecciona un archivo CSV</p>
                <p className="text-sm text-gray-500 mb-4">
                  Formatos soportados: .csv
                </p>
                <Input 
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="max-w-xs mx-auto"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 text-blue-500" />
                    <div>
                      <p className="font-medium">Archivo seleccionado: {csvFile.name}</p>
                      <p className="mt-1">Por favor, asigna cada columna de tu CSV a un campo de producto:</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-red-500">* Nombre:</Label>
                    <Select 
                      value={headerMapping.nombre}
                      onValueChange={(value) => handleMappingChange('nombre', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una columna" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-red-500">* Precio:</Label>
                    <Select
                      value={headerMapping.precio}
                      onValueChange={(value) => handleMappingChange('precio', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una columna" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Categoría:</Label>
                    <Select
                      value={headerMapping.categoria}
                      onValueChange={(value) => handleMappingChange('categoria', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una columna" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Descripción:</Label>
                    <Select
                      value={headerMapping.descripcion}
                      onValueChange={(value) => handleMappingChange('descripcion', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una columna" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>URL de Imagen:</Label>
                    <Select
                      value={headerMapping.imagen}
                      onValueChange={(value) => handleMappingChange('imagen', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una columna" />
                      </SelectTrigger>
                      <SelectContent>
                        {csvHeaders.map((header) => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {csvPreview.length > 0 && (
                  <div>
                    <Label className="block mb-2">Vista previa (primeras 3 filas):</Label>
                    <div className="border rounded-md overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {csvHeaders.map((header) => (
                              <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {csvPreview.map((row, idx) => (
                            <TableRow key={idx}>
                              {csvHeaders.map((header) => (
                                <TableCell key={header} className="whitespace-nowrap">{row[header]}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      * Campos obligatorios. Los productos sin estos campos serán omitidos.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCsvDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={importProducts}
              disabled={!csvFile || !headerMapping.nombre || !headerMapping.precio}
            >
              Importar Productos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Product Form Dialog */}
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MesaCard, { Mesa } from '@/components/MesaCard';
import TableMap from '@/components/TableMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductCard, { Producto } from '@/components/ProductCard';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Datos simulados para las mesas
const mesas: Mesa[] = [
  {
    id: 1,
    nombre: "Gold VIP 1",
    categoria: "gold",
    capacidad: 10,
    ubicacion: "Área VIP junto a DJ",
    precioMinimo: 5000,
    disponible: true,
    descripcion: "Mesa premium con la mejor ubicación y vista panorámica. Incluye servicio personalizado."
  },
  {
    id: 2,
    nombre: "Gold VIP 2",
    categoria: "gold",
    capacidad: 8,
    ubicacion: "Segundo piso - Área VIP",
    precioMinimo: 4500,
    disponible: true,
    descripcion: "Mesa exclusiva en segundo piso con vista a la pista principal y servicio premium."
  },
  {
    id: 3,
    nombre: "Silver 1",
    categoria: "silver",
    capacidad: 6,
    ubicacion: "Planta baja - Cerca de barra principal",
    precioMinimo: 3000,
    disponible: true,
    descripcion: "Mesa con buena ubicación y fácil acceso a la barra principal."
  },
  {
    id: 4,
    nombre: "Bronze 1",
    categoria: "bronze",
    capacidad: 4,
    ubicacion: "Planta baja - Área general",
    precioMinimo: 2000,
    disponible: true,
    descripcion: "Mesa cómoda en área general con buen ambiente."
  },
  {
    id: 5,
    nombre: "Purple Table",
    categoria: "purple",
    capacidad: 6,
    ubicacion: "Zona lounge",
    precioMinimo: 2500,
    disponible: true,
    descripcion: "Mesa en zona lounge con ambiente más relajado y cómodos sillones."
  },
  {
    id: 6,
    nombre: "Red Hot",
    categoria: "red",
    capacidad: 4,
    ubicacion: "Cerca de la pista",
    precioMinimo: 1800,
    disponible: false,
    descripcion: "Mesa junto a la pista principal, ideal para disfrutar de la música."
  },
];

// Datos simulados para productos
const productos: Producto[] = [
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

const Reservar = () => {
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [productosCantidad, setProductosCantidad] = useState<Record<number, number>>({});
  const [fecha, setFecha] = useState<string>("");
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [paso, setPaso] = useState<number>(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMesaSelect = (mesa: Mesa) => {
    setMesaSeleccionada(mesa);
  };

  const handleProductCantidadChange = (productoId: number, cantidad: number) => {
    setProductosCantidad((prev) => ({
      ...prev,
      [productoId]: cantidad
    }));
  };

  const calcularTotalProductos = () => {
    return productos.reduce((total, producto) => {
      const cantidad = productosCantidad[producto.id] || 0;
      return total + (producto.precio * cantidad);
    }, 0);
  };

  const totalProductos = calcularTotalProductos();
  const consumoMinimo = mesaSeleccionada?.precioMinimo || 0;
  const consumoSuficiente = totalProductos >= consumoMinimo;

  const handleNextStep = () => {
    if (paso === 1) {
      if (!mesaSeleccionada) {
        toast({
          title: "Selecciona una mesa",
          description: "Debes seleccionar una mesa para continuar",
          variant: "destructive",
        });
        return;
      }
      setPaso(2);
    } else if (paso === 2) {
      if (!consumoSuficiente) {
        toast({
          title: "Consumo mínimo no alcanzado",
          description: `Debes seleccionar productos por al menos $${consumoMinimo}`,
          variant: "destructive",
        });
        return;
      }
      setPaso(3);
    } else if (paso === 3) {
      if (!nombre || !telefono || !email || !fecha) {
        toast({
          title: "Datos incompletos",
          description: "Por favor completa todos los campos del formulario",
          variant: "destructive",
        });
        return;
      }
      
      // Aquí iría la lógica para procesar la reserva
      toast({
        title: "¡Reserva realizada con éxito!",
        description: "Te hemos enviado los detalles por correo electrónico.",
      });
      
      // Redireccionar a confirmación
      navigate('/confirmacion', { 
        state: { 
          mesa: mesaSeleccionada,
          productos: productos.filter(p => (productosCantidad[p.id] || 0) > 0).map(p => ({
            ...p,
            cantidad: productosCantidad[p.id] || 0
          })),
          fecha,
          nombre,
          total: totalProductos
        } 
      });
    }
  };

  const handlePrevStep = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gold-gradient">
            Reserva tu mesa en The Normal
          </h1>
          
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso === 1 ? 'bg-club-gold text-black' : 'bg-gray-800 text-white'}`}>
                  1
                </div>
                <div className={`h-1 w-16 mx-1 ${paso > 1 ? 'bg-club-gold' : 'bg-gray-800'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso === 2 ? 'bg-club-gold text-black' : 'bg-gray-800 text-white'}`}>
                  2
                </div>
                <div className={`h-1 w-16 mx-1 ${paso > 2 ? 'bg-club-gold' : 'bg-gray-800'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso === 3 ? 'bg-club-gold text-black' : 'bg-gray-800 text-white'}`}>
                  3
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>Seleccionar mesa</span>
              <span>Elegir productos</span>
              <span>Tus datos</span>
            </div>
          </div>
          
          {/* Paso 1: Selección de mesa */}
          {paso === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Selecciona tu mesa</h2>
              
              <Tabs defaultValue="mapa">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="mapa">Mapa de Mesas</TabsTrigger>
                  <TabsTrigger value="lista">Lista de Mesas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="mapa">
                  <TableMap 
                    mesas={mesas}
                    selectedMesa={mesaSeleccionada}
                    onSelectMesa={handleMesaSelect}
                  />
                </TabsContent>
                
                <TabsContent value="lista">
                  <Tabs defaultValue="todas">
                    <TabsList className="grid grid-cols-6 mb-6">
                      <TabsTrigger value="todas">Todas</TabsTrigger>
                      <TabsTrigger value="gold" className="mesa-gold">Gold</TabsTrigger>
                      <TabsTrigger value="silver" className="mesa-silver">Silver</TabsTrigger>
                      <TabsTrigger value="bronze" className="mesa-bronze">Bronze</TabsTrigger>
                      <TabsTrigger value="purple" className="mesa-purple">Purple</TabsTrigger>
                      <TabsTrigger value="red" className="mesa-red">Red</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="todas">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mesas.map(mesa => (
                          <MesaCard 
                            key={mesa.id}
                            mesa={mesa}
                            onSelect={handleMesaSelect}
                            selected={mesaSeleccionada?.id === mesa.id}
                          />
                        ))}
                      </div>
                    </TabsContent>
                    
                    {["gold", "silver", "bronze", "purple", "red"].map(categoria => (
                      <TabsContent key={categoria} value={categoria}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {mesas
                            .filter(mesa => mesa.categoria === categoria)
                            .map(mesa => (
                              <MesaCard 
                                key={mesa.id}
                                mesa={mesa}
                                onSelect={handleMesaSelect}
                                selected={mesaSeleccionada?.id === mesa.id}
                              />
                            ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {/* Paso 2: Selección de productos */}
          {paso === 2 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Selecciona tus productos</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Mesa seleccionada:</p>
                  <p className="font-medium">{mesaSeleccionada?.nombre}</p>
                </div>
              </div>
              
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Consumo mínimo requerido</CardTitle>
                  <CardDescription>
                    Para la mesa {mesaSeleccionada?.nombre} ({mesaSeleccionada?.categoria}), 
                    necesitas un consumo mínimo de ${mesaSeleccionada?.precioMinimo}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Consumo actual:</p>
                      <p className={`text-xl font-bold ${consumoSuficiente ? 'text-green-500' : 'text-red-500'}`}>
                        ${totalProductos}
                      </p>
                    </div>
                    {!consumoSuficiente && (
                      <div className="bg-red-900/20 border border-red-900/30 px-4 py-2 rounded-md">
                        <p className="text-sm text-red-400">
                          Te faltan ${consumoMinimo - totalProductos} para alcanzar el consumo mínimo
                        </p>
                      </div>
                    )}
                    {consumoSuficiente && (
                      <div className="bg-green-900/20 border border-green-900/30 px-4 py-2 rounded-md">
                        <p className="text-sm text-green-400">
                          ¡Consumo mínimo alcanzado!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="Botellas">Botellas</TabsTrigger>
                  <TabsTrigger value="Cervezas">Cervezas</TabsTrigger>
                  <TabsTrigger value="Cocteles">Cócteles</TabsTrigger>
                  <TabsTrigger value="Alimentos">Alimentos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productos.map(producto => (
                      <ProductCard 
                        key={producto.id}
                        producto={producto}
                        cantidad={productosCantidad[producto.id] || 0}
                        onChange={handleProductCantidadChange}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                {['Botellas', 'Cervezas', 'Cocteles', 'Alimentos'].map(cat => (
                  <TabsContent key={cat} value={cat}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {productos
                        .filter(producto => producto.categoria === cat)
                        .map(producto => (
                          <ProductCard 
                            key={producto.id}
                            producto={producto}
                            cantidad={productosCantidad[producto.id] || 0}
                            onChange={handleProductCantidadChange}
                          />
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
          
          {/* Paso 3: Datos personales */}
          {paso === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Tus datos para la reservación</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Información personal</CardTitle>
                    <CardDescription>
                      Ingresa tus datos de contacto para la reservación
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo</Label>
                      <Input 
                        id="nombre" 
                        placeholder="Tu nombre completo" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input 
                        id="telefono" 
                        placeholder="Tu número de teléfono" 
                        value={telefono} 
                        onChange={(e) => setTelefono(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Tu correo electrónico" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha de reservación</Label>
                      <Input 
                        id="fecha" 
                        type="date" 
                        value={fecha} 
                        onChange={(e) => setFecha(e.target.value)} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen de tu reserva</CardTitle>
                    <CardDescription>
                      Revisa los detalles de tu reservación
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Mesa seleccionada</h3>
                        <div className="p-3 bg-gray-900 rounded-md">
                          <div className={`h-2 w-24 mb-2 ${mesaSeleccionada?.categoria ? `mesa-${mesaSeleccionada.categoria}` : ''}`} />
                          <p className="font-medium">{mesaSeleccionada?.nombre}</p>
                          <p className="text-sm text-gray-400">Capacidad: {mesaSeleccionada?.capacidad} personas</p>
                          <p className="text-sm text-gray-400">Ubicación: {mesaSeleccionada?.ubicacion}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Productos seleccionados</h3>
                        <div className="space-y-2">
                          {productos
                            .filter(p => (productosCantidad[p.id] || 0) > 0)
                            .map(producto => (
                              <div key={producto.id} className="flex justify-between p-2 bg-gray-900 rounded-md">
                                <span>
                                  {producto.nombre} x{productosCantidad[producto.id]}
                                </span>
                                <span className="text-club-gold">
                                  ${producto.precio * (productosCantidad[producto.id] || 0)}
                                </span>
                              </div>
                            ))}
                            
                          {productos.filter(p => (productosCantidad[p.id] || 0) > 0).length === 0 && (
                            <p className="text-gray-500 text-sm">No hay productos seleccionados</p>
                          )}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center font-medium">
                        <span>Total:</span>
                        <span className="text-xl text-club-gold">${totalProductos}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            {paso > 1 && (
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
              >
                Anterior
              </Button>
            )}
            {paso === 1 && <div></div>}
            
            <Button 
              className="bg-club-gold text-black hover:bg-opacity-90"
              onClick={handleNextStep}
            >
              {paso < 3 ? 'Siguiente' : 'Confirmar Reserva'}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reservar;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Info, CheckCircle, AlertCircle, Clock, User, Users, CircleDollarSign } from "lucide-react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MesaCard, { Mesa } from '@/components/MesaCard';
import TableMap from '@/components/TableMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductCard, { Producto } from '@/components/ProductCard';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

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
  },
  {
    id: 7,
    nombre: "Combo VIP Experience",
    precio: 3500,
    categoria: "Paquetes",
    imagen: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    descripcion: "1 botella premium + tabla de botanas + atención personalizada"
  },
  {
    id: 8,
    nombre: "Experiencia Gold",
    precio: 5000,
    categoria: "Paquetes",
    imagen: "https://images.unsplash.com/photo-1516423293500-e516821b2f96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    descripcion: "2 botellas premium + tabla botanas especial + champagne de bienvenida"
  }
];

const eventosEspeciales = [
  { fecha: new Date(2025, 4, 20), nombre: "DJ Internacional", descripcion: "Noche especial con DJ internacional invitado" },
  { fecha: new Date(2025, 4, 26), nombre: "Fiesta de Espuma", descripcion: "Gran fiesta de espuma en la terraza" },
  { fecha: new Date(2025, 5, 2), nombre: "Pre-Verano", descripcion: "Celebración especial de inicio de verano" },
  { fecha: new Date(2025, 5, 10), nombre: "Noche Tropical", descripcion: "Temática tropical con decoración especial" }
];

// Horarios disponibles por defecto
const horariosDisponibles = ['20:00', '21:00', '22:00', '23:00', '00:00', '01:00'];

// Función para verificar si una mesa está disponible para una fecha específica (simulado)
const checkMesaDisponibilidad = (mesaId: number, fecha: Date): { disponible: boolean, motivo?: string } => {
  // Simulamos que algunas mesas no están disponibles en fechas específicas
  if (mesaId === 1 && fecha.getDate() === 25 && fecha.getMonth() === 4) {
    return { disponible: false, motivo: "Reservada para evento privado" };
  }
  
  if (mesaId === 3 && fecha.getDate() === 26 && fecha.getMonth() === 4) {
    return { disponible: false, motivo: "En mantenimiento" };
  }
  
  // Mesas Gold no disponibles después de cierta hora para usuarios regulares (simulado)
  const hour = new Date().getHours();
  if ((mesaId === 1 || mesaId === 2) && hour >= 12 && fecha.getDate() === new Date().getDate()) {
    return { disponible: false, motivo: "Mesa Gold solo disponible con reserva anticipada o código VIP" };
  }
  
  return { disponible: true };
};

const Reservar = () => {
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [productosCantidad, setProductosCantidad] = useState<Record<number, number>>({});
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [mesasDisponiblesFecha, setMesasDisponiblesFecha] = useState<Mesa[]>(mesas);
  const [hora, setHora] = useState<string>("");
  const [personas, setPersonas] = useState<string>("2");
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [paso, setPaso] = useState<number>(1);
  const [tieneCodigoVIP, setTieneCodigoVIP] = useState<boolean>(false);
  const [codigoVIP, setCodigoVIP] = useState<string>("");
  const [paqueteRecomendado, setPaqueteRecomendado] = useState<Producto | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Efectos para actualizar la disponibilidad de mesas según la fecha seleccionada
  useEffect(() => {
    if (fecha) {
      // Filtramos las mesas según su disponibilidad para la fecha seleccionada
      const mesasActualizadas = mesas.map(mesa => {
        const { disponible, motivo } = checkMesaDisponibilidad(mesa.id, fecha);
        return { 
          ...mesa, 
          disponible,
          descripcion: !disponible ? `No disponible: ${motivo}` : mesa.descripcion 
        };
      });
      
      setMesasDisponiblesFecha(mesasActualizadas);
      
      // Si la mesa seleccionada ya no está disponible, deseleccionarla
      if (mesaSeleccionada) {
        const mesaActualizada = mesasActualizadas.find(m => m.id === mesaSeleccionada.id);
        if (mesaActualizada && !mesaActualizada.disponible) {
          setMesaSeleccionada(null);
          toast({
            title: "Mesa no disponible",
            description: `La mesa ${mesaSeleccionada.nombre} no está disponible para la fecha seleccionada.`,
            variant: "destructive",
          });
        }
      }
      
      // Si es un evento especial, mostrar notificación
      const eventoEnFecha = eventosEspeciales.find(
        evento => evento.fecha.toDateString() === fecha.toDateString()
      );
      
      if (eventoEnFecha) {
        toast({
          title: `Evento especial: ${eventoEnFecha.nombre}`,
          description: eventoEnFecha.descripcion,
        });
      }
    } else {
      setMesasDisponiblesFecha(mesas);
    }
  }, [fecha]);

  // Efecto para recomendar un paquete basado en la mesa seleccionada
  useEffect(() => {
    if (mesaSeleccionada) {
      // Buscar un paquete que cumpla con el consumo mínimo de la mesa
      const paquetesRecomendados = productos
        .filter(p => p.categoria === 'Paquetes' && p.precio >= mesaSeleccionada.precioMinimo)
        .sort((a, b) => a.precio - b.precio);
      
      if (paquetesRecomendados.length > 0) {
        setPaqueteRecomendado(paquetesRecomendados[0]);
      }
    } else {
      setPaqueteRecomendado(null);
    }
  }, [mesaSeleccionada]);

  const handleMesaSelect = (mesa: Mesa) => {
    if (!mesa.disponible) {
      toast({
        title: "Mesa no disponible",
        description: mesa.descripcion || "Esta mesa no está disponible para la fecha seleccionada.",
        variant: "destructive",
      });
      return;
    }
    setMesaSeleccionada(mesa);
  };

  const handleProductCantidadChange = (productoId: number, cantidad: number) => {
    setProductosCantidad((prev) => ({
      ...prev,
      [productoId]: cantidad
    }));
  };

  // Manejar selección de paquete recomendado
  const handleSeleccionarPaquete = () => {
    if (paqueteRecomendado) {
      handleProductCantidadChange(paqueteRecomendado.id, 1);
      toast({
        title: "Paquete añadido",
        description: `Se ha añadido el paquete ${paqueteRecomendado.nombre} a tu selección.`,
      });
    }
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
  
  // Función para validar código VIP (simulada)
  const validarCodigoVIP = () => {
    // Códigos VIP válidos (simulados)
    const codigosValidos = ['VIP2025', 'GOLDVIP', 'STAFF2025'];
    
    if (codigosValidos.includes(codigoVIP.toUpperCase())) {
      toast({
        title: "Código VIP válido",
        description: "El código ha sido aplicado correctamente. Tienes acceso a mesas premium.",
      });
      setTieneCodigoVIP(true);
    } else {
      toast({
        title: "Código inválido",
        description: "El código VIP ingresado no es válido o ha expirado.",
        variant: "destructive",
      });
    }
  };

  const handleNextStep = () => {
    if (paso === 1) {
      if (!fecha) {
        toast({
          title: "Selecciona una fecha",
          description: "Debes seleccionar una fecha para continuar",
          variant: "destructive",
        });
        return;
      }
      
      if (!mesaSeleccionada) {
        toast({
          title: "Selecciona una mesa",
          description: "Debes seleccionar una mesa para continuar",
          variant: "destructive",
        });
        return;
      }
      
      if (!hora) {
        toast({
          title: "Selecciona hora",
          description: "Debes seleccionar una hora para la reserva",
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
      if (!nombre || !telefono || !email) {
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
          fecha: fecha,
          hora: hora,
          personas: parseInt(personas),
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

  // Filter out past dates and limit to next 30 days
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);

  // Marcar días con eventos especiales en el calendario
  const eventDays = eventosEspeciales.map(evento => evento.fecha);
  
  // Determinar si el usuario tiene acceso a mesas premium
  const tieneMesasPremiumAccesibles = tieneCodigoVIP || new Date().getHours() < 12;

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
              <span>Seleccionar fecha y mesa</span>
              <span>Elegir productos</span>
              <span>Tus datos</span>
            </div>
          </div>
          
          {/* Paso 1: Selección de fecha y mesa */}
          {paso === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Selecciona fecha y mesa</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Calendario */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" /> 
                      Selecciona una fecha
                    </CardTitle>
                    <CardDescription>
                      Reserva con hasta 30 días de anticipación
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={fecha}
                      onSelect={setFecha}
                      disabled={(date) => date < today || date > maxDate}
                      modifiers={{
                        event: eventDays
                      }}
                      modifiersStyles={{
                        event: {
                          color: '#f59e0b',
                          fontWeight: 'bold',
                          textDecoration: 'underline'
                        }
                      }}
                      className="p-0 pointer-events-auto border rounded-md"
                      locale={es}
                    />
                    
                    {eventosEspeciales.some(evento => 
                      fecha && evento.fecha.toDateString() === fecha.toDateString()
                    ) && (
                      <Alert className="mt-4 bg-amber-900/20 border-amber-900/30">
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                        <AlertTitle className="text-amber-400">Evento especial</AlertTitle>
                        <AlertDescription>
                          {eventosEspeciales
                            .find(evento => fecha && evento.fecha.toDateString() === fecha.toDateString())
                            ?.descripcion
                          }
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                        Eventos especiales
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Selección de hora y personas */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Detalles de la reserva</CardTitle>
                    <CardDescription>
                      Selecciona la hora y el número de personas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hora">Hora de llegada</Label>
                        <Select value={hora} onValueChange={setHora}>
                          <SelectTrigger id="hora">
                            <SelectValue placeholder="Selecciona una hora" />
                          </SelectTrigger>
                          <SelectContent>
                            {horariosDisponibles.map((horario) => (
                              <SelectItem key={horario} value={horario}>
                                {horario}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="personas">Número de personas</Label>
                        <Select value={personas} onValueChange={setPersonas}>
                          <SelectTrigger id="personas">
                            <SelectValue placeholder="Número de personas" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'persona' : 'personas'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-2 pt-2">
                        <Label>¿Tienes un código VIP?</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder="Ingresa tu código VIP"
                            value={codigoVIP}
                            onChange={(e) => setCodigoVIP(e.target.value)}
                            className="max-w-xs"
                          />
                          <Button onClick={validarCodigoVIP} disabled={!codigoVIP}>
                            Validar
                          </Button>
                        </div>
                        
                        {tieneCodigoVIP && (
                          <p className="text-sm text-green-500 mt-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" /> Código VIP válido. Tienes acceso a mesas premium.
                          </p>
                        )}
                        
                        {!tieneCodigoVIP && !tieneMesasPremiumAccesibles && (
                          <p className="text-sm text-amber-500 mt-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" /> Las mesas Gold solo están disponibles con reserva anticipada o código VIP.
                          </p>
                        )}
                        
                        {!tieneCodigoVIP && tieneMesasPremiumAccesibles && (
                          <p className="text-sm text-green-500 mt-2 flex items-center">
                            <Info className="h-4 w-4 mr-1" /> Estás dentro del horario de reserva anticipada. Puedes seleccionar cualquier mesa disponible.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {!fecha ? (
                <Alert className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Selecciona una fecha</AlertTitle>
                  <AlertDescription>
                    Por favor selecciona una fecha para ver las mesas disponibles.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">Elige tu mesa para {fecha && format(fecha, "EEEE, d 'de' MMMM", { locale: es })}</h2>
                  
                  <Tabs defaultValue="mapa">
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger value="mapa">Mapa de Mesas</TabsTrigger>
                      <TabsTrigger value="lista">Lista de Mesas</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="mapa">
                      <TableMap 
                        mesas={mesasDisponiblesFecha}
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
                            {mesasDisponiblesFecha.map(mesa => (
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
                              {mesasDisponiblesFecha
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
                </>
              )}
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
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CircleDollarSign className="h-5 w-5" />
                      Consumo mínimo requerido
                    </CardTitle>
                    <CardDescription>
                      Para la mesa {mesaSeleccionada?.nombre} ({mesaSeleccionada?.categoria}), 
                      necesitas un consumo mínimo de ${mesaSeleccionada?.precioMinimo}
                    </CardDescription>
                  </div>
                  
                  {paqueteRecomendado && !consumoSuficiente && (
                    <Button 
                      variant="outline" 
                      className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
                      onClick={handleSeleccionarPaquete}
                    >
                      Aplicar paquete recomendado
                    </Button>
                  )}
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
              
              {paqueteRecomendado && !consumoSuficiente && (
                <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
                  <CardHeader>
                    <CardTitle className="text-amber-500">Paquete recomendado</CardTitle>
                    <CardDescription>
                      Te recomendamos este paquete que cumple con el consumo mínimo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="w-full md:w-1/4">
                        <img 
                          src={paqueteRecomendado.imagen} 
                          alt={paqueteRecomendado.nombre} 
                          className="w-full h-40 object-cover rounded-md"
                        />
                      </div>
                      <div className="w-full md:w-3/4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{paqueteRecomendado.nombre}</h3>
                          <p className="text-gray-400">{paqueteRecomendado.descripcion}</p>
                          <p className="text-amber-500 font-bold text-xl mt-2">${paqueteRecomendado.precio}</p>
                        </div>
                        <Button 
                          onClick={() => handleSeleccionarPaquete()}
                          className="w-full md:w-auto"
                        >
                          Añadir paquete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="Paquetes">Paquetes</TabsTrigger>
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
                
                {['Paquetes', 'Botellas', 'Cervezas', 'Cocteles', 'Alimentos'].map(cat => (
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
                    
                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        Al finalizar la reserva, recibirás un correo electrónico de confirmación con los detalles.
                      </p>
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
                        <h3 className="font-medium mb-2">Detalles de la reserva</h3>
                        <div className="p-3 bg-gray-900/50 rounded-md">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <span>Fecha y hora:</span>
                            </div>
                            <span className="font-medium">
                              {fecha ? format(fecha, "EEEE, d 'de' MMMM", { locale: es }) : ''} - {hora}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-gray-400" />
                              <span>Personas:</span>
                            </div>
                            <span className="font-medium">{personas}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Mesa seleccionada</h3>
                        <div className="p-3 bg-gray-900/50 rounded-md">
                          <div className={`h-2 w-24 mb-2 ${mesaSeleccionada?.categoria ? `mesa-${mesaSeleccionada.categoria}` : ''}`} />
                          <p className="font-medium">{mesaSeleccionada?.nombre}</p>
                          <p className="text-sm text-gray-400">Capacidad: {mesaSeleccionada?.capacidad} personas</p>
                          <p className="text-sm text-gray-400">Ubicación: {mesaSeleccionada?.ubicacion}</p>
                          <p className="text-xs bg-gray-800 mt-2 p-1 rounded">Consumo mínimo: ${mesaSeleccionada?.precioMinimo}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Productos seleccionados</h3>
                        <div className="space-y-2">
                          {productos
                            .filter(p => (productosCantidad[p.id] || 0) > 0)
                            .map(producto => (
                              <div key={producto.id} className="flex justify-between p-2 bg-gray-900/50 rounded-md">
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
                  <CardFooter className="bg-gray-900/30 flex justify-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs text-center text-gray-400 flex items-center">
                            <Info className="h-3 w-3 mr-1" /> 
                            Se requiere confirmación de pago al llegar
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">
                            El consumo mínimo se garantiza al llegar. 
                            El cobro total se realizará en el establecimiento.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
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

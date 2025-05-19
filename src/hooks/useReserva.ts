
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Mesa } from '@/components/MesaCard';
import { Producto } from '@/components/ProductCard';

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

// Horarios disponibles por defecto - will be removed later
const horariosDisponibles = ['21:00', '22:00', '23:00', '00:00'];

// Función para verificar si una mesa está disponible para una fecha específica (simulado)
const checkMesaDisponibilidad = (mesaId: number, fecha: Date, tieneCodigoVIP: boolean): { disponible: boolean, motivo?: string } => {
  // Simulamos que algunas mesas no están disponibles en fechas específicas
  if (mesaId === 1 && fecha.getDate() === 25 && fecha.getMonth() === 4) {
    return { disponible: false, motivo: "Reservada para evento privado" };
  }
  
  if (mesaId === 3 && fecha.getDate() === 26 && fecha.getMonth() === 4) {
    return { disponible: false, motivo: "En mantenimiento" };
  }
  
  // Mesas Gold solo disponibles con código VIP
  if ((mesaId === 1 || mesaId === 2) && !tieneCodigoVIP) {
    return { disponible: false, motivo: "Mesa Gold solo disponible con código VIP" };
  }
  
  return { disponible: true };
};

export const useReserva = () => {
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [productosCantidad, setProductosCantidad] = useState<Record<number, number>>({});
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [mesasDisponiblesFecha, setMesasDisponiblesFecha] = useState<Mesa[]>(mesas);
  const [hora, setHora] = useState<string>("21:00"); // Default hora
  const [personas, setPersonas] = useState<string>("2");
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [paso, setPaso] = useState<number>(1);
  const [tieneCodigoVIP, setTieneCodigoVIP] = useState<boolean>(false);
  const [codigoVIP, setCodigoVIP] = useState<string>("");
  const [paqueteRecomendado, setPaqueteRecomendado] = useState<Producto | null>(null);
  const { toast } = useToast();
  
  // Efectos para actualizar la disponibilidad de mesas según la fecha seleccionada
  useEffect(() => {
    if (fecha) {
      // Filtramos las mesas según su disponibilidad para la fecha seleccionada
      const mesasActualizadas = mesas.map(mesa => {
        // Verificamos disponibilidad de la mesa
        const { disponible, motivo } = checkMesaDisponibilidad(mesa.id, fecha, tieneCodigoVIP);
        
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
  }, [fecha, mesaSeleccionada, toast, tieneCodigoVIP]);
  
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
    
    // Si es una mesa Gold pero no tiene código VIP, mostrar alerta
    if (mesa.categoria === 'gold' && !tieneCodigoVIP) {
      toast({
        title: "Mesa VIP restringida",
        description: "Esta mesa requiere un código VIP válido.",
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
    // Código VIP válido
    const codigoValido = "VIP123";
    
    if (codigoVIP.toUpperCase() === codigoValido) {
      toast({
        title: "Código VIP válido",
        description: "El código ha sido aplicado correctamente. Tienes acceso a mesas Gold.",
      });
      setTieneCodigoVIP(true);
      
      // Actualizar disponibilidad de mesas Gold si hay una fecha seleccionada
      if (fecha) {
        const mesasActualizadas = mesasDisponiblesFecha.map(mesa => {
          if (mesa.categoria === 'gold') {
            // Verificar si la mesa está disponible en esta fecha específica
            const { disponible, motivo } = checkMesaDisponibilidad(mesa.id, fecha, true);
            return {
              ...mesa,
              disponible,
              descripcion: disponible 
                ? "Mesa premium con la mejor ubicación y vista panorámica."
                : `No disponible: ${motivo}`
            };
          }
          return mesa;
        });
        
        setMesasDisponiblesFecha(mesasActualizadas);
        
        console.log("Mesas actualizadas después de código VIP:", mesasActualizadas);
      }
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
      
      return {
        success: true,
        data: {
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
      };
    }
    
    return { success: false };
  };
  
  const handlePrevStep = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    }
  };
  
  // Determinar si el usuario tiene acceso a mesas premium
  const tieneMesasPremiumAccesibles = tieneCodigoVIP;
  
  return {
    // Estado
    mesaSeleccionada,
    productosCantidad,
    fecha,
    mesasDisponiblesFecha,
    hora,
    personas,
    nombre,
    telefono,
    email,
    paso,
    tieneCodigoVIP,
    codigoVIP,
    paqueteRecomendado,
    totalProductos,
    consumoMinimo: mesaSeleccionada?.precioMinimo || 0,
    consumoSuficiente: totalProductos >= (mesaSeleccionada?.precioMinimo || 0),
    tieneMesasPremiumAccesibles: tieneCodigoVIP,
    
    // Setters
    setFecha,
    setHora,
    setPersonas,
    setNombre,
    setTelefono,
    setEmail,
    setCodigoVIP,
    
    // Handlers
    handleMesaSelect,
    handleProductCantidadChange,
    handleSeleccionarPaquete,
    validarCodigoVIP,
    handleNextStep,
    handlePrevStep,
    
    // Data
    productos,
    eventosEspeciales,
    horariosDisponibles
  };
};

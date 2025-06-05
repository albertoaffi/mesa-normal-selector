
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Mesa } from '@/components/MesaCard';
import { Producto } from '@/components/ProductCard';
import { useSupabaseMesas } from './useSupabaseMesas';
import { useSupabaseProductos } from './useSupabaseProductos';
import { useSupabaseCodigosVIP } from './useSupabaseCodigosVIP';
import { supabase } from '@/integrations/supabase/client';

const eventosEspeciales = [
  { fecha: new Date(2025, 4, 20), nombre: "DJ Internacional", descripcion: "Noche especial con DJ internacional invitado" },
  { fecha: new Date(2025, 4, 26), nombre: "Fiesta de Espuma", descripcion: "Gran fiesta de espuma en la terraza" },
  { fecha: new Date(2025, 5, 2), nombre: "Pre-Verano", descripcion: "Celebración especial de inicio de verano" },
  { fecha: new Date(2025, 5, 10), nombre: "Noche Tropical", descripcion: "Temática tropical con decoración especial" }
];

const horariosDisponibles = ['21:00', '22:00', '23:00', '00:00'];

const checkMesaDisponibilidad = async (mesaId: number, fecha: Date, tieneCodigoVIP: boolean): Promise<{ disponible: boolean, motivo?: string }> => {
  try {
    // Verificar reservas existentes para esa mesa y fecha
    const { data: reservas, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('mesa_id', mesaId)
      .eq('fecha', fecha.toISOString().split('T')[0])
      .in('estado', ['pendiente', 'confirmada']);

    if (error) {
      console.error('Error checking availability:', error);
      return { disponible: false, motivo: "Error al verificar disponibilidad" };
    }

    if (reservas && reservas.length > 0) {
      return { disponible: false, motivo: "Mesa ya reservada para esta fecha" };
    }

    // Verificar si es mesa Gold y requiere código VIP
    const { data: mesa } = await supabase
      .from('mesas')
      .select('categoria')
      .eq('id', mesaId)
      .single();

    if (mesa?.categoria === 'gold' && !tieneCodigoVIP) {
      return { disponible: false, motivo: "Mesa Gold solo disponible con código VIP" };
    }

    return { disponible: true };
  } catch (error) {
    console.error('Error in checkMesaDisponibilidad:', error);
    return { disponible: false, motivo: "Error al verificar disponibilidad" };
  }
};

export const useReserva = () => {
  const { mesas } = useSupabaseMesas();
  const { productos } = useSupabaseProductos();
  const { validarCodigo, usarCodigo } = useSupabaseCodigosVIP();
  
  const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
  const [productosCantidad, setProductosCantidad] = useState<Record<number, number>>({});
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [mesasDisponiblesFecha, setMesasDisponiblesFecha] = useState<Mesa[]>([]);
  const [hora, setHora] = useState<string>("21:00");
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
    const updateMesasDisponibilidad = async () => {
      if (fecha && mesas.length > 0) {
        const mesasActualizadas = await Promise.all(
          mesas.map(async (mesa) => {
            const { disponible, motivo } = await checkMesaDisponibilidad(mesa.id, fecha, tieneCodigoVIP);
            
            return { 
              ...mesa, 
              disponible,
              descripcion: !disponible ? `No disponible: ${motivo}` : mesa.descripcion 
            };
          })
        );
        
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
    };

    updateMesasDisponibilidad();
  }, [fecha, mesas, tieneCodigoVIP, mesaSeleccionada, toast]);
  
  // Efecto para recomendar un paquete basado en la mesa seleccionada
  useEffect(() => {
    if (mesaSeleccionada && productos.length > 0) {
      const paquetesRecomendados = productos
        .filter(p => p.categoria === 'Paquetes' && p.precio >= mesaSeleccionada.precioMinimo)
        .sort((a, b) => a.precio - b.precio);
      
      if (paquetesRecomendados.length > 0) {
        setPaqueteRecomendado(paquetesRecomendados[0]);
      }
    } else {
      setPaqueteRecomendado(null);
    }
  }, [mesaSeleccionada, productos]);
  
  const handleMesaSelect = (mesa: Mesa) => {
    if (!mesa.disponible) {
      toast({
        title: "Mesa no disponible",
        description: mesa.descripcion || "Esta mesa no está disponible para la fecha seleccionada.",
        variant: "destructive",
      });
      return;
    }
    
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
  
  const validarCodigoVIP = async () => {
    try {
      const esValido = await validarCodigo(codigoVIP);
      
      if (esValido) {
        toast({
          title: "Código VIP válido",
          description: "El código ha sido aplicado correctamente. Tienes acceso a mesas Gold.",
        });
        setTieneCodigoVIP(true);
      } else {
        toast({
          title: "Código inválido",
          description: "El código VIP ingresado no es válido o ha expirado.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al validar el código VIP.",
        variant: "destructive",
      });
    }
  };
  
  const crearReserva = async () => {
    try {
      if (!mesaSeleccionada || !fecha) {
        throw new Error('Datos incompletos para crear reserva');
      }

      // Crear la reserva
      const { data: reserva, error: reservaError } = await supabase
        .from('reservas')
        .insert({
          mesa_id: mesaSeleccionada.id,
          nombre,
          email,
          telefono,
          fecha: fecha.toISOString().split('T')[0],
          hora,
          personas: parseInt(personas),
          total: totalProductos,
          codigo_vip: tieneCodigoVIP ? codigoVIP : null,
          estado: 'pendiente'
        })
        .select()
        .single();

      if (reservaError) throw reservaError;

      // Crear los productos de la reserva
      const productosReserva = productos
        .filter(p => (productosCantidad[p.id] || 0) > 0)
        .map(p => ({
          reserva_id: reserva.id,
          producto_id: p.id,
          cantidad: productosCantidad[p.id],
          precio_unitario: p.precio
        }));

      if (productosReserva.length > 0) {
        const { error: productosError } = await supabase
          .from('reserva_productos')
          .insert(productosReserva);

        if (productosError) throw productosError;
      }

      // Usar el código VIP si se aplicó
      if (tieneCodigoVIP && codigoVIP) {
        await usarCodigo(codigoVIP);
      }

      return reserva.id;
    } catch (error) {
      console.error('Error creating reserva:', error);
      throw error;
    }
  };
  
  const handleNextStep = async () => {
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
      
      try {
        const reservaId = await crearReserva();
        
        toast({
          title: "¡Reserva creada con éxito!",
          description: "Te hemos enviado los detalles por correo electrónico.",
        });
        
        return {
          success: true,
          data: {
            reservaId,
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
      } catch (error) {
        toast({
          title: "Error al crear reserva",
          description: "Hubo un problema al procesar tu reserva. Inténtalo de nuevo.",
          variant: "destructive",
        });
        return { success: false };
      }
    }
    
    return { success: false };
  };
  
  const handlePrevStep = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    }
  };
  
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


import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useSupabaseMesas } from './useSupabaseMesas';
import { useSupabaseProductos } from './useSupabaseProductos';
import { useSupabaseCodigosVIP } from './useSupabaseCodigosVIP';
import { useReservaState } from './reserva/useReservaState';
import { useReservaHandlers } from './reserva/useReservaHandlers';
import { useReservaValidation } from './reserva/useReservaValidation';
import { eventosEspeciales, horariosDisponibles } from './reserva/useReservaConstants';
import { checkMesaDisponibilidad } from './reserva/useMesaAvailability';

export const useReserva = () => {
  const { mesas } = useSupabaseMesas();
  const { productos } = useSupabaseProductos();
  const { validarCodigo, usarCodigo } = useSupabaseCodigosVIP();
  const { toast } = useToast();
  
  const state = useReservaState();
  const {
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
    setMesaSeleccionada,
    setProductosCantidad,
    setFecha,
    setMesasDisponiblesFecha,
    setHora,
    setPersonas,
    setNombre,
    setTelefono,
    setEmail,
    setPaso,
    setTieneCodigoVIP,
    setCodigoVIP,
    setPaqueteRecomendado
  } = state;

  const handlers = useReservaHandlers({
    mesaSeleccionada,
    setMesaSeleccionada,
    productosCantidad,
    setProductosCantidad,
    paqueteRecomendado,
    tieneCodigoVIP
  });

  const calcularTotalProductos = () => {
    return productos.reduce((total, producto) => {
      const cantidad = productosCantidad[producto.id] || 0;
      return total + (producto.precio * cantidad);
    }, 0);
  };
  
  const totalProductos = calcularTotalProductos();
  const consumoMinimo = mesaSeleccionada?.precioMinimo || 0;
  const consumoSuficiente = totalProductos >= consumoMinimo;

  const validation = useReservaValidation({
    fecha,
    mesaSeleccionada,
    hora,
    personas,
    nombre,
    telefono,
    email,
    productos,
    productosCantidad,
    totalProductos,
    consumoMinimo,
    consumoSuficiente,
    tieneCodigoVIP,
    codigoVIP,
    usarCodigo
  });
  
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
  
  const handleNextStep = async () => {
    if (paso === 1) {
      if (validation.validateStep(1)) {
        setPaso(2);
        return { success: true };
      }
    } else if (paso === 2) {
      if (validation.validateStep(2)) {
        setPaso(3);
        return { success: true };
      }
    } else if (paso === 3) {
      if (validation.validateStep(3)) {
        try {
          const reservaId = await validation.crearReserva();
          
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
    handleMesaSelect: handlers.handleMesaSelect,
    handleProductCantidadChange: handlers.handleProductCantidadChange,
    handleSeleccionarPaquete: handlers.handleSeleccionarPaquete,
    validarCodigoVIP,
    handleNextStep,
    handlePrevStep,
    
    // Data
    productos,
    eventosEspeciales,
    horariosDisponibles
  };
};

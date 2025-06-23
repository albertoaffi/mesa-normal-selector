
import { useToast } from "@/hooks/use-toast";
import { Mesa } from '@/components/MesaCard';
import { Producto } from '@/components/ProductCard';

interface UseReservaHandlersProps {
  mesaSeleccionada: Mesa | null;
  setMesaSeleccionada: (mesa: Mesa | null) => void;
  productosCantidad: Record<number, number>;
  setProductosCantidad: (value: Record<number, number> | ((prev: Record<number, number>) => Record<number, number>)) => void;
  paqueteRecomendado: Producto | null;
  tieneCodigoVIP: boolean;
}

export const useReservaHandlers = ({
  mesaSeleccionada,
  setMesaSeleccionada,
  productosCantidad,
  setProductosCantidad,
  paqueteRecomendado,
  tieneCodigoVIP
}: UseReservaHandlersProps) => {
  const { toast } = useToast();

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

  return {
    handleMesaSelect,
    handleProductCantidadChange,
    handleSeleccionarPaquete
  };
};

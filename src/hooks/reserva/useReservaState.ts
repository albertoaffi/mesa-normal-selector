
import { useState } from 'react';
import { Mesa } from '@/components/MesaCard';
import { Producto } from '@/components/ProductCard';

export const useReservaState = () => {
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

  return {
    // State
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
    
    // Setters
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
  };
};

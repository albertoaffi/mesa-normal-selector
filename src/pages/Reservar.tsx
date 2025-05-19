
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { useReserva } from '@/hooks/useReserva';
import ReservaProgressBar from '@/components/reserva/ReservaProgressBar';
import ReservaCalendario from '@/components/reserva/ReservaCalendario';
import ReservaDetalles from '@/components/reserva/ReservaDetalles';
import ReservaMesas from '@/components/reserva/ReservaMesas';
import ReservaProductos from '@/components/reserva/ReservaProductos';
import ReservaFormulario from '@/components/reserva/ReservaFormulario';

const Reservar = () => {
  const navigate = useNavigate();
  const reserva = useReserva();

  const handleConfirmarReserva = () => {
    const result = reserva.handleNextStep();
    if (result.success && result.data) {
      navigate('/confirmacion', { state: result.data });
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
          
          <ReservaProgressBar paso={reserva.paso} />
          
          {/* Paso 1: Selección de fecha y mesa */}
          {reserva.paso === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Selecciona fecha y mesa</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Calendario */}
                <div className="lg:col-span-1">
                  <ReservaCalendario 
                    fecha={reserva.fecha} 
                    setFecha={reserva.setFecha} 
                    eventosEspeciales={reserva.eventosEspeciales}
                  />
                </div>

                {/* Selección de personas y código VIP */}
                <div className="lg:col-span-2">
                  <ReservaDetalles
                    personas={reserva.personas}
                    setPersonas={reserva.setPersonas}
                    codigoVIP={reserva.codigoVIP}
                    setCodigoVIP={reserva.setCodigoVIP}
                    tieneCodigoVIP={reserva.tieneCodigoVIP}
                    validarCodigoVIP={reserva.validarCodigoVIP}
                    tieneMesasPremiumAccesibles={reserva.tieneMesasPremiumAccesibles}
                  />
                </div>
              </div>
              
              <ReservaMesas 
                fecha={reserva.fecha}
                mesasDisponiblesFecha={reserva.mesasDisponiblesFecha}
                mesaSeleccionada={reserva.mesaSeleccionada}
                handleMesaSelect={reserva.handleMesaSelect}
              />
            </div>
          )}
          
          {/* Paso 2: Selección de productos */}
          {reserva.paso === 2 && (
            <ReservaProductos 
              mesaSeleccionada={reserva.mesaSeleccionada}
              productos={reserva.productos}
              productosCantidad={reserva.productosCantidad}
              totalProductos={reserva.totalProductos}
              consumoMinimo={reserva.consumoMinimo}
              consumoSuficiente={reserva.consumoSuficiente}
              paqueteRecomendado={reserva.paqueteRecomendado}
              handleProductCantidadChange={reserva.handleProductCantidadChange}
              handleSeleccionarPaquete={reserva.handleSeleccionarPaquete}
            />
          )}
          
          {/* Paso 3: Datos personales */}
          {reserva.paso === 3 && (
            <ReservaFormulario 
              nombre={reserva.nombre}
              setNombre={reserva.setNombre}
              telefono={reserva.telefono}
              setTelefono={reserva.setTelefono}
              email={reserva.email}
              setEmail={reserva.setEmail}
              mesaSeleccionada={reserva.mesaSeleccionada}
              fecha={reserva.fecha}
              hora={reserva.hora}
              personas={reserva.personas}
              productos={reserva.productos}
              productosCantidad={reserva.productosCantidad}
              totalProductos={reserva.totalProductos}
            />
          )}
          
          <div className="mt-8 flex justify-between">
            {reserva.paso > 1 && (
              <Button 
                variant="outline" 
                onClick={reserva.handlePrevStep}
              >
                Anterior
              </Button>
            )}
            {reserva.paso === 1 && <div></div>}
            
            <Button 
              className="bg-club-gold text-black hover:bg-opacity-90"
              onClick={reserva.paso < 3 ? reserva.handleNextStep : handleConfirmarReserva}
            >
              {reserva.paso < 3 ? 'Siguiente' : 'Confirmar Reserva'}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reservar;

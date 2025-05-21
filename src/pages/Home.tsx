
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RefundDialog from '@/components/RefundDialog';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80')" 
            }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-20 text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">THE NORMAL</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto font-light">
              La mejor experiencia nocturna con reservas de mesa VIP y servicio personalizado
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-6">
              <Button 
                variant="gold"
                size="xl"
                className="rounded-md"
                onClick={() => navigate('/reservar')}
              >
                Reservar Ahora
              </Button>
              <Button 
                variant="purple"
                size="xl"
                className="rounded-md"
                onClick={() => navigate('/guest-list')}
              >
                Guest List
              </Button>
            </div>
            <div className="mt-4">
              <RefundDialog />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-6 mb-16">
            <h2 className="text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
              Una experiencia exclusiva
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="backdrop-blur-lg bg-black/40 p-8 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/5">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-600/20 to-amber-400/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Mesas Premium</h3>
                <p className="text-gray-400 text-lg">Selecciona entre diferentes categorías de mesas según tu presupuesto y preferencias.</p>
              </div>
              
              <div className="backdrop-blur-lg bg-black/40 p-8 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/5">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-600/20 to-amber-400/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Pedido Anticipado</h3>
                <p className="text-gray-400 text-lg">Selecciona tus bebidas y alimentos favoritos para que estén listos al llegar.</p>
              </div>
              
              <div className="backdrop-blur-lg bg-black/40 p-8 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/5">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-600/20 to-amber-400/10 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Servicio VIP</h3>
                <p className="text-gray-400 text-lg">Atención personalizada y acceso prioritario sin hacer filas.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 relative bg-black">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-8 text-white">
              ¿Listo para una noche inolvidable?
            </h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-xl">
              Reserva ahora tu mesa en The Normal y disfruta de la mejor experiencia nocturna. 
              Elige tus bebidas favoritas y tenlas listas en tu mesa al llegar.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                variant="gold"
                size="lg" 
                className="px-8 py-6 text-lg font-semibold rounded-md"
                onClick={() => navigate('/reservar')}
              >
                Reservar Mesa
              </Button>
              <Button 
                variant="purple"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-md"
                onClick={() => navigate('/guest-list')}
              >
                Entrar en Guest List
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;

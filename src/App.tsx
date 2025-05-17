
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Reservar from "./pages/Reservar";
import Confirmacion from "./pages/Confirmacion";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import GuestList from "./pages/GuestList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/guest-list" element={<GuestList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

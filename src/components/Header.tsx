
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Ticket, Coffee, User, LayoutDashboard } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define user role types for the application
export type UserRole = 'guest' | 'regular' | 'vip' | 'staff' | 'admin';

// Mock user state - this would come from auth context in a real app
const mockUser = {
  name: "Usuario Demo",
  role: 'vip' as UserRole,
  accessCode: "VIP2025",
  isLoggedIn: true
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // In a real app, this would call your logout function
    console.log("User logged out");
    // navigate('/login');
  };

  // Access level indicator badge based on user role
  const renderAccessBadge = () => {
    if (!mockUser.isLoggedIn) return null;
    
    const badgeStyles = {
      'guest': "bg-gray-200 text-gray-800",
      'regular': "bg-green-200 text-green-800",
      'vip': "bg-amber-200 text-amber-800",
      'staff': "bg-blue-200 text-blue-800",
      'admin': "bg-purple-200 text-purple-800"
    };
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${badgeStyles[mockUser.role]}`}>
        {mockUser.role.toUpperCase()}
      </span>
    );
  };

  return (
    <header className="py-6 px-6 md:px-10 flex justify-between items-center backdrop-blur-lg bg-black/80 border-b border-white/10 sticky top-0 z-50">
      <div 
        className="text-3xl md:text-4xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600 hover:opacity-80 transition-opacity"
        onClick={() => navigate('/')}
      >
        THE NORMAL
      </div>
      <nav>
        <ul className="flex items-center space-x-4 md:space-x-6">
          <li className="hidden md:block">
            <Button 
              onClick={() => navigate('/reservar')}
              variant={isActive('/reservar') ? "gold" : "glass"}
              className="transition-all"
              size="sm"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Reservar Mesa
            </Button>
          </li>
          <li className="hidden md:block">
            <Button 
              onClick={() => navigate('/guest-list')}
              variant={isActive('/guest-list') ? "purple" : "glass"}
              className="transition-all"
              size="sm"
            >
              <Ticket className="mr-2 h-4 w-4" />
              Guest List
            </Button>
          </li>
          <li>
            <Button 
              onClick={() => navigate('/contacto')}
              variant={isActive('/contacto') ? "glossy" : "glass"}
              className="transition-all"
              size="sm"
            >
              <Coffee className="mr-2 h-4 w-4" />
              Contacto
            </Button>
          </li>
          {mockUser.role === 'admin' || mockUser.role === 'staff' ? (
            <li>
              <Button 
                onClick={() => navigate('/admin')}
                variant={isActive('/admin') ? "default" : "glass"}
                className="transition-all bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </li>
          ) : null}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="border border-gray-800 rounded-full w-9 h-9"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {mockUser.isLoggedIn ? (
                  <>
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Mi Cuenta</span>
                      {renderAccessBadge()}
                    </DropdownMenuLabel>
                    {mockUser.role === 'vip' && (
                      <DropdownMenuItem className="text-amber-500 flex justify-between">
                        Código VIP
                        <span className="font-mono bg-gray-100 text-gray-800 px-1 rounded text-xs">{mockUser.accessCode}</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/perfil')}>
                      Mi Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/mis-reservas')}>
                      Mis Reservas
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/login')}>
                      Iniciar Sesión
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/registro')}>
                      Registrarse
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

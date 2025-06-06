import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users from reservas and guest_list
  const { data: reservaUsers = [], isLoading: loadingReservas } = useQuery({
    queryKey: ['reserva-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservas')
        .select('nombre, email, telefono, created_at, estado')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: guestUsers = [], isLoading: loadingGuests } = useQuery({
    queryKey: ['guest-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_list')
        .select('nombre, email, telefono, created_at, checked_in')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Combine and deduplicate users
  const allUsers = React.useMemo(() => {
    const combined = [
      ...reservaUsers.map(user => ({ ...user, tipo: 'reserva' as const })),
      ...guestUsers.map(user => ({ ...user, tipo: 'guest_list' as const }))
    ];

    // Deduplicate by email
    const unique = combined.reduce((acc, user) => {
      const existing = acc.find(u => u.email === user.email);
      if (!existing) {
        acc.push(user);
      } else {
        // Keep the most recent interaction
        if (new Date(user.created_at) > new Date(existing.created_at)) {
          const index = acc.indexOf(existing);
          acc[index] = user;
        }
      }
      return acc;
    }, [] as typeof combined);

    return unique.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [reservaUsers, guestUsers]);

  // Filter users based on search term
  const filteredUsers = allUsers.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telefono.includes(searchTerm)
  );

  const isLoading = loadingReservas || loadingGuests;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Gestión de Usuarios</CardTitle>
              <CardDescription>
                Administra los usuarios que han interactuado con el sistema
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="font-semibold">{filteredUsers.length}</p>
              <p className="text-xs text-muted-foreground">Usuarios únicos</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Última Actividad</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <TableRow key={`${user.email}-${index}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.nombre}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.telefono}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), "dd/MM/yyyy HH:mm", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.tipo === 'reserva' ? 'default' : 'secondary'}>
                          {user.tipo === 'reserva' ? 'Reserva' : 'Guest List'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          (user.tipo === 'reserva' && user.estado === 'confirmada') ||
                          (user.tipo === 'guest_list' && user.checked_in)
                            ? 'default' 
                            : 'secondary'
                        }>
                          {user.tipo === 'reserva' 
                            ? user.estado 
                            : user.checked_in ? 'Registrado' : 'Pendiente'
                          }
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              navigator.clipboard.writeText(user.email);
                              toast({
                                title: "Email copiado",
                                description: "El email ha sido copiado al portapapeles.",
                              });
                            }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? 'No se encontraron usuarios con ese término de búsqueda' : 'No hay usuarios registrados aún'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {allUsers.filter(u => u.tipo === 'reserva').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Usuarios con Reservas</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {allUsers.filter(u => u.tipo === 'guest_list').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Usuarios en Guest List</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {allUsers.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Usuarios Únicos</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;

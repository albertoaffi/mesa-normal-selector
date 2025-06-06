
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Dashboard = () => {
  // Fetch reservas data
  const { data: reservas = [] } = useQuery({
    queryKey: ['admin-reservas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          *,
          mesas (nombre, categoria)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch guest list data
  const { data: guestList = [] } = useQuery({
    queryKey: ['admin-guest-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_list')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch mesas data
  const { data: mesas = [] } = useQuery({
    queryKey: ['admin-mesas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mesas')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const reservasHoy = reservas.filter(r => r.fecha === today);
  const guestListHoy = guestList.filter(g => g.fecha === today);
  const totalIngresos = reservas.reduce((sum, r) => sum + (r.total || 0), 0);
  const mesasDisponibles = mesas.filter(m => m.disponible).length;

  // Recent activity
  const actividadReciente = [
    ...reservas.slice(0, 3).map(r => ({
      tipo: 'reserva',
      descripcion: `Nueva reserva: ${r.nombre} - Mesa ${r.mesas?.nombre}`,
      tiempo: r.created_at,
      estado: r.estado
    })),
    ...guestList.slice(0, 2).map(g => ({
      tipo: 'guest_list',
      descripcion: `Guest List: ${g.nombre} - ${g.invitados} personas`,
      tiempo: g.created_at,
      estado: g.checked_in ? 'confirmada' : 'pendiente'
    }))
  ].sort((a, b) => new Date(b.tiempo).getTime() - new Date(a.tiempo).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservasHoy.length}</div>
            <p className="text-xs text-muted-foreground">
              Total reservas: {reservas.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guest List Hoy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guestListHoy.length}</div>
            <p className="text-xs text-muted-foreground">
              Total invitados: {guestList.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIngresos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Desde reservas confirmadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mesas Disponibles</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mesasDisponibles}</div>
            <p className="text-xs text-muted-foreground">
              de {mesas.length} mesas totales
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Reservas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservas.slice(0, 5).map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{reserva.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      {reserva.mesas?.nombre} - {format(new Date(reserva.fecha), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      reserva.estado === 'confirmada' ? 'default' : 
                      reserva.estado === 'pendiente' ? 'secondary' : 'destructive'
                    }>
                      {reserva.estado}
                    </Badge>
                    <p className="text-sm text-muted-foreground">${reserva.total}</p>
                  </div>
                </div>
              ))}
              {reservas.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No hay reservas aún
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actividadReciente.map((actividad, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {actividad.tipo === 'reserva' ? (
                      <Calendar className="h-4 w-4 text-blue-500 mt-1" />
                    ) : (
                      <Users className="h-4 w-4 text-green-500 mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{actividad.descripcion}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(actividad.tiempo), "dd/MM/yyyy HH:mm", { locale: es })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {actividad.estado}
                  </Badge>
                </div>
              ))}
              {actividadReciente.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No hay actividad reciente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Día - {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservasHoy.map((reserva) => (
                <TableRow key={reserva.id}>
                  <TableCell>
                    <Badge variant="outline">Reserva</Badge>
                  </TableCell>
                  <TableCell>{reserva.nombre}</TableCell>
                  <TableCell>
                    {reserva.mesas?.nombre} - {reserva.personas} personas
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      reserva.estado === 'confirmada' ? 'default' : 
                      reserva.estado === 'pendiente' ? 'secondary' : 'destructive'
                    }>
                      {reserva.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{reserva.hora}</TableCell>
                </TableRow>
              ))}
              {guestListHoy.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50">Guest List</Badge>
                  </TableCell>
                  <TableCell>{guest.nombre}</TableCell>
                  <TableCell>{guest.invitados} personas</TableCell>
                  <TableCell>
                    <Badge variant={guest.checked_in ? 'default' : 'secondary'}>
                      {guest.checked_in ? 'Registrado' : 'Pendiente'}
                    </Badge>
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {reservasHoy.length === 0 && guestListHoy.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No hay actividad programada para hoy
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

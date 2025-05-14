
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowUp, ArrowDown, CircleDollarSign, Users, Calendar, Coffee, Clock } from "lucide-react";

// Datos de ejemplo para los gráficos
const revenueData = [
  { name: 'Lun', value: 3200 },
  { name: 'Mar', value: 4500 },
  { name: 'Mié', value: 3800 },
  { name: 'Jue', value: 5100 },
  { name: 'Vie', value: 6800 },
  { name: 'Sáb', value: 8200 },
  { name: 'Dom', value: 7500 },
];

const categoriesData = [
  { name: 'Gold', value: 35, color: '#FFD700' },
  { name: 'Silver', value: 25, color: '#C0C0C0' },
  { name: 'Bronze', value: 20, color: '#CD7F32' },
  { name: 'Purple', value: 15, color: '#800080' },
  { name: 'Red', value: 5, color: '#FF0000' },
];

const recentReservations = [
  { id: 1, cliente: 'Juan Pérez', mesa: 'Mesa Gold 2', fecha: '15/05/2025', hora: '20:00', personas: 6, estado: 'Confirmada' },
  { id: 2, cliente: 'Ana López', mesa: 'Mesa Silver 3', fecha: '15/05/2025', hora: '21:30', personas: 4, estado: 'Pendiente' },
  { id: 3, cliente: 'Carlos Ruiz', mesa: 'Mesa Bronze 1', fecha: '16/05/2025', hora: '19:45', personas: 2, estado: 'Confirmada' },
  { id: 4, cliente: 'María González', mesa: 'Mesa Gold 1', fecha: '16/05/2025', hora: '20:30', personas: 8, estado: 'Cancelada' },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">$45,231.89</div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowUp className="h-4 w-4" />
                <span className="text-xs">12.5%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">+2.5% vs. semana anterior</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">+573</div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowUp className="h-4 w-4" />
                <span className="text-xs">8.2%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">+189 nuevas esta semana</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">+2,835</div>
              <div className="flex items-center gap-1 text-rose-500">
                <ArrowDown className="h-4 w-4" />
                <span className="text-xs">3.1%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">-42 vs. semana anterior</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ocupación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">78.5%</div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowUp className="h-4 w-4" />
                <span className="text-xs">4.3%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground">+5.1% vs. semana anterior</p>
          </CardFooter>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5" />
              <span>Ingresos por día</span>
            </CardTitle>
            <CardDescription>Datos de los últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${value}`, 'Ingresos']} />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              <span>Distribución de mesas por categoría</span>
            </CardTitle>
            <CardDescription>Porcentaje de reservas por tipo de mesa</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoriesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de reservas recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Reservas recientes</span>
          </CardTitle>
          <CardDescription>Últimas reservas realizadas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Mesa</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Personas</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.cliente}</TableCell>
                  <TableCell>{reservation.mesa}</TableCell>
                  <TableCell>{reservation.fecha}</TableCell>
                  <TableCell>{reservation.hora}</TableCell>
                  <TableCell>{reservation.personas}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        reservation.estado === 'Confirmada' 
                          ? 'bg-green-100 text-green-800' 
                          : reservation.estado === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {reservation.estado}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <p className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            Actualizado: 14 de Mayo, 2025 - 14:30
          </p>
        </CardFooter>
      </Card>

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Usuarios registrados</span>
            </CardTitle>
            <CardDescription>Últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,248</div>
            <div className="mt-2 flex items-center text-sm text-emerald-600">
              <ArrowUp className="mr-1 h-4 w-4" />
              <span>+15.3% vs. mes anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mesa más reservada</CardTitle>
            <CardDescription>En el último mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mesa Gold 1</div>
            <div className="mt-1 text-base">42 reservas este mes</div>
            <div className="mt-2 flex items-center text-sm text-emerald-600">
              <ArrowUp className="mr-1 h-4 w-4" />
              <span>12% más que Mesa Gold 2</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Horario más solicitado</CardTitle>
            <CardDescription>Último mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21:00 - 22:00</div>
            <div className="mt-1 text-base">186 reservas en este horario</div>
            <div className="mt-2 flex items-center text-sm text-emerald-600">
              <ArrowUp className="mr-1 h-4 w-4" />
              <span>24% de todas las reservas</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

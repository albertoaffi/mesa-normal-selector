
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Check, Trash2, Search, Users, Calendar as CalendarIcon2, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsContent as TabsContentBase, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface GuestEntry {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fecha: Date | string;
  invitados: number[];
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
  tipoAcceso: 'regular' | 'vip';
  codigoAcceso?: string;
}

// Initial sample guest list data
const initialGuestList: GuestEntry[] = [
  {
    id: 1,
    nombre: "Laura Martínez",
    email: "laura@ejemplo.com",
    telefono: "555-123-4567",
    fecha: new Date(2025, 4, 25),
    invitados: [{ nombre: "Carlos Ruiz", email: "carlos@ejemplo.com", telefono: "555-234-5678" }],
    estado: 'confirmado',
    tipoAcceso: 'vip',
    codigoAcceso: 'VIP2025A'
  },
  {
    id: 2,
    nombre: "Roberto Sánchez",
    email: "roberto@ejemplo.com",
    telefono: "555-987-6543",
    fecha: new Date(2025, 4, 25),
    invitados: [],
    estado: 'pendiente',
    tipoAcceso: 'regular'
  },
  {
    id: 3,
    nombre: "Carmen Rodríguez",
    email: "carmen@ejemplo.com",
    telefono: "555-456-7890",
    fecha: new Date(2025, 4, 26),
    invitados: [
      { nombre: "Juan Pérez", email: "juan@ejemplo.com", telefono: "555-345-6789" },
      { nombre: "Ana López", email: "ana@ejemplo.com", telefono: "555-456-7890" },
      { nombre: "Diego Moreno", email: "diego@ejemplo.com", telefono: "555-567-8901" }
    ],
    estado: 'confirmado',
    tipoAcceso: 'regular'
  },
  {
    id: 4,
    nombre: "Daniel García",
    email: "daniel@ejemplo.com",
    telefono: "555-789-0123",
    fecha: new Date(2025, 4, 26),
    invitados: [{ nombre: "María González", email: "maria@ejemplo.com", telefono: "555-678-9012" }],
    estado: 'cancelado',
    tipoAcceso: 'vip',
    codigoAcceso: 'VIP2025B'
  },
  {
    id: 5,
    nombre: "Patricia Gómez",
    email: "patricia@ejemplo.com",
    telefono: "555-654-3210",
    fecha: new Date(2025, 4, 27),
    invitados: [
      { nombre: "Luis Hernández", email: "luis@ejemplo.com", telefono: "555-789-0123" },
      { nombre: "Elena Torres", email: "elena@ejemplo.com", telefono: "555-890-1234" }
    ],
    estado: 'pendiente',
    tipoAcceso: 'regular'
  },
];

const GuestListManagement: React.FC = () => {
  const [guestList, setGuestList] = useState<GuestEntry[]>(initialGuestList);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [guestListLimit, setGuestListLimit] = useState<number>(50);
  const [guestListEnabled, setGuestListEnabled] = useState<boolean>(true);
  
  // Count total guests including companions
  const totalGuests = guestList.reduce((total, entry) => {
    return total + 1 + entry.invitados.length;
  }, 0);
  
  // Filter guests based on search and selected date
  const filteredGuestList = guestList.filter(guest => {
    const matchesSearch = 
      guest.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.telefono.includes(searchTerm);
      
    const matchesDate = selectedDate 
      ? (guest.fecha instanceof Date 
        ? guest.fecha.toDateString() === selectedDate.toDateString()
        : new Date(guest.fecha).toDateString() === selectedDate.toDateString())
      : true;
      
    return matchesSearch && matchesDate;
  });
  
  const handleStatusChange = (id: number, newStatus: 'pendiente' | 'confirmado' | 'cancelado' | 'completado') => {
    setGuestList(guestList.map(guest => 
      guest.id === id ? { ...guest, estado: newStatus } : guest
    ));
    
    toast({
      title: "Estado actualizado",
      description: `El estado del invitado ha sido actualizado a ${newStatus}`,
    });
  };
  
  const handleGuestDelete = (id: number) => {
    if (confirm("¿Estás seguro que deseas eliminar este registro?")) {
      setGuestList(guestList.filter(guest => guest.id !== id));
      
      toast({
        title: "Registro eliminado",
        description: "El registro ha sido eliminado de la lista de invitados",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveLimit = () => {
    toast({
      title: "Límite guardado",
      description: `El límite de la guest list ha sido actualizado a ${guestListLimit}`,
    });
  };
  
  const handleToggleGuestList = (enabled: boolean) => {
    setGuestListEnabled(enabled);
    
    toast({
      title: enabled ? "Guest list activada" : "Guest list desactivada",
      description: enabled 
        ? "La guest list ha sido activada y ahora está abierta para registros"
        : "La guest list ha sido desactivada y no se permitirán nuevos registros",
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pendiente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendiente</Badge>;
      case 'confirmado':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Confirmado</Badge>;
      case 'cancelado':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelado</Badge>;
      case 'completado':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Completado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getAccessTypeBadge = (type: string) => {
    switch(type) {
      case 'vip':
        return <Badge className="bg-amber-500">VIP</Badge>;
      case 'regular':
        return <Badge variant="outline">Regular</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'VIP';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl">Gestión de Guest List</CardTitle>
            <CardDescription>
              Administra la lista de invitados del club
            </CardDescription>
          </div>
          
          <div className="flex space-x-2 items-center">
            <div className="flex items-center space-x-2">
              <Switch 
                id="guest-list-status"
                checked={guestListEnabled}
                onCheckedChange={handleToggleGuestList}
              />
              <Label htmlFor="guest-list-status" className={guestListEnabled ? "text-green-500" : "text-red-500"}>
                {guestListEnabled ? "Activada" : "Desactivada"}
              </Label>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Guest List Stats and Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de invitados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalGuests}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {guestList.length} registros principales + {totalGuests - guestList.length} acompañantes
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Capacidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="text-2xl font-bold flex justify-between items-center">
                    <span>{guestListLimit}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {Math.round((totalGuests / guestListLimit) * 100)}% ocupado
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className={`h-2.5 rounded-full ${
                        (totalGuests / guestListLimit) > 0.8 ? 'bg-red-600' : 'bg-green-600'
                      }`} 
                      style={{width: `${Math.min(100, (totalGuests / guestListLimit) * 100)}%`}}
                    ></div>
                  </div>
                  <div className="flex gap-2 items-center mt-1">
                    <Input 
                      type="number" 
                      value={guestListLimit}
                      onChange={(e) => setGuestListLimit(Number(e.target.value))}
                      className="w-24"
                      min={1}
                    />
                    <Button size="sm" onClick={handleSaveLimit}>Guardar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Filtrar por fecha</CardTitle>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {selectedDate && (
                  <Button 
                    variant="ghost" 
                    className="mt-2 w-full text-sm" 
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Limpiar filtro
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Guest List Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Invitados</TableHead>
                  <TableHead>Acceso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuestList.length > 0 ? (
                  filteredGuestList.map(guest => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">{guest.nombre}</TableCell>
                      <TableCell>
                        <div>{guest.email}</div>
                        <div className="text-sm text-gray-500">{guest.telefono}</div>
                      </TableCell>
                      <TableCell>
                        {guest.fecha instanceof Date 
                          ? format(guest.fecha, "dd/MM/yyyy")
                          : format(new Date(guest.fecha), "dd/MM/yyyy")
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{guest.invitados.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-1">
                          {getAccessTypeBadge(guest.tipoAcceso)}
                          {guest.codigoAcceso && (
                            <span className="text-xs font-mono bg-gray-100 px-1 py-0.5 rounded dark:bg-gray-800">
                              {guest.codigoAcceso}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(guest.estado)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newStatus = guest.estado === 'pendiente' ? 'confirmado' : 
                                             guest.estado === 'confirmado' ? 'completado' : 'pendiente';
                              handleStatusChange(guest.id, newStatus);
                            }}
                          >
                            {guest.estado === 'pendiente' && "Confirmar"}
                            {guest.estado === 'confirmado' && "Completar"}
                            {guest.estado === 'completado' && "Pendiente"}
                            {guest.estado === 'cancelado' && "Reactivar"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleGuestDelete(guest.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm || selectedDate ? (
                        <div className="flex flex-col items-center">
                          <p>No se encontraron resultados para tu búsqueda.</p>
                          <Button 
                            variant="link" 
                            onClick={() => { 
                              setSearchTerm('');
                              setSelectedDate(undefined);
                            }}
                          >
                            Limpiar filtros
                          </Button>
                        </div>
                      ) : (
                        <p>No hay invitados registrados aún.</p>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Exportar a CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const newGuest = {
                  id: Math.max(...guestList.map(g => g.id)) + 1,
                  nombre: "Nuevo VIP",
                  email: "vip@ejemplo.com",
                  telefono: "555-000-0000",
                  fecha: new Date(),
                  invitados: [],
                  estado: 'confirmado' as const,
                  tipoAcceso: 'vip' as const,
                  codigoAcceso: generateRandomCode()
                };
                setGuestList([...guestList, newGuest]);
                toast({
                  title: "VIP añadido",
                  description: `Se ha creado un nuevo código VIP: ${newGuest.codigoAcceso}`,
                });
              }}
            >
              Generar Código VIP
            </Button>
          </div>
          <p className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            Actualizado: {format(new Date(), "dd/MM/yyyy HH:mm")}
          </p>
        </CardFooter>
      </Card>
      
      {/* Calendar View Tab */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon2 className="h-5 w-5" />
            <span>Calendario de Guest List</span>
          </CardTitle>
          <CardDescription>Vista de ocupación por fecha</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
              <TabsTrigger value="upcoming">Próximos días</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar">
              <div className="flex justify-center">
                <Calendar 
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="p-0 pointer-events-auto"
                  modifiers={{
                    highlighted: guestList
                      .map(g => g.fecha instanceof Date ? g.fecha : new Date(g.fecha))
                  }}
                  modifiersStyles={{
                    highlighted: {
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      borderColor: 'rgba(139, 92, 246, 0.5)'
                    }
                  }}
                />
              </div>
              
              <div className="mt-4">
                {selectedDate && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Invitados para {format(selectedDate, "PPP")}</h3>
                    <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                      {filteredGuestList.length > 0 ? (
                        <div>
                          <p className="mb-2">
                            Total: {filteredGuestList.length} registros principales ({
                              filteredGuestList.reduce((total, entry) => total + 1 + entry.invitados.length, 0)
                            } personas)
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {filteredGuestList.map(guest => (
                              <div 
                                key={guest.id} 
                                className="border rounded p-2 bg-white dark:bg-gray-900"
                              >
                                <div className="font-medium flex justify-between">
                                  {guest.nombre}
                                  {getAccessTypeBadge(guest.tipoAcceso)}
                                </div>
                                <div className="text-sm">
                                  {guest.invitados.length} invitado(s)
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center">No hay invitados para esta fecha.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="space-y-4">
                {Array.from({ length: 7 }).map((_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() + index);
                  
                  const guestsOnDate = guestList.filter(guest => {
                    const guestDate = guest.fecha instanceof Date ? guest.fecha : new Date(guest.fecha);
                    return guestDate.toDateString() === date.toDateString();
                  });
                  
                  const totalPeople = guestsOnDate.reduce(
                    (total, entry) => total + 1 + entry.invitados.length, 0
                  );
                  
                  return (
                    <Card key={index}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-md">{format(date, "EEEE, d 'de' MMMM")}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        {guestsOnDate.length > 0 ? (
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span>{totalPeople} personas</span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedDate(date)}
                              >
                                Ver detalle
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {guestsOnDate.slice(0, 4).map(guest => (
                                <div 
                                  key={guest.id} 
                                  className="text-sm border rounded p-1 flex justify-between items-center"
                                >
                                  <span>{guest.nombre}</span>
                                  {getAccessTypeBadge(guest.tipoAcceso)}
                                </div>
                              ))}
                              {guestsOnDate.length > 4 && (
                                <div className="text-sm text-center p-1 border rounded border-dashed">
                                  +{guestsOnDate.length - 4} más...
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center">Sin reservaciones para este día</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestListManagement;

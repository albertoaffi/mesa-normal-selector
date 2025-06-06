import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { AlertCircle, Search, UserPlus, QrCode, Trash, CalendarIcon, ClipboardCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';

interface GuestListEntry {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fecha: string;
  invitados: number;
  codigo: string;
  checked_in: boolean;
  created_at: string;
}

const GuestListManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedGuest, setSelectedGuest] = useState<GuestListEntry | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [guestListLimit, setGuestListLimit] = useState(80);
  
  // Fetch guest list data from Supabase
  const { data: guestList = [], isLoading } = useQuery({
    queryKey: ['guest-list-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_list')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching guest list:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  // Update check-in status mutation
  const checkInMutation = useMutation({
    mutationFn: async ({ id, checked_in }: { id: string; checked_in: boolean }) => {
      const { error } = await supabase
        .from('guest_list')
        .update({ checked_in: !checked_in })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-list-admin'] });
    }
  });

  // Delete guest mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('guest_list')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-list-admin'] });
    }
  });
  
  // Calculate total guests correctly
  const totalInvitados = guestList.reduce((sum, entry) => sum + entry.invitados, 0);
  
  // Filter by search and date
  const filteredGuests = guestList.filter(entry => {
    const matchesSearch = 
      entry.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate 
      ? new Date(entry.fecha).toDateString() === selectedDate.toDateString()
      : true;
    
    return matchesSearch && matchesDate;
  });
  
  const handleCheckIn = (entry: GuestListEntry) => {
    checkInMutation.mutate({ id: entry.id, checked_in: entry.checked_in }, {
      onSuccess: () => {
        toast({
          title: entry.checked_in ? "Check-in revertido" : "Check-in confirmado",
          description: `${entry.nombre} ha sido ${entry.checked_in ? 'revertido' : 'registrado'} exitosamente.`,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado del invitado.",
          variant: "destructive"
        });
      }
    });
  };
  
  const handleDelete = (entry: GuestListEntry) => {
    deleteMutation.mutate(entry.id, {
      onSuccess: () => {
        toast({
          title: "Invitado eliminado",
          description: `${entry.nombre} ha sido eliminado de la lista de invitados.`,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo eliminar el invitado.",
          variant: "destructive"
        });
      }
    });
  };
  
  const handleViewQR = (entry: GuestListEntry) => {
    setSelectedGuest(entry);
    setShowQRCode(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando lista de invitados...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Gestión de Guest List</CardTitle>
              <CardDescription>Administra la lista de invitados para tus eventos</CardDescription>
            </div>
            <div className="text-right">
              <p className="font-semibold">{totalInvitados} / {guestListLimit}</p>
              <p className="text-xs text-muted-foreground">Total Invitados / Límite</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {totalInvitados >= guestListLimit && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Límite alcanzado</AlertTitle>
              <AlertDescription>
                Has alcanzado el límite máximo de personas en la guest list.
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="list">
            <TabsList className="mb-4">
              <TabsTrigger value="list">Lista de Invitados</TabsTrigger>
              <TabsTrigger value="calendar">Vista de Calendario</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, email o código..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: es })
                      ) : (
                        "Todas las fechas"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="p-3 pointer-events-auto"
                      locale={es}
                    />
                    <div className="p-3 border-t border-border">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-left font-normal"
                        onClick={() => setSelectedDate(undefined)}
                      >
                        Mostrar todas las fechas
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Añadir invitado
                </Button>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Invitados</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuests.length > 0 ? (
                      filteredGuests.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{guest.nombre}</div>
                              <div className="text-sm text-muted-foreground">{guest.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(guest.fecha), "dd/MM/yyyy")}</TableCell>
                          <TableCell>
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                              {guest.codigo}
                            </code>
                          </TableCell>
                          <TableCell>{guest.invitados}</TableCell>
                          <TableCell>
                            <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                              guest.checked_in 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {guest.checked_in ? 'Registrado' : 'Pendiente'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Button variant="ghost" size="icon" onClick={() => handleCheckIn(guest)}>
                                <ClipboardCheck className={`h-4 w-4 ${guest.checked_in ? 'text-green-500' : ''}`} />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleViewQR(guest)}>
                                <QrCode className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(guest)}>
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No se encontraron invitados con los filtros seleccionados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground mb-6">
                    Vista de calendario de invitados por día
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="p-3 pointer-events-auto mx-auto"
                    locale={es}
                  />
                  
                  {selectedDate && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">
                        Invitados para {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                      </h3>
                      
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Invitados</TableHead>
                              <TableHead>Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {invitados
                              .filter(inv => selectedDate && inv.fecha.toDateString() === selectedDate.toDateString())
                              .map((guest) => (
                                <TableRow key={guest.id}>
                                  <TableCell>
                                    <div>
                                      <div className="font-medium">{guest.nombre}</div>
                                      <div className="text-sm text-muted-foreground">{guest.email}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{guest.invitados}</TableCell>
                                  <TableCell>
                                    <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                                      guest.checked_in 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                    }`}>
                                      {guest.checked_in ? 'Registrado' : 'Pendiente'}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="guestListLimit">Límite de Guest List</Label>
                    <div className="flex gap-2 mt-2 items-center">
                      <Input
                        id="guestListLimit"
                        type="number"
                        value={guestListLimit}
                        onChange={(e) => setGuestListLimit(parseInt(e.target.value))}
                        className="max-w-xs"
                      />
                      <span className="text-sm text-muted-foreground">personas</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Este es el número máximo de personas permitidas en la guest list.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => toast({ title: "Configuración guardada" })}>
                      Guardar cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* QR Code Modal */}
          {selectedGuest && showQRCode && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <Card className="max-w-md w-full">
                <CardHeader>
                  <CardTitle>Código QR para {selectedGuest.nombre}</CardTitle>
                  <CardDescription>Código: {selectedGuest.codigo}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        JSON.stringify({
                          code: selectedGuest.codigo,
                          name: selectedGuest.nombre,
                          email: selectedGuest.email
                        })
                      )}`} 
                      alt="QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => setShowQRCode(false)}>Cerrar</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestListManagement;

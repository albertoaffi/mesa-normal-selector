
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useGuestList } from '@/hooks/useGuestList';
import { GuestListEntry } from '@/types/guestList';
import GuestListFilters from './guestList/GuestListFilters';
import GuestListTable from './guestList/GuestListTable';
import GuestListCalendarView from './guestList/GuestListCalendarView';
import GuestListSettings from './guestList/GuestListSettings';
import QRCodeModal from './guestList/QRCodeModal';

const GuestListManagement = () => {
  const { guestList, isLoading, handleCheckIn, handleDelete } = useGuestList();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedGuest, setSelectedGuest] = useState<GuestListEntry | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [guestListLimit, setGuestListLimit] = useState(80);
  
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
              <GuestListFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
              
              <GuestListTable
                filteredGuests={filteredGuests}
                onCheckIn={handleCheckIn}
                onDelete={handleDelete}
                onViewQR={handleViewQR}
              />
            </TabsContent>
            
            <TabsContent value="calendar">
              <GuestListCalendarView
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                guestList={guestList}
              />
            </TabsContent>
            
            <TabsContent value="settings">
              <GuestListSettings
                guestListLimit={guestListLimit}
                onLimitChange={setGuestListLimit}
              />
            </TabsContent>
          </Tabs>
          
          <QRCodeModal
            guest={selectedGuest}
            isOpen={showQRCode}
            onClose={() => setShowQRCode(false)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestListManagement;

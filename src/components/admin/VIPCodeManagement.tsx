
import React, { useState } from 'react';
import { PlusCircle, Trash2, Users, Clock, Check, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface VIPCode {
  id: number;
  codigo: string;
  descripcion: string;
  activo: boolean;
  usos: number;
  maxUsos: number | null;
  expiracion: string | null;
}

const VIPCodeManagement = () => {
  const { toast } = useToast();
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [maxUses, setMaxUses] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState('');
  
  // Estado inicial con algunos códigos de ejemplo
  const [vipCodes, setVipCodes] = useState<VIPCode[]>([
    {
      id: 1,
      codigo: 'VIP123',
      descripcion: 'Código para acceso a mesas Gold',
      activo: true,
      usos: 8,
      maxUsos: 50,
      expiracion: '2025-06-30'
    },
    {
      id: 2,
      codigo: 'GOLDVIP',
      descripcion: 'Código premium exclusivo',
      activo: true,
      usos: 3,
      maxUsos: null,
      expiracion: null
    },
    {
      id: 3,
      codigo: 'STAFF2025',
      descripcion: 'Código para personal',
      activo: true,
      usos: 15,
      maxUsos: null,
      expiracion: null
    },
    {
      id: 4,
      codigo: 'PROMO25',
      descripcion: 'Promoción 25% descuento',
      activo: false,
      usos: 50,
      maxUsos: 50,
      expiracion: '2025-04-30'
    }
  ]);
  
  const addVIPCode = () => {
    if (!newCode || !newDescription) {
      toast({
        title: "Campos incompletos",
        description: "El código y la descripción son obligatorios.",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar que el código no exista ya
    if (vipCodes.some(code => code.codigo === newCode)) {
      toast({
        title: "Código duplicado",
        description: "Este código VIP ya existe.",
        variant: "destructive"
      });
      return;
    }
    
    const newVipCode: VIPCode = {
      id: Date.now(),
      codigo: newCode,
      descripcion: newDescription,
      activo: true,
      usos: 0,
      maxUsos: maxUses ? parseInt(maxUses) : null,
      expiracion: expirationDate || null
    };
    
    setVipCodes([...vipCodes, newVipCode]);
    
    // Limpiar formulario
    setNewCode('');
    setNewDescription('');
    setMaxUses('');
    setExpirationDate('');
    
    toast({
      title: "Código VIP creado",
      description: `El código ${newCode} ha sido creado exitosamente.`
    });
  };
  
  const toggleCodeStatus = (id: number) => {
    setVipCodes(vipCodes.map(code => 
      code.id === id ? { ...code, activo: !code.activo } : code
    ));
    
    const code = vipCodes.find(c => c.id === id);
    if (code) {
      toast({
        title: code.activo ? "Código desactivado" : "Código activado",
        description: `El código ${code.codigo} ha sido ${code.activo ? 'desactivado' : 'activado'} exitosamente.`
      });
    }
  };
  
  const deleteCode = (id: number) => {
    const code = vipCodes.find(c => c.id === id);
    setVipCodes(vipCodes.filter(code => code.id !== id));
    
    if (code) {
      toast({
        title: "Código eliminado",
        description: `El código ${code.codigo} ha sido eliminado exitosamente.`
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gestión de Códigos VIP</CardTitle>
          <CardDescription>
            Administra los códigos VIP para acceso a mesas premium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <Input
                placeholder="Código VIP"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Descripción"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Límite de usos (opcional)"
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Fecha expiración (opcional)"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={addVIPCode} className="mb-6">
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Código VIP
          </Button>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Usos</TableHead>
                <TableHead>Expiración</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vipCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-medium">{code.codigo}</TableCell>
                  <TableCell>{code.descripcion}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={code.activo} 
                        onCheckedChange={() => toggleCodeStatus(code.id)} 
                      />
                      <Badge variant={code.activo ? "default" : "secondary"}>
                        {code.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{code.usos}</span>
                      {code.maxUsos && (
                        <span className="text-xs text-muted-foreground">
                          /{code.maxUsos}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {code.expiracion ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{code.expiracion}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin expiración</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteCode(code.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-sm">Activo</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-gray-400"></span>
              <span className="text-sm">Inactivo</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Total códigos: {vipCodes.length}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VIPCodeManagement;

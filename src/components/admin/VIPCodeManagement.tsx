
import React, { useState } from 'react';
import { PlusCircle, Trash2, Users, Clock, Check, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseCodigosVIP } from "@/hooks/useSupabaseCodigosVIP";

const VIPCodeManagement = () => {
  const { toast } = useToast();
  const { codigos, loading, createCodigo, updateCodigo, deleteCodigo } = useSupabaseCodigosVIP();
  
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [maxUses, setMaxUses] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const addVIPCode = async () => {
    if (!newCode || !newDescription) {
      toast({
        title: "Campos incompletos",
        description: "El código y la descripción son obligatorios.",
        variant: "destructive"
      });
      return;
    }
    
    // Verificar que el código no exista ya
    if (codigos.some(code => code.codigo === newCode.toUpperCase())) {
      toast({
        title: "Código duplicado",
        description: "Este código VIP ya existe.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      await createCodigo({
        codigo: newCode,
        descripcion: newDescription,
        activo: true,
        fecha_expiracion: expirationDate || null,
        usos_maximos: maxUses ? parseInt(maxUses) : null
      });
      
      // Limpiar formulario
      setNewCode('');
      setNewDescription('');
      setMaxUses('');
      setExpirationDate('');
      
      toast({
        title: "Código VIP creado",
        description: `El código ${newCode} ha sido creado exitosamente.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear el código VIP.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const toggleCodeStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateCodigo(id, { activo: !currentStatus });
      
      const code = codigos.find(c => c.id === id);
      if (code) {
        toast({
          title: currentStatus ? "Código desactivado" : "Código activado",
          description: `El código ${code.codigo} ha sido ${currentStatus ? 'desactivado' : 'activado'} exitosamente.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el código.",
        variant: "destructive"
      });
    }
  };
  
  const deleteCode = async (id: string) => {
    try {
      const code = codigos.find(c => c.id === id);
      await deleteCodigo(id);
      
      if (code) {
        toast({
          title: "Código eliminado",
          description: `El código ${code.codigo} ha sido eliminado exitosamente.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el código.",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando códigos VIP...</div>
      </div>
    );
  }
  
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
          
          <Button onClick={addVIPCode} className="mb-6" disabled={isCreating}>
            <PlusCircle className="mr-2 h-4 w-4" /> 
            {isCreating ? 'Creando...' : 'Crear Código VIP'}
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
              {codigos.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-medium">{code.codigo}</TableCell>
                  <TableCell>{code.descripcion}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={code.activo} 
                        onCheckedChange={() => toggleCodeStatus(code.id, code.activo)} 
                      />
                      <Badge variant={code.activo ? "default" : "secondary"}>
                        {code.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{code.usos_actuales}</span>
                      {code.usos_maximos && (
                        <span className="text-xs text-muted-foreground">
                          /{code.usos_maximos}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {code.fecha_expiracion ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{code.fecha_expiracion}</span>
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
            Total códigos: {codigos.length}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VIPCodeManagement;


import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Check, X, Mail, Phone, Key, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the User interface for type safety
interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: 'admin' | 'staff' | 'cliente';
  ultimoAcceso?: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
}

// Initial sample users
const initialUsers: User[] = [
  { id: 1, nombre: "Admin Principal", email: "admin@ejemplo.com", telefono: "612345678", rol: "admin", ultimoAcceso: "14/05/2025", estado: "activo" },
  { id: 2, nombre: "Juan Pérez", email: "juan@ejemplo.com", telefono: "623456789", rol: "staff", ultimoAcceso: "13/05/2025", estado: "activo" },
  { id: 3, nombre: "Ana López", email: "ana@ejemplo.com", telefono: "634567890", rol: "cliente", ultimoAcceso: "10/05/2025", estado: "activo" },
  { id: 4, nombre: "Carlos Ruiz", email: "carlos@ejemplo.com", telefono: "645678901", rol: "cliente", ultimoAcceso: "02/05/2025", estado: "inactivo" },
  { id: 5, nombre: "María González", email: "maria@ejemplo.com", telefono: "656789012", rol: "cliente", ultimoAcceso: null, estado: "pendiente" },
];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: 0,
    nombre: "",
    email: "",
    telefono: "",
    rol: "cliente",
    estado: "activo"
  });
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editMode && currentUser) {
      // Edit existing user
      setUsers(users.map(user => 
        user.id === currentUser.id ? { ...formData } : user
      ));
      toast({
        title: "Usuario actualizado",
        description: `El usuario ${formData.nombre} ha sido actualizado correctamente.`
      });
    } else {
      // Add new user
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers([...users, { ...formData, id: newId }]);
      toast({
        title: "Usuario añadido",
        description: `El usuario ${formData.nombre} ha sido añadido correctamente.`
      });
    }
    
    // Reset form
    resetForm();
  };
  
  const resetForm = () => {
    setShowForm(false);
    setEditMode(false);
    setCurrentUser(null);
    setFormData({
      id: 0,
      nombre: "",
      email: "",
      telefono: "",
      rol: "cliente",
      estado: "activo"
    });
  };
  
  const handleEditUser = (user: User) => {
    setEditMode(true);
    setCurrentUser(user);
    setFormData(user);
    setShowForm(true);
  };
  
  const handleDeleteUser = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsers(users.filter(user => user.id !== id));
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente.",
        variant: "destructive"
      });
    }
  };

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const newStatus = user.estado === 'activo' ? 'inactivo' : 'activo';
        return { ...user, estado: newStatus as 'activo' | 'inactivo' | 'pendiente' };
      }
      return user;
    }));

    toast({
      title: "Estado actualizado",
      description: "El estado del usuario ha sido actualizado correctamente."
    });
  };
  
  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Gestión de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Search and Add button */}
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Input
                  type="text"
                  placeholder="Buscar usuario..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </div>

            {/* User Form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-medium">{editMode ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="pl-10" />
                      <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <div className="relative">
                      <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} required className="pl-10" />
                      <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="rol">Rol</Label>
                    <select 
                      id="rol" 
                      name="rol" 
                      value={formData.rol} 
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      required
                    >
                      <option value="admin">Administrador</option>
                      <option value="staff">Staff</option>
                      <option value="cliente">Cliente</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <select 
                      id="estado" 
                      name="estado" 
                      value={formData.estado} 
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      required
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="pendiente">Pendiente</option>
                    </select>
                  </div>
                  
                  {editMode && (
                    <div>
                      <Label htmlFor="resetPassword">Acciones adicionales</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full flex items-center"
                        onClick={() => {
                          toast({
                            title: "Correo enviado",
                            description: "Se ha enviado un correo para restablecer la contraseña."
                          });
                        }}
                      >
                        <Key className="mr-2 h-4 w-4" />
                        Restablecer contraseña
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editMode ? 'Actualizar' : 'Agregar'}
                  </Button>
                </div>
              </form>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Último acceso</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nombre}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.rol === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.rol === 'staff'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.rol === 'admin' ? 'Administrador' : user.rol === 'staff' ? 'Staff' : 'Cliente'}
                          </span>
                        </TableCell>
                        <TableCell>{user.ultimoAcceso || 'Nunca'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.estado === 'activo' 
                              ? 'bg-green-100 text-green-800' 
                              : user.estado === 'inactivo'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.estado.charAt(0).toUpperCase() + user.estado.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleUserStatus(user.id)}
                              title={user.estado === 'activo' ? 'Desactivar usuario' : 'Activar usuario'}
                            >
                              {user.estado === 'activo' ? <X className="h-4 w-4 text-red-500" /> : <Check className="h-4 w-4 text-green-500" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No se encontraron usuarios con ese criterio de búsqueda.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Mostrando {filteredUsers.length} de {users.length} usuarios
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;

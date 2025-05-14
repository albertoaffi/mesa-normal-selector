
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Table, Users, Package } from "lucide-react";
import TableManagement from "@/components/admin/TableManagement";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Panel de Administración</h1>
        
        <Tabs defaultValue="tables" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="tables" className="flex items-center gap-2">
              <Table className="w-4 h-4" />
              <span className="hidden sm:inline">Mesas</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Usuarios</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Productos</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Bienvenido al panel de administración. Usa las pestañas para gestionar las diferentes secciones.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="tables">
            <TableManagement />
          </TabsContent>
          
          <TabsContent value="users">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Esta sección se implementará próximamente para gestionar usuarios y permisos.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="products">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Gestión de Productos</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Esta sección se implementará próximamente para importar y gestionar productos.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

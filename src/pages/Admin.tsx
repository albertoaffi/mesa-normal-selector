
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Table, Users, Package } from "lucide-react";
import TableManagement from "@/components/admin/TableManagement";
import Dashboard from "@/components/admin/Dashboard";
import UserManagement from "@/components/admin/UserManagement";
import ProductManagement from "@/components/admin/ProductManagement";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Panel de Administración</h1>
        
        <Tabs defaultValue="dashboard" className="w-full">
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
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="tables">
            <TableManagement />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;


import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Table, Users, Package, Ticket, Key } from "lucide-react";
import TableManagement from "@/components/admin/TableManagement";
import Dashboard from "@/components/admin/Dashboard";
import UserManagement from "@/components/admin/UserManagement";
import ProductManagement from "@/components/admin/ProductManagement";
import GuestListManagement from "@/components/admin/GuestListManagement";
import VIPCodeManagement from "@/components/admin/VIPCodeManagement";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Panel de Administración</h1>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-black dark:data-[state=active]:text-white"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tables" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-black dark:data-[state=active]:text-white"
            >
              <Table className="w-4 h-4" />
              <span className="hidden sm:inline">Mesas</span>
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-black dark:data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Usuarios</span>
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-black dark:data-[state=active]:text-white"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Productos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="guestlist" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-black dark:data-[state=active]:text-white"
            >
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">Guest List</span>
            </TabsTrigger>
            <TabsTrigger 
              value="vipcodes" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-black dark:data-[state=active]:text-white"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">Códigos VIP</span>
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
          
          <TabsContent value="guestlist">
            <GuestListManagement />
          </TabsContent>
          
          <TabsContent value="vipcodes">
            <VIPCodeManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

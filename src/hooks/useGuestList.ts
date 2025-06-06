
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { GuestListEntry } from '@/types/guestList';

export const useGuestList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

  return {
    guestList,
    isLoading,
    handleCheckIn,
    handleDelete
  };
};

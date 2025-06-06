
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, UserPlus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface GuestListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const GuestListFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedDate, 
  onDateSelect 
}: GuestListFiltersProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email o código..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
            onSelect={onDateSelect}
            className="p-3 pointer-events-auto"
            locale={es}
          />
          <div className="p-3 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left font-normal"
              onClick={() => onDateSelect(undefined)}
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
  );
};

export default GuestListFilters;

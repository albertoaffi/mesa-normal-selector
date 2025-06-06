
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GuestListSettingsProps {
  guestListLimit: number;
  onLimitChange: (limit: number) => void;
}

const GuestListSettings = ({ guestListLimit, onLimitChange }: GuestListSettingsProps) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div>
          <Label htmlFor="guestListLimit">Límite de Guest List</Label>
          <div className="flex gap-2 mt-2 items-center">
            <Input
              id="guestListLimit"
              type="number"
              value={guestListLimit}
              onChange={(e) => onLimitChange(parseInt(e.target.value))}
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
  );
};

export default GuestListSettings;

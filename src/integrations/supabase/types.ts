export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      codigos_vip: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          descripcion: string | null
          fecha_expiracion: string | null
          id: string
          updated_at: string | null
          usos_actuales: number | null
          usos_maximos: number | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          descripcion?: string | null
          fecha_expiracion?: string | null
          id?: string
          updated_at?: string | null
          usos_actuales?: number | null
          usos_maximos?: number | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          descripcion?: string | null
          fecha_expiracion?: string | null
          id?: string
          updated_at?: string | null
          usos_actuales?: number | null
          usos_maximos?: number | null
        }
        Relationships: []
      }
      guest_list: {
        Row: {
          checked_in: boolean | null
          codigo: string
          created_at: string | null
          email: string
          fecha: string
          id: string
          invitados: number
          nombre: string
          telefono: string
          updated_at: string | null
        }
        Insert: {
          checked_in?: boolean | null
          codigo: string
          created_at?: string | null
          email: string
          fecha: string
          id?: string
          invitados?: number
          nombre: string
          telefono: string
          updated_at?: string | null
        }
        Update: {
          checked_in?: boolean | null
          codigo?: string
          created_at?: string | null
          email?: string
          fecha?: string
          id?: string
          invitados?: number
          nombre?: string
          telefono?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mesas: {
        Row: {
          capacidad: number
          categoria: string
          created_at: string | null
          descripcion: string | null
          disponible: boolean | null
          id: number
          nombre: string
          precio_minimo: number
          ubicacion: string
          updated_at: string | null
          x: number | null
          y: number | null
        }
        Insert: {
          capacidad: number
          categoria: string
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          id?: number
          nombre: string
          precio_minimo: number
          ubicacion: string
          updated_at?: string | null
          x?: number | null
          y?: number | null
        }
        Update: {
          capacidad?: number
          categoria?: string
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          id?: number
          nombre?: string
          precio_minimo?: number
          ubicacion?: string
          updated_at?: string | null
          x?: number | null
          y?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          reservation_id: string | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string | null
          user_name: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          reservation_id?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_name: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          reservation_id?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
          user_name?: string
        }
        Relationships: []
      }
      productos: {
        Row: {
          categoria: string
          created_at: string | null
          descripcion: string | null
          disponible: boolean | null
          id: number
          imagen: string | null
          nombre: string
          precio: number
          updated_at: string | null
        }
        Insert: {
          categoria: string
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          id?: number
          imagen?: string | null
          nombre: string
          precio: number
          updated_at?: string | null
        }
        Update: {
          categoria?: string
          created_at?: string | null
          descripcion?: string | null
          disponible?: boolean | null
          id?: number
          imagen?: string | null
          nombre?: string
          precio?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      reserva_productos: {
        Row: {
          cantidad: number
          id: string
          precio_unitario: number
          producto_id: number | null
          reserva_id: string | null
        }
        Insert: {
          cantidad: number
          id?: string
          precio_unitario: number
          producto_id?: number | null
          reserva_id?: string | null
        }
        Update: {
          cantidad?: number
          id?: string
          precio_unitario?: number
          producto_id?: number | null
          reserva_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reserva_productos_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reserva_productos_reserva_id_fkey"
            columns: ["reserva_id"]
            isOneToOne: false
            referencedRelation: "reservas"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          codigo_vip: string | null
          created_at: string | null
          email: string
          estado: string | null
          fecha: string
          hora: string
          id: string
          mesa_id: number | null
          nombre: string
          notas: string | null
          personas: number
          stripe_session_id: string | null
          telefono: string
          total: number
          updated_at: string | null
        }
        Insert: {
          codigo_vip?: string | null
          created_at?: string | null
          email: string
          estado?: string | null
          fecha: string
          hora: string
          id?: string
          mesa_id?: number | null
          nombre: string
          notas?: string | null
          personas: number
          stripe_session_id?: string | null
          telefono: string
          total: number
          updated_at?: string | null
        }
        Update: {
          codigo_vip?: string | null
          created_at?: string | null
          email?: string
          estado?: string | null
          fecha?: string
          hora?: string
          id?: string
          mesa_id?: number | null
          nombre?: string
          notas?: string | null
          personas?: number
          stripe_session_id?: string | null
          telefono?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservas_mesa_id_fkey"
            columns: ["mesa_id"]
            isOneToOne: false
            referencedRelation: "mesas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

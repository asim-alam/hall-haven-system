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
      applications: {
        Row: {
          admin_comments: string | null
          application_date: string
          documents: string[]
          id: string
          preferred_building_id: string | null
          preferred_room_type: string
          priority: number
          status: string
          student_id: string | null
        }
        Insert: {
          admin_comments?: string | null
          application_date?: string
          documents?: string[]
          id?: string
          preferred_building_id?: string | null
          preferred_room_type: string
          priority?: number
          status?: string
          student_id?: string | null
        }
        Update: {
          admin_comments?: string | null
          application_date?: string
          documents?: string[]
          id?: string
          preferred_building_id?: string | null
          preferred_room_type?: string
          priority?: number
          status?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_preferred_building_id_fkey"
            columns: ["preferred_building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings: {
        Row: {
          address: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          total_floors: number
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          total_floors: number
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          total_floors?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          due_date: string
          generated_at: string
          id: string
          late_fee: number
          paid_at: string | null
          room_id: string | null
          status: string
          student_id: string | null
        }
        Insert: {
          amount: number
          due_date: string
          generated_at?: string
          id?: string
          late_fee?: number
          paid_at?: string | null
          room_id?: string | null
          status?: string
          student_id?: string | null
        }
        Update: {
          amount?: number
          due_date?: string
          generated_at?: string
          id?: string
          late_fee?: number
          paid_at?: string | null
          room_id?: string | null
          status?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          assigned_to: string | null
          category: string
          completed_at: string | null
          description: string
          feedback: string | null
          id: string
          priority: string
          room_id: string | null
          status: string
          student_id: string | null
          submitted_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          completed_at?: string | null
          description: string
          feedback?: string | null
          id?: string
          priority?: string
          room_id?: string | null
          status?: string
          student_id?: string | null
          submitted_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          completed_at?: string | null
          description?: string
          feedback?: string | null
          id?: string
          priority?: string
          room_id?: string | null
          status?: string
          student_id?: string | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          is_active?: boolean
          last_name: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      room_assignments: {
        Row: {
          assigned_at: string
          check_in_date: string | null
          check_out_date: string | null
          id: string
          is_active: boolean
          room_id: string | null
          student_id: string | null
        }
        Insert: {
          assigned_at?: string
          check_in_date?: string | null
          check_out_date?: string | null
          id?: string
          is_active?: boolean
          room_id?: string | null
          student_id?: string | null
        }
        Update: {
          assigned_at?: string
          check_in_date?: string | null
          check_out_date?: string | null
          id?: string
          is_active?: boolean
          room_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_assignments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: string[]
          building_id: string | null
          capacity: number
          created_at: string
          floor: number
          id: string
          monthly_fee: number
          room_number: string
          status: string
          type: string
        }
        Insert: {
          amenities?: string[]
          building_id?: string | null
          capacity: number
          created_at?: string
          floor: number
          id?: string
          monthly_fee: number
          room_number: string
          status?: string
          type: string
        }
        Update: {
          amenities?: string[]
          building_id?: string | null
          capacity?: number
          created_at?: string
          floor?: number
          id?: string
          monthly_fee?: number
          room_number?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          application_status: string
          created_at: string
          department: string
          email: string
          emergency_contact_email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relationship: string
          first_name: string
          id: string
          last_name: string
          phone_number: string
          student_id: string
          updated_at: string
          user_id: string | null
          year_of_study: number
        }
        Insert: {
          application_status?: string
          created_at?: string
          department: string
          email: string
          emergency_contact_email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relationship: string
          first_name: string
          id?: string
          last_name: string
          phone_number: string
          student_id: string
          updated_at?: string
          user_id?: string | null
          year_of_study: number
        }
        Update: {
          application_status?: string
          created_at?: string
          department?: string
          email?: string
          emergency_contact_email?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          emergency_contact_relationship?: string
          first_name?: string
          id?: string
          last_name?: string
          phone_number?: string
          student_id?: string
          updated_at?: string
          user_id?: string | null
          year_of_study?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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

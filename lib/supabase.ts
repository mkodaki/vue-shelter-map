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
      castle: {
        Row: {
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string | null
          seq: number
        }
        Insert: {
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          seq: number
        }
        Update: {
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          seq?: number
        }
        Relationships: []
      }
      countries: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      evacuation_shelter: {
        Row: {
          address: string | null
          earthquake: string | null
          fire: string | null
          flood: string | null
          inland_waters: string | null
          landslide: string | null
          latitude: number | null
          location_name: string | null
          longitude: number | null
          municipality_code: string
          municipality_name: string | null
          no: number
          prefecture_code: string | null
          remarks: string | null
          same_address: string | null
          storm_surge: string | null
          tsunami: string | null
          volcano: string | null
        }
        Insert: {
          address?: string | null
          earthquake?: string | null
          fire?: string | null
          flood?: string | null
          inland_waters?: string | null
          landslide?: string | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          municipality_code: string
          municipality_name?: string | null
          no: number
          prefecture_code?: string | null
          remarks?: string | null
          same_address?: string | null
          storm_surge?: string | null
          tsunami?: string | null
          volcano?: string | null
        }
        Update: {
          address?: string | null
          earthquake?: string | null
          fire?: string | null
          flood?: string | null
          inland_waters?: string | null
          landslide?: string | null
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          municipality_code?: string
          municipality_name?: string | null
          no?: number
          prefecture_code?: string | null
          remarks?: string | null
          same_address?: string | null
          storm_surge?: string | null
          tsunami?: string | null
          volcano?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_evacuation_shelter_prefecture_code_fkey"
            columns: ["prefecture_code"]
            isOneToOne: false
            referencedRelation: "prefecture_master"
            referencedColumns: ["prefecture_code"]
          }
        ]
      }
      prefecture_master: {
        Row: {
          display_order: number | null
          latitude: number | null
          longitude: number | null
          prefecture_code: string
          prefecture_name: string | null
        }
        Insert: {
          display_order?: number | null
          latitude?: number | null
          longitude?: number | null
          prefecture_code: string
          prefecture_name?: string | null
        }
        Update: {
          display_order?: number | null
          latitude?: number | null
          longitude?: number | null
          prefecture_code?: string
          prefecture_name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      todos: {
        Row: {
          id: number
          inserted_at: string
          is_complete: boolean | null
          task: string | null
          user_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          is_complete?: boolean | null
          task?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

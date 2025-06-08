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
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          message: string
          order_id: string | null
          sent_at: string | null
          status: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          id?: string
          message: string
          order_id?: string | null
          sent_at?: string | null
          status?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          id?: string
          message?: string
          order_id?: string | null
          sent_at?: string | null
          status?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_price: number
          quantity: number
          total: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          product_name: string
          product_price: number
          quantity: number
          total: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_price?: number
          quantity?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_items_order_id"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_order_items_product_id"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          notes: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          notes?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_name: string
          buyer_phone: string
          created_at: string
          delivery_location: string
          id: string
          payment_amount: number
          payment_method: string
          status: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at: string
          user_id: string | null
          vendor_id: string
        }
        Insert: {
          buyer_name: string
          buyer_phone: string
          created_at?: string
          delivery_location: string
          id?: string
          payment_amount: number
          payment_method: string
          status?: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at?: string
          user_id?: string | null
          vendor_id: string
        }
        Update: {
          buyer_name?: string
          buyer_phone?: string
          created_at?: string
          delivery_location?: string
          id?: string
          payment_amount?: number
          payment_method?: string
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
          user_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_vendor_id"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available: boolean
          available_from: string | null
          available_to: string | null
          category_id: string
          created_at: string
          description: string
          id: string
          image: string
          name: string
          price: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          available?: boolean
          available_from?: string | null
          available_to?: string | null
          category_id: string
          created_at?: string
          description: string
          id?: string
          image: string
          name: string
          price: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          available?: boolean
          available_from?: string | null
          available_to?: string | null
          category_id?: string
          created_at?: string
          description?: string
          id?: string
          image?: string
          name?: string
          price?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_category_id"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_products_vendor_id"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          created_at: string
          description: string
          email: string
          id: string
          is_promoted: boolean | null
          name: string
          rating: number | null
          rejection_reason: string | null
          store_name: string | null
          student_card_image: string | null
          student_id: string | null
          student_id_image: string | null
          total_orders: number | null
          total_sales: number | null
          updated_at: string
          user_id: string
          verified: boolean
          whatsapp_number: string
        }
        Insert: {
          created_at?: string
          description: string
          email: string
          id?: string
          is_promoted?: boolean | null
          name: string
          rating?: number | null
          rejection_reason?: string | null
          store_name?: string | null
          student_card_image?: string | null
          student_id?: string | null
          student_id_image?: string | null
          total_orders?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean
          whatsapp_number: string
        }
        Update: {
          created_at?: string
          description?: string
          email?: string
          id?: string
          is_promoted?: boolean | null
          name?: string
          rating?: number | null
          rejection_reason?: string | null
          store_name?: string | null
          student_card_image?: string | null
          student_id?: string | null
          student_id_image?: string | null
          total_orders?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean
          whatsapp_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_user_id_fkey"
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
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "accepted"
        | "completed"
        | "cancelled"
        | "confirmed"
        | "preparing"
        | "ready"
        | "rejected"
      user_role: "BUYER" | "VENDOR" | "ADMIN"
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
    Enums: {
      order_status: [
        "pending",
        "accepted",
        "completed",
        "cancelled",
        "confirmed",
        "preparing",
        "ready",
        "rejected",
      ],
      user_role: ["BUYER", "VENDOR", "ADMIN"],
    },
  },
} as const

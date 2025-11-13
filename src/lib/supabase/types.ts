export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      article: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          published_at: string | null
          status: Database["public"]["Enums"]["article_status"]
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["article_status"]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["article_status"]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_check_in: {
        Row: {
          bleeding: number | null
          created_at: string
          date: string
          floss_used: boolean
          id: string
          interdental_brush_used: boolean
          mouth_feeling: string | null
          pain: number | null
          patient_id: string
          updated_at: string
        }
        Insert: {
          bleeding?: number | null
          created_at?: string
          date: string
          floss_used?: boolean
          id?: string
          interdental_brush_used?: boolean
          mouth_feeling?: string | null
          pain?: number | null
          patient_id: string
          updated_at?: string
        }
        Update: {
          bleeding?: number | null
          created_at?: string
          date?: string
          floss_used?: boolean
          id?: string
          interdental_brush_used?: boolean
          mouth_feeling?: string | null
          pain?: number | null
          patient_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_check_in_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosis: {
        Row: {
          entered_at: string
          entered_by: string
          grade: number | null
          id: string
          patient_id: string
          stage: number | null
          type: Database["public"]["Enums"]["diagnosis_type"]
          updated_at: string
        }
        Insert: {
          entered_at?: string
          entered_by: string
          grade?: number | null
          id?: string
          patient_id: string
          stage?: number | null
          type: Database["public"]["Enums"]["diagnosis_type"]
          updated_at?: string
        }
        Update: {
          entered_at?: string
          entered_by?: string
          grade?: number | null
          id?: string
          patient_id?: string
          stage?: number | null
          type?: Database["public"]["Enums"]["diagnosis_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnosis_entered_by_fkey"
            columns: ["entered_by"]
            isOneToOne: false
            referencedRelation: "periodontist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosis_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "patient"
            referencedColumns: ["id"]
          },
        ]
      }
      odontogram: {
        Row: {
          created_at: string
          id: string
          oral_hygiene_recommendation_id: string
          spaces: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          oral_hygiene_recommendation_id: string
          spaces: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          oral_hygiene_recommendation_id?: string
          spaces?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "odontogram_oral_hygiene_recommendation_id_fkey"
            columns: ["oral_hygiene_recommendation_id"]
            isOneToOne: true
            referencedRelation: "oral_hygiene_recommendation"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_response: {
        Row: {
          age: number
          bruxism_clenching: boolean
          completed_at: string
          diet: string
          id: string
          patient_id: string
          sleep: string
        }
        Insert: {
          age: number
          bruxism_clenching: boolean
          completed_at?: string
          diet: string
          id?: string
          patient_id: string
          sleep: string
        }
        Update: {
          age?: number
          bruxism_clenching?: boolean
          completed_at?: string
          diet?: string
          id?: string
          patient_id?: string
          sleep?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_response_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "patient"
            referencedColumns: ["id"]
          },
        ]
      }
      oral_hygiene_recommendation: {
        Row: {
          entered_at: string
          entered_by: string
          id: string
          patient_id: string
          toothbrush_brand: string | null
          toothbrush_model: string | null
          toothbrush_type: string | null
          updated_at: string
        }
        Insert: {
          entered_at?: string
          entered_by: string
          id?: string
          patient_id: string
          toothbrush_brand?: string | null
          toothbrush_model?: string | null
          toothbrush_type?: string | null
          updated_at?: string
        }
        Update: {
          entered_at?: string
          entered_by?: string
          id?: string
          patient_id?: string
          toothbrush_brand?: string | null
          toothbrush_model?: string | null
          toothbrush_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "oral_hygiene_recommendation_entered_by_fkey"
            columns: ["entered_by"]
            isOneToOne: false
            referencedRelation: "periodontist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oral_hygiene_recommendation_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "patient"
            referencedColumns: ["id"]
          },
        ]
      }
      patient: {
        Row: {
          account_status: Database["public"]["Enums"]["patient_account_status"]
          created_at: string
          email: string
          id: string
          onboarding_completed: boolean
          periodontist_id: string
          updated_at: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["patient_account_status"]
          created_at?: string
          email: string
          id: string
          onboarding_completed?: boolean
          periodontist_id: string
          updated_at?: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["patient_account_status"]
          created_at?: string
          email?: string
          id?: string
          onboarding_completed?: boolean
          periodontist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_periodontist_id_fkey"
            columns: ["periodontist_id"]
            isOneToOne: false
            referencedRelation: "periodontist"
            referencedColumns: ["id"]
          },
        ]
      }
      periodontist: {
        Row: {
          account_status: Database["public"]["Enums"]["periodontist_account_status"]
          created_at: string
          email: string
          full_name: string
          id: string
          password_hash: string | null
          professional_credentials: string | null
          updated_at: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["periodontist_account_status"]
          created_at?: string
          email: string
          full_name: string
          id?: string
          password_hash?: string | null
          professional_credentials?: string | null
          updated_at?: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["periodontist_account_status"]
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          password_hash?: string | null
          professional_credentials?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      risk_factor: {
        Row: {
          details: Json | null
          entered_at: string
          entered_by: string
          id: string
          patient_id: string
          type: Database["public"]["Enums"]["risk_factor_type"]
          updated_at: string
        }
        Insert: {
          details?: Json | null
          entered_at?: string
          entered_by: string
          id?: string
          patient_id: string
          type: Database["public"]["Enums"]["risk_factor_type"]
          updated_at?: string
        }
        Update: {
          details?: Json | null
          entered_at?: string
          entered_by?: string
          id?: string
          patient_id?: string
          type?: Database["public"]["Enums"]["risk_factor_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_factor_entered_by_fkey"
            columns: ["entered_by"]
            isOneToOne: false
            referencedRelation: "periodontist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_factor_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient"
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
      article_status: "draft" | "published" | "archived"
      diagnosis_type: "gingivitis" | "periodontitis"
      patient_account_status: "pending" | "active" | "inactive"
      periodontist_account_status: "active" | "inactive" | "suspended"
      risk_factor_type:
        | "diabetes"
        | "tobacco_use"
        | "cardiovascular_disease"
        | "cancer_hormonotherapy"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      article_status: ["draft", "published", "archived"],
      diagnosis_type: ["gingivitis", "periodontitis"],
      patient_account_status: ["pending", "active", "inactive"],
      periodontist_account_status: ["active", "inactive", "suspended"],
      risk_factor_type: [
        "diabetes",
        "tobacco_use",
        "cardiovascular_disease",
        "cancer_hormonotherapy",
      ],
    },
  },
} as const

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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ja_dict: {
        Row: {
          definitions: Json
          featured: string[]
          id: number
          jlpt_level: string | null
          readings: string[]
          word: string
        }
        Insert: {
          definitions: Json
          featured: string[]
          id?: number
          jlpt_level?: string | null
          readings: string[]
          word: string
        }
        Update: {
          definitions?: Json
          featured?: string[]
          id?: number
          jlpt_level?: string | null
          readings?: string[]
          word?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          experienced: string[]
          google_access_token: string | null
          id: string
          lang: string
          learning_goal: string | null
          name: string | null
          notify: boolean
          practice_frequency: string
          proficiency: string
          stripe_id: string | null
          timezone: string
          updated_at: string | null
        }
        Insert: {
          experienced?: string[]
          google_access_token?: string | null
          id: string
          lang?: string
          learning_goal?: string | null
          name?: string | null
          notify?: boolean
          practice_frequency?: string
          proficiency?: string
          stripe_id?: string | null
          timezone?: string
          updated_at?: string | null
        }
        Update: {
          experienced?: string[]
          google_access_token?: string | null
          id?: string
          lang?: string
          learning_goal?: string | null
          name?: string | null
          notify?: boolean
          practice_frequency?: string
          proficiency?: string
          stripe_id?: string | null
          timezone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          avg_response_duration_ms: number | null
          chat_messages: Json | null
          created_at: string
          duration: number | null
          id: string
          lang: string
          n_responses: number | null
          token_usage: Json | null
          topic: string | null
          user_id: string
        }
        Insert: {
          avg_response_duration_ms?: number | null
          chat_messages?: Json | null
          created_at?: string
          duration?: number | null
          id?: string
          lang?: string
          n_responses?: number | null
          token_usage?: Json | null
          topic?: string | null
          user_id: string
        }
        Update: {
          avg_response_duration_ms?: number | null
          chat_messages?: Json | null
          created_at?: string
          duration?: number | null
          id?: string
          lang?: string
          n_responses?: number | null
          token_usage?: Json | null
          topic?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary: {
        Row: {
          created_at: string
          delay: number
          due: string
          id: string
          lang: string
          n_correct: number
          n_wrong: number
          streak: number
          time_to_response_ms: number
          user_id: string
          word_id: number
        }
        Insert: {
          created_at?: string
          delay?: number
          due?: string
          id?: string
          lang?: string
          n_correct?: number
          n_wrong?: number
          streak?: number
          time_to_response_ms?: number
          user_id: string
          word_id: number
        }
        Update: {
          created_at?: string
          delay?: number
          due?: string
          id?: string
          lang?: string
          n_correct?: number
          n_wrong?: number
          streak?: number
          time_to_response_ms?: number
          user_id?: string
          word_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      "zh-CN_dict": {
        Row: {
          definition: string
          id: number
          pinyin: string
          word: string
        }
        Insert: {
          definition: string
          id?: number
          pinyin: string
          word: string
        }
        Update: {
          definition?: string
          id?: number
          pinyin?: string
          word?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const

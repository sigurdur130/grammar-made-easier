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
      feedback: {
        Row: {
          created_at: string
          email: string | null
          feedback: string | null
          id: number
          screen: string | null
          sentence: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          feedback?: string | null
          id?: number
          screen?: string | null
          sentence?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          feedback?: string | null
          id?: number
          screen?: string | null
          sentence?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          role: string | null
        }
        Insert: {
          id: string
          role?: string | null
        }
        Update: {
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      sentences: {
        Row: {
          base_form: string | null
          case: string | null
          correct_answer: string | null
          created_at: string
          definiteness: string | null
          degree: string | null
          english_translation: string | null
          gender: string | null
          icelandic_left: string | null
          icelandic_right: string | null
          id: number
          number: string | null
          person: string | null
          subcategory: string | null
          "weak/strong": string | null
          word_category: string | null
        }
        Insert: {
          base_form?: string | null
          case?: string | null
          correct_answer?: string | null
          created_at?: string
          definiteness?: string | null
          degree?: string | null
          english_translation?: string | null
          gender?: string | null
          icelandic_left?: string | null
          icelandic_right?: string | null
          id?: number
          number?: string | null
          person?: string | null
          subcategory?: string | null
          "weak/strong"?: string | null
          word_category?: string | null
        }
        Update: {
          base_form?: string | null
          case?: string | null
          correct_answer?: string | null
          created_at?: string
          definiteness?: string | null
          degree?: string | null
          english_translation?: string | null
          gender?: string | null
          icelandic_left?: string | null
          icelandic_right?: string | null
          id?: number
          number?: string | null
          person?: string | null
          subcategory?: string | null
          "weak/strong"?: string | null
          word_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sentences_subcategories"
            columns: ["word_category", "subcategory"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["word_category", "subcategory"]
          },
        ]
      }
      subcategories: {
        Row: {
          created_at: string
          difficulty: string | null
          status: string | null
          subcategory: string
          word_category: string
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          status?: string | null
          subcategory: string
          word_category: string
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          status?: string | null
          subcategory?: string
          word_category?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_word_category_fkey"
            columns: ["word_category"]
            isOneToOne: false
            referencedRelation: "word_categories"
            referencedColumns: ["word_category"]
          },
        ]
      }
      word_categories: {
        Row: {
          created_at: string
          word_category: string
        }
        Insert: {
          created_at?: string
          word_category: string
        }
        Update: {
          created_at?: string
          word_category?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_random_rows: {
        Args: {
          subcategory_filter: string
          word_category_filter: string
          num_rows: number
          mastered_ids?: number[]
          retry_ids?: number[]
        }
        Returns: {
          id: number
          english_translation: string
          icelandic_left: string
          icelandic_right: string
          correct_answer: string
          subcategory: string
          base_form: string
          word_category: string
        }[]
      }
    }
    Enums: {
      subcategories_enum:
        | "Gender recognition"
        | "Plural"
        | "The definite article"
        | "Cases"
        | "Gender"
        | "Comparative"
        | "Superlative"
        | "Weak / strong"
        | "mikið or margir"
        | "Past tense"
        | "Present tense"
        | "Present subjunctive"
        | "Past subjunctive"
        | "Imperative"
        | "Passive voice"
        | "Middle voice"
        | "Supine"
        | "Present participle"
        | "Case assignment"
        | "Personal pronouns"
        | "Reflexive pronoun"
        | "Possessive pronouns"
        | "Demonstrative pronouns"
        | "Interrogative pronouns"
        | "Sinn or hans / hennar"
        | "Ordinals"
        | "Cardinals"
        | "Age"
        | "Dates"
        | "Consistent prepositions"
        | "í, á, yfir, undir"
        | "við"
        | "með"
        | "fyrir"
        | "eftir"
        | "í or á"
        | "Ef or hvort"
      wordcategory_enum:
        | "Nouns"
        | "Adjectives"
        | "Verbs"
        | "Prepositions"
        | "Pronouns"
        | "Numbers"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

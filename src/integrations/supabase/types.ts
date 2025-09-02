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
          done: boolean | null
          email: string | null
          feedback: string | null
          id: number
          screen: string | null
          sentence: string | null
        }
        Insert: {
          created_at?: string
          done?: boolean | null
          email?: string | null
          feedback?: string | null
          id?: number
          screen?: string | null
          sentence?: string | null
        }
        Update: {
          created_at?: string
          done?: boolean | null
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
          further_reading: string | null
          status: string | null
          subcategory: string
          word_category: string
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          further_reading?: string | null
          status?: string | null
          subcategory: string
          word_category: string
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          further_reading?: string | null
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
      cases_filter?: string[]
      numbers_filter?: string[]
      definiteness_filter?: string[]
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
      case: string
      number: string
      definiteness: string
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
      subcategories_enum: [
        "Gender recognition",
        "Plural",
        "The definite article",
        "Cases",
        "Gender",
        "Comparative",
        "Superlative",
        "Weak / strong",
        "mikið or margir",
        "Past tense",
        "Present tense",
        "Present subjunctive",
        "Past subjunctive",
        "Imperative",
        "Passive voice",
        "Middle voice",
        "Supine",
        "Present participle",
        "Case assignment",
        "Personal pronouns",
        "Reflexive pronoun",
        "Possessive pronouns",
        "Demonstrative pronouns",
        "Interrogative pronouns",
        "Sinn or hans / hennar",
        "Ordinals",
        "Cardinals",
        "Age",
        "Dates",
        "Consistent prepositions",
        "í, á, yfir, undir",
        "við",
        "með",
        "fyrir",
        "eftir",
        "í or á",
        "Ef or hvort",
      ],
      wordcategory_enum: [
        "Nouns",
        "Adjectives",
        "Verbs",
        "Prepositions",
        "Pronouns",
        "Numbers",
      ],
    },
  },
} as const

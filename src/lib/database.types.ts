export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      certifications: {
        Row: {
          id: string
          name: string
          provider: string
          code: string
          description: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          provider: string
          code: string
          description: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          provider?: string
          code?: string
          description?: string
          active?: boolean
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          selected_certification_id: string | null
          streak_count: number
          longest_streak: number
          total_questions_answered: number
          total_correct_answers: number
          last_session_date: string | null
          payment_method_id: string | null
          subscription_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          selected_certification_id?: string | null
          streak_count?: number
          longest_streak?: number
          total_questions_answered?: number
          total_correct_answers?: number
          last_session_date?: string | null
          payment_method_id?: string | null
          subscription_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          selected_certification_id?: string | null
          streak_count?: number
          longest_streak?: number
          total_questions_answered?: number
          total_correct_answers?: number
          last_session_date?: string | null
          payment_method_id?: string | null
          subscription_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          certification_id: string
          question_text: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: string
          explanation: string
          difficulty_level: number
          topic: string
          source_url: string | null
          approved: boolean
          times_answered: number
          times_correct: number
          created_at: string
        }
        Insert: {
          id?: string
          certification_id: string
          question_text: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          correct_answer: string
          explanation: string
          difficulty_level?: number
          topic: string
          source_url?: string | null
          approved?: boolean
          times_answered?: number
          times_correct?: number
          created_at?: string
        }
        Update: {
          id?: string
          certification_id?: string
          question_text?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          correct_answer?: string
          explanation?: string
          difficulty_level?: number
          topic?: string
          source_url?: string | null
          approved?: boolean
          times_answered?: number
          times_correct?: number
          created_at?: string
        }
      }
      daily_sessions: {
        Row: {
          id: string
          user_id: string
          session_date: string
          certification_id: string
          questions_answered: number
          correct_answers: number
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_date: string
          certification_id: string
          questions_answered?: number
          correct_answers?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_date?: string
          certification_id?: string
          questions_answered?: number
          correct_answers?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
      session_answers: {
        Row: {
          id: string
          session_id: string
          question_id: string
          user_answer: string
          correct: boolean
          time_spent_seconds: number
          answered_at: string
        }
        Insert: {
          id?: string
          session_id: string
          question_id: string
          user_answer: string
          correct: boolean
          time_spent_seconds?: number
          answered_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          question_id?: string
          user_answer?: string
          correct?: boolean
          time_spent_seconds?: number
          answered_at?: string
        }
      }
      user_question_history: {
        Row: {
          id: string
          user_id: string
          question_id: string
          times_seen: number
          times_correct: number
          last_seen_at: string
          mastery_level: number
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          times_seen?: number
          times_correct?: number
          last_seen_at?: string
          mastery_level?: number
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          times_seen?: number
          times_correct?: number
          last_seen_at?: string
          mastery_level?: number
        }
      }
      streak_records: {
        Row: {
          id: string
          user_id: string
          streak_length: number
          start_date: string
          end_date: string | null
          completed_30_days: boolean
          refund_processed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          streak_length: number
          start_date: string
          end_date?: string | null
          completed_30_days?: boolean
          refund_processed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          streak_length?: number
          start_date?: string
          end_date?: string | null
          completed_30_days?: boolean
          refund_processed?: boolean
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          currency: string
          status: string
          payment_provider_id: string | null
          missed_date: string | null
          streak_id: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          currency?: string
          status?: string
          payment_provider_id?: string | null
          missed_date?: string | null
          streak_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          currency?: string
          status?: string
          payment_provider_id?: string | null
          missed_date?: string | null
          streak_id?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      question_topics: {
        Row: {
          id: string
          certification_id: string
          name: string
          weight: number
          created_at: string
        }
        Insert: {
          id?: string
          certification_id: string
          name: string
          weight?: number
          created_at?: string
        }
        Update: {
          id?: string
          certification_id?: string
          name?: string
          weight?: number
          created_at?: string
        }
      }
    }
  }
}

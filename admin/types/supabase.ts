export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Must match supabase-js GenericRelationship structurally
type Rel = {
  foreignKeyName: string
  columns: string[]
  isOneToOne?: boolean
  referencedRelation: string
  referencedColumns: string[]
}

// Minimal GenericView-compatible shape for empty Views
type AnyView = {
  Row: Record<string, unknown>
  Relationships: Rel[]
}

// Minimal GenericFunction-compatible shape
type AnyFn = {
  Args: Record<string, unknown>
  Returns: unknown
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          role: 'super_admin' | 'rpg_admin' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          role?: 'super_admin' | 'rpg_admin' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          role?: 'super_admin' | 'rpg_admin' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Relationships: Rel[]
      }
      rpgs: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          is_active: boolean
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          is_active?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          is_active?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: Rel[]
      }
      rpg_admins: {
        Row: {
          profile_id: string
          rpg_id: string
          granted_by: string | null
          granted_at: string
        }
        Insert: {
          profile_id: string
          rpg_id: string
          granted_by?: string | null
          granted_at?: string
        }
        Update: {
          profile_id?: string
          rpg_id?: string
          granted_by?: string | null
          granted_at?: string
        }
        Relationships: Rel[]
      }
      characters: {
        Row: {
          id: string
          rpg_id: string
          entity_type: 'player' | 'npc'
          slug: string
          nome: string
          nivel: number
          xp: number
          arquetipo: 'tanque' | 'lutador' | 'cacador' | 'feiticeiro' | 'genio'
          idade: string | null
          altura: number | null
          peso: number | null
          classe_social: string | null
          inspiracao: number
          discord_id: string | null
          pv_max: number
          ps_max: number
          extra_info: Json
          is_active: boolean
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          rpg_id: string
          entity_type: 'player' | 'npc'
          slug: string
          nome: string
          nivel?: number
          xp?: number
          arquetipo: 'tanque' | 'lutador' | 'cacador' | 'feiticeiro' | 'genio'
          idade?: string | null
          altura?: number | null
          peso?: number | null
          classe_social?: string | null
          inspiracao?: number
          discord_id?: string | null
          pv_max?: number
          ps_max?: number
          extra_info?: Json
          is_active?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          rpg_id?: string
          entity_type?: 'player' | 'npc'
          slug?: string
          nome?: string
          nivel?: number
          xp?: number
          arquetipo?: 'tanque' | 'lutador' | 'cacador' | 'feiticeiro' | 'genio'
          idade?: string | null
          altura?: number | null
          peso?: number | null
          classe_social?: string | null
          inspiracao?: number
          discord_id?: string | null
          pv_max?: number
          ps_max?: number
          extra_info?: Json
          is_active?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: Rel[]
      }
      attributes: {
        Row: {
          id: string
          character_id: string
          rpg_id: string
          sigla: string
          nome: string
          valor: number
          bonus: number
          prestigio: number
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          character_id: string
          rpg_id: string
          sigla: string
          nome: string
          valor?: number
          bonus?: number
          prestigio?: number
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          character_id?: string
          rpg_id?: string
          sigla?: string
          nome?: string
          valor?: number
          bonus?: number
          prestigio?: number
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: Rel[]
      }
      skills: {
        Row: {
          id: string
          character_id: string
          rpg_id: string
          atributo_sigla: string
          nome: string
          valor: number
          bonus: number
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          character_id: string
          rpg_id: string
          atributo_sigla: string
          nome: string
          valor?: number
          bonus?: number
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          character_id?: string
          rpg_id?: string
          atributo_sigla?: string
          nome?: string
          valor?: number
          bonus?: number
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: Rel[]
      }
      abilities: {
        Row: {
          id: string
          character_id: string
          rpg_id: string
          nome: string
          grimorio: string | null
          nivel: string
          descricao: string | null
          dano: string | null
          calculo_dano: Json
          efeitos: string[]
          sort_order: number
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          character_id: string
          rpg_id: string
          nome: string
          grimorio?: string | null
          nivel?: string
          descricao?: string | null
          dano?: string | null
          calculo_dano?: Json
          efeitos?: string[]
          sort_order?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          character_id?: string
          rpg_id?: string
          nome?: string
          grimorio?: string | null
          nivel?: string
          descricao?: string | null
          dano?: string | null
          calculo_dano?: Json
          efeitos?: string[]
          sort_order?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: Rel[]
      }
      sub_attacks: {
        Row: {
          id: string
          ability_id: string
          rpg_id: string
          nome: string
          descricao: string | null
          dano: string | null
          calculo_dano: Json
          efeitos: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ability_id: string
          rpg_id: string
          nome: string
          descricao?: string | null
          dano?: string | null
          calculo_dano?: Json
          efeitos?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ability_id?: string
          rpg_id?: string
          nome?: string
          descricao?: string | null
          dano?: string | null
          calculo_dano?: Json
          efeitos?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: Rel[]
      }
      stories: {
        Row: {
          id: string
          character_id: string
          rpg_id: string
          content_html: string
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          character_id: string
          rpg_id: string
          content_html?: string
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          character_id?: string
          rpg_id?: string
          content_html?: string
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: Rel[]
      }
      audit_log: {
        Row: {
          id: number
          actor_id: string | null
          rpg_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: number
          actor_id?: string | null
          rpg_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          actor_id?: string | null
          rpg_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Relationships: Rel[]
      }
    }
    // Must satisfy Record<string, GenericView> — use an index signature with compatible value type
    Views: { [K: string]: AnyView }
    // Must satisfy Record<string, GenericFunction>
    Functions: { [K: string]: AnyFn }
    Enums: {
      user_role: 'super_admin' | 'rpg_admin' | 'viewer'
      archetype: 'tanque' | 'lutador' | 'cacador' | 'feiticeiro' | 'genio'
      entity_type: 'player' | 'npc'
    }
    CompositeTypes: { [K: string]: Record<string, unknown> }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

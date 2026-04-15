export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          name: string;
          normalized_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          normalized_name: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['players']['Insert']>;
        Relationships: [];
      };
      seasons: {
        Row: {
          id: string;
          name: string;
          format: string | null;
          start_date: string | null;
          end_date: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          format?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['seasons']['Insert']>;
        Relationships: [];
      };
      stages: {
        Row: {
          id: string;
          season_id: string;
          eventlink_id: string | null;
          name: string;
          event_date: string;
          rounds: number | null;
          imported_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          season_id: string;
          eventlink_id?: string | null;
          name: string;
          event_date: string;
          rounds?: number | null;
          imported_at?: string;
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['stages']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'stages_season_id_fkey';
            columns: ['season_id'];
            referencedRelation: 'seasons';
            referencedColumns: ['id'];
          },
        ];
      };
      stage_results: {
        Row: {
          id: string;
          stage_id: string;
          player_id: string;
          position: number;
          points: number;
        };
        Insert: {
          id?: string;
          stage_id: string;
          player_id: string;
          position: number;
          points: number;
        };
        Update: Partial<Database['public']['Tables']['stage_results']['Insert']>;
        Relationships: [
          {
            foreignKeyName: 'stage_results_stage_id_fkey';
            columns: ['stage_id'];
            referencedRelation: 'stages';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'stage_results_player_id_fkey';
            columns: ['player_id'];
            referencedRelation: 'players';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      season_ranking: {
        Row: {
          season_id: string;
          player_id: string;
          player_name: string;
          total_points: number;
          stages_played: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      import_stage: {
        Args: {
          p_season_id: string;
          p_name: string;
          p_eventlink_id: string;
          p_event_date: string;
          p_rounds: number | null;
          p_results: Json;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

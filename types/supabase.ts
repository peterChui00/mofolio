export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      journal_entries: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: string;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      journal_entry_tags: {
        Row: {
          journal_entry_id: string;
          tag_id: string;
        };
        Insert: {
          journal_entry_id: string;
          tag_id: string;
        };
        Update: {
          journal_entry_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'journal_entry_tags_journal_entry_id_fkey';
            columns: ['journal_entry_id'];
            isOneToOne: false;
            referencedRelation: 'journal_entries';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'journal_entry_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          action: Database['public']['Enums']['order_action'];
          created_at: string | null;
          executed_at: string | null;
          fee: number;
          id: string;
          price: number;
          quantity: number;
          status: Database['public']['Enums']['order_status'];
          trade_id: string;
        };
        Insert: {
          action: Database['public']['Enums']['order_action'];
          created_at?: string | null;
          executed_at?: string | null;
          fee: number;
          id?: string;
          price: number;
          quantity: number;
          status: Database['public']['Enums']['order_status'];
          trade_id: string;
        };
        Update: {
          action?: Database['public']['Enums']['order_action'];
          created_at?: string | null;
          executed_at?: string | null;
          fee?: number;
          id?: string;
          price?: number;
          quantity?: number;
          status?: Database['public']['Enums']['order_status'];
          trade_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_trade_id_fkey';
            columns: ['trade_id'];
            isOneToOne: false;
            referencedRelation: 'trade_summary';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_trade_id_fkey';
            columns: ['trade_id'];
            isOneToOne: false;
            referencedRelation: 'trades';
            referencedColumns: ['id'];
          },
        ];
      };
      portfolios: {
        Row: {
          base_currency: string;
          created_at: string | null;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          base_currency?: string;
          created_at?: string | null;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          base_currency?: string;
          created_at?: string | null;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      tag_groups: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          created_at: string | null;
          group_id: string | null;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          group_id?: string | null;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          group_id?: string | null;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tags_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'tag_groups';
            referencedColumns: ['id'];
          },
        ];
      };
      trade_tags: {
        Row: {
          tag_id: string;
          trade_id: string;
        };
        Insert: {
          tag_id: string;
          trade_id: string;
        };
        Update: {
          tag_id?: string;
          trade_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trade_tags_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'tags';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'trade_tags_trade_id_fkey';
            columns: ['trade_id'];
            isOneToOne: false;
            referencedRelation: 'trade_summary';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'trade_tags_trade_id_fkey';
            columns: ['trade_id'];
            isOneToOne: false;
            referencedRelation: 'trades';
            referencedColumns: ['id'];
          },
        ];
      };
      trades: {
        Row: {
          closed_at: string | null;
          created_at: string | null;
          id: string;
          notes: string | null;
          opened_at: string | null;
          portfolio_id: string;
          side: Database['public']['Enums']['position_side'];
          symbol: string;
        };
        Insert: {
          closed_at?: string | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          opened_at?: string | null;
          portfolio_id: string;
          side: Database['public']['Enums']['position_side'];
          symbol: string;
        };
        Update: {
          closed_at?: string | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          opened_at?: string | null;
          portfolio_id?: string;
          side?: Database['public']['Enums']['position_side'];
          symbol?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trades_portfolio_id_fkey';
            columns: ['portfolio_id'];
            isOneToOne: false;
            referencedRelation: 'portfolios';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      trade_summary: {
        Row: {
          average_price: number | null;
          closed_at: string | null;
          fee: number | null;
          id: string | null;
          notes: string | null;
          opened_at: string | null;
          pnl: number | null;
          portfolio_id: string | null;
          position: number | null;
          side: Database['public']['Enums']['position_side'] | null;
          status: string | null;
          symbol: string | null;
          tags: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'trades_portfolio_id_fkey';
            columns: ['portfolio_id'];
            isOneToOne: false;
            referencedRelation: 'portfolios';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      add_trade: {
        Args: { input: Json };
        Returns: string;
      };
      get_tags_grouped: {
        Args: { uid: string };
        Returns: Json;
      };
      nanoid: {
        Args: {
          size?: number;
          alphabet?: string;
          additionalbytesfactor?: number;
        };
        Returns: string;
      };
      nanoid_optimized: {
        Args: { size: number; alphabet: string; mask: number; step: number };
        Returns: string;
      };
    };
    Enums: {
      order_action: 'BUY' | 'SELL';
      order_status: 'PENDING' | 'FILLED';
      position_side: 'LONG' | 'SHORT';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      order_action: ['BUY', 'SELL'],
      order_status: ['PENDING', 'FILLED'],
      position_side: ['LONG', 'SHORT'],
    },
  },
} as const;

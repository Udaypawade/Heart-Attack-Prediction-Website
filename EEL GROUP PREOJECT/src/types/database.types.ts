export interface Database {
  public: {
    Tables: {
      predictions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          age: number;
          risk_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          age: number;
          risk_score: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          age?: number;
          risk_score?: number;
          created_at?: string;
        };
      };
    };
  };
}
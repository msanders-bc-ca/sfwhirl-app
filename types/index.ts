export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type TopicCategory =
  | 'regulatory'
  | 'market_access'
  | 'reimbursement'
  | 'clinical_evidence'
  | 'design_controls'
  | 'manufacturing'
  | 'commercialization';

export interface Topic {
  id: string;
  title: string;
  category: TopicCategory;
  description: string;
  difficulty: Difficulty;
}

export interface Question {
  id: string;
  topic_id: string;
  question_text: string;
  options: string[];        // always 4 choices
  correct_index: number;    // 0-3
  explanation: string;      // shown after answer
  difficulty: Difficulty;
  source_url?: string;      // optional reference link
}

export interface GameSession {
  id: string;
  user_id: string;
  topic_id: string;
  started_at: string;
  completed_at?: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  xp_earned: number;
}

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  total_xp: number;
  level: number;
  streak_days: number;
  last_played_at?: string;
  badges: string[];
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  total_xp: number;
  level: number;
}

export interface User {
  id: number;
  pseudo: string;
  email?: string;
  sex?: string;
  avatar_url?: string;
  avatar_config?: Record<string, unknown>;
  bio?: string;
  is_admin?: boolean;
  is_online?: boolean;
  last_seen?: string;
  created_at?: string;
}

export interface AuthResponse {
  ok: boolean;
  token?: string;
  user?: User;
  error?: string;
  detail?: string;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  error?: string;
  detail?: string;
  data?: T;
  [key: string]: unknown;
}

export interface Room {
  id: number;
  name: string;
  description?: string;
  emoji?: string;
  is_public: boolean;
  created_by: number;
  current_music_track_id?: number | null;
  occupants_count?: number;
  is_live?: boolean;
  music_on?: boolean;
  created_at?: string;
  invite_code?: string;
}

export interface Message {
  id: number;
  room_id?: number | null;
  user_id: number;
  user?: User;
  content: string;
  kind?: 'text' | 'game_draw' | 'game_wheel' | 'system';
  meta?: Record<string, unknown>;
  reactions?: { emoji: string; count: number; users?: number[] }[];
  created_at: string;
  updated_at?: string;
}

export interface Track {
  id: number;
  title: string;
  artist?: string;
  genre?: string;
  duration_sec?: number;
  url: string;
  cover_url?: string;
}

export interface Playback {
  track?: Track | null;
  track_id?: number | null;
  started_at?: string;
  server_now?: string;
  position_sec?: number;
  enabled?: boolean;
}

export interface GamePrompt {
  id: number;
  type: 'verite' | 'action';
  category: 'soft' | 'moyen' | 'extreme' | '18plus';
  content: string;
}

export interface WheelSegment {
  id: number;
  label: string;
  color?: string;
  weight?: number;
}

export interface Challenge {
  id: number;
  from_user_id: number;
  to_user_id: number;
  prompt: string;
  status: 'pending' | 'accepted' | 'refused' | 'done';
  created_at: string;
}

export interface FriendRequest {
  id: number;
  from_user: User;
  status: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  user: User;
  last_message?: Message;
  unread_count?: number;
}

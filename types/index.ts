export interface Chat {
  id: string;
  nickname: string;
  created_at: string;
  expires_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
  expires_at: string;
} 
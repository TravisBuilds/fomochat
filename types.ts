export type Message = {
  id?: string;
  content: string;
  user_nickname: string;
  created_at: string;
  chat_id: string;
  role: 'user' | 'assistant';
};

export interface SpeechPattern {
  Hello: string;
  Goodbye: string;
  Yes: string;
  No: string;
  Loot: string;
  "Understand?": string;  // Note the exact property name
  "Player Noun": string;
  Rude: string;
  Surprised: string;
  Accent: string;
}

export interface Personality {
  id: any;
  base_prompt: string;
  greeting: string;
  Location: string;     // New column
  Picture: string;   // New column
} 
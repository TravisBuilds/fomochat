export interface Chat {
  "id": string;
  "nickname": string;
  "created_at": string;
  "expires_at": string;
}

export interface Message {
  id?: string;
  chat_id: string;
  content: string;
  user_nickname: string;
  created_at: string;
  role: 'user' | 'assistant';
}

export type SpeechPattern = {
  "Hello": string;
  "Goodbye": string;
  "Yes": string;
  "No": string;
  "Loot": string;
  "Understand?": string;
  "Rude": string;
  "Surprised": string;
  "Accent": string;
  "Player Noun": string;
};
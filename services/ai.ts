import type { Message, SpeechPattern } from '../types/index';
import { supabase } from './supabase';
import type { RequestInfo, RequestInit } from 'react-native-fetch-api';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

const DEEPSEEK_API_URL = 'http://54.187.160.113/api/generate';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const CURRENT_PROVIDER = process.env.EXPO_PUBLIC_AI_PROVIDER as 'deepseek' | 'gpt4';

// Rate limiting variables
const requestTimers = new Map<string, number>();
const MIN_REQUEST_INTERVAL = 3000; // 3 seconds between requests

if (!DEEPSEEK_API_URL) {
  throw new Error('Missing DEEPSEEK_API_URL environment variable');
}

export type Character = 'etienne' | 'oliver';

async function getTribeSpeech(tribeId: number) {
  try {
    const { data, error } = await supabase
      .from('tribes')
      .select('speech')
      .eq('id', tribeId)
      .single();
    
    if (error) throw error;
    return data?.speech ? Object.values(data.speech)[0] : null;
  } catch (error) {
    console.error('Error fetching tribe speech:', error);
    return null;
  }
}

export async function generateAIResponse(
  userMessage: string,
  character: Character,
  conversationHistory: string,
  userNickname: string,
  tribeId: number
): Promise<string> {
  try {
    const tribeSpeech = await getTribeSpeech(tribeId);
    
    const characterPrompt = character === 'etienne' 
      ? "You are Étienne, a French champagne specialist and bartender."
      : "You are Oliver, a British master mixologist and bartender.";

    const speechInstructions = tribeSpeech ? `
      Use these speech patterns:
      - Replace greetings with "${(tribeSpeech as SpeechPattern)["Hello"]}"
      - Replace farewells with "${(tribeSpeech as SpeechPattern)["Goodbye"]}"
      - Use "${(tribeSpeech as SpeechPattern)["Player Noun"]}" when referring to the player
      - End some sentences with "${(tribeSpeech as SpeechPattern)["Accent"]}"
    ` : '';

    const response = await fetch(DEEPSEEK_API_URL as RequestInfo, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { 
            role: "system", 
            content: `${characterPrompt} ${speechInstructions} You're speaking with ${userNickname}. Keep responses under 100 words and stay in character.`
          },
          {
            role: "user",
            content: `Previous conversation:\n${conversationHistory}\n\nUser: ${userMessage}`
          }
        ]
      })
    });

    const data = await response.json();
    return data.response || "I apologize, but I'm having trouble responding right now. Could you try again?";
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I apologize, but I'm having trouble responding right now. Could you try again?";
  }
}

export function formatConversationHistory(messages: Message[]): string {
  return messages
    .map(msg => `${msg.user_nickname}: ${msg.content}`)
    .join('\n');
}

function extractMemoryFromConversation(userMessage: string, aiResponse: string): string | null {
  // Implement logic to extract important information worth remembering
  // This could be preferences, facts about the user, or important interactions
  // Return null if nothing worth remembering
  return null;
}

function getDefaultResponse(character: Character): string {
  return character === 'etienne'
    ? 'Étienne appears distracted by a bottle on the shelf...'
    : 'Oliver smirks while polishing a glass...';
}

function getErrorResponse(character: Character): string {
  return character === 'etienne'
    ? "Étienne appears distracted by a bottle on the shelf..."
    : "Oliver raises an eyebrow while mixing something mysterious...";
}

function extractTopics(message: string): string[] {
  // Implement logic to extract relevant topics from the message
  // This is a placeholder and should be replaced with actual implementation
  return [];
}

export async function generateNPCResponse(
  messages: Message[],
  personality: any,
  tribeSpeech: SpeechPattern | null
): Promise<string> {
  try {
    console.log('Generating response for message:', messages[messages.length - 1]?.content);
    
    const systemPrompt = `${personality.base_prompt}
    ${tribeSpeech ? `
    Use these speech patterns:
    - Replace greetings with "${(tribeSpeech as SpeechPattern)["Hello"]}"
    - Replace farewells with "${(tribeSpeech as SpeechPattern)["Goodbye"]}"
    - Use "${(tribeSpeech as SpeechPattern)["Player Noun"]}" when referring to the player
    - End some sentences with "${(tribeSpeech as SpeechPattern)["Accent"]}"
    ` : ''}
    NEVER show your thought process or use <think> tags.
    NEVER explain how you construct responses.
    Keep responses under 100 words.`;

    if (CURRENT_PROVIDER === 'deepseek') {
      return await generateDeepSeekResponse(systemPrompt, messages);
    } else {
      console.log('Using GPT-4 provider');
      return await generateGPT4Response(systemPrompt, messages);
    }
  } catch (error) {
    console.error('Network or API error:', error);
    return "I apologize, but I'm having trouble responding right now.";
  }
}

async function generateDeepSeekResponse(systemPrompt: string, messages: Message[]): Promise<string> {
  const requestBody = {
    model: "deepseek-r1:70b",
    prompt: `${systemPrompt}\n\nUser: ${messages[messages.length - 1]?.content || ''}`,
    stream: false
  };

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Connection': 'keep-alive'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.response || "I apologize, but I'm having trouble responding right now.";
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateGPT4Response(systemPrompt: string, messages: Message[]): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key');
  }

  const chatId = messages[0]?.chat_id;
  const lastRequest = requestTimers.get(chatId);
  const now = Date.now();

  if (lastRequest && (now - lastRequest) < MIN_REQUEST_INTERVAL) {
    await wait(MIN_REQUEST_INTERVAL - (now - lastRequest));
  }

  requestTimers.set(chatId, now);

  const requestBody = {
    model: "gpt-4",  // Changed from turbo preview to standard GPT-4
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: messages[messages.length - 1]?.content || ''
      }
    ],
    max_tokens: 150,
    temperature: 0.7
  };

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (response.status === 429) {
      console.error('Rate limit exceeded with OpenAI, waiting before retry...');
      await wait(5000); // Wait 5 seconds before retry
      return "I need a moment to process. Please send your message again.";
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I apologize, but I'm having trouble responding right now.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I apologize, but I'm having trouble responding right now. Please try again in a moment.";
  }
}

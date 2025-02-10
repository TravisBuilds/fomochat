import { ETIENNE_CONTEXT } from './characters/etienne';
import { OLIVER_CONTEXT } from './characters/oliver';
import type { Message } from '../types';
import { getPersonality, getRelevantMemories, storeMemory, getRelevantKnowledge } from './aiPersonality';

const DEEPSEEK_API_URL = 'http://deepseek-r1.highstreet.world:3000/api/generate';

export type Character = 'etienne' | 'oliver';

type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function generateAIResponse(
  message: string,
  character: Character,
  conversationHistory: ConversationMessage[] = [],
  userNickname: string
): Promise<string> {
  try {
    const personality = await getPersonality(character);
    if (!personality) throw new Error('Personality not found');

    // Get relevant memories and knowledge
    const memories = await getRelevantMemories(character, userNickname);
    const relevantTopics = extractTopics(message); // You'll need to implement this
    const knowledge = await getRelevantKnowledge(relevantTopics);

    // Combine context
    const memoryContext = memories
      .map(m => `Remember: ${m.content}`)
      .join('\n');
    
    const knowledgeContext = knowledge
      .map(k => `Know this: ${k.content}`)
      .join('\n');

    const requestBody = {
      model: "deepseek-r1:32b",
      prompt: `${personality.base_prompt}\n\n${knowledgeContext}\n\n${memoryContext}\n\n${conversationHistory.map(m => 
        `${m.role === 'user' ? 'Guest' : personality.name}: ${m.content}`
      ).join('\n')}\n\n${personality.name}: ${message}`,
      stream: false,
      temperature: 0.7,
      max_tokens: 150
    };

    console.log(`Sending request to DeepSeek for ${character}...`);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    let cleanResponse = data.response || data.generated_text || '';
    cleanResponse = cleanResponse.replace(/<think>.*?<\/think>/gs, '').trim();
    
    // After successful response, potentially store new memories
    if (cleanResponse) {
      const newMemory = extractMemoryFromConversation(message, cleanResponse);
      if (newMemory) {
        await storeMemory({
          character_id: character,
          user_nickname: userNickname,
          memory_type: 'interaction',
          content: newMemory,
          relevance_score: 1
        });
      }
    }

    return cleanResponse || personality.fallback_response;
  } catch (error: any) {
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    const personality = await getPersonality(character);
    return personality?.error_response || 'Something went wrong...';
  }
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
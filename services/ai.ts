import { ETIENNE_CONTEXT } from './characters/etienne';
import { OLIVER_CONTEXT } from './characters/oliver';

const DEEPSEEK_API_URL = 'http://deepseek-r1.highstreet.world:3000/api/generate';

export type Character = 'etienne' | 'oliver';

export async function generateAIResponse(userMessage: string, character: Character = 'etienne'): Promise<string> {
  try {
    console.log(`Sending request to DeepSeek for ${character}...`);

    const context = character === 'etienne' ? ETIENNE_CONTEXT : OLIVER_CONTEXT;
    const characterName = character === 'etienne' ? 'Étienne' : 'Oliver';

    const requestBody = {
      model: "deepseek-r1:32b",
      prompt: `${context}\n\nGuest: ${userMessage}\n\n${characterName}:`,
      stream: false
    };

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
    
    return cleanResponse || getDefaultResponse(character);

  } catch (error: any) {
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return getErrorResponse(character);
  }
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
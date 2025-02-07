const DEEPSEEK_API_URL = 'http://deepseek-r1.highstreet.world:3000/api/generate';
const DEEPSEEK_API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;

interface DeepSeekMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  id: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

export async function generateAIResponse(userMessage: string): Promise<string> {
  try {
    console.log('Sending request to DeepSeek...');

    const systemPrompt = `
      Provide a concise response (maximum 400 words). 
      If the topic requires more detail, end your response with:
      "Would you like me to explain this in more detail?"
      Focus on the most important points first.
    `;

    const requestBody = {
      model: "deepseek-r1:32b",
      prompt: `${systemPrompt}\n\nUser: ${userMessage}`,
      stream: false
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    
    // Clean up the response
    let cleanResponse = data.response || data.generated_text || '';
    cleanResponse = cleanResponse.replace(/<think>.*?<\/think>/gs, '').trim();
    
    if (!cleanResponse) {
      console.error('Empty response after cleanup');
      return "I'm not sure how to respond to that.";
    }
    
    return cleanResponse;

  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}
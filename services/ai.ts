const DEEPSEEK_API_URL = 'https://api.deepseek.ai/v1/chat/completions';
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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate contextual responses based on user message
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return "Hello! How can I assist you today?";
    }
    
    if (userMessage.includes('?')) {
      return "That's an interesting question. Let me help you with that...";
    }
    
    if (userMessage.length < 10) {
      return "Could you please elaborate a bit more?";
    }
    
    return `I understand your message about "${userMessage}". How can I help you further?`;
    
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm here to help, but I'm having a bit of trouble right now. Could you try again?";
  }
}
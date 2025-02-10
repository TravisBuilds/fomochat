import { useState, useEffect, useCallback } from 'react';
import { generateAIResponse, Character } from '../services/ai';
import { Message } from '../types';
import { supabase } from '../services/supabase';
import { getPersonality } from '../services/aiPersonality';

export function useChat(chatId: string, nickname: string, character: Character) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //debug
  const checkMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId);
    console.log('Stored messages:', data);
    if (error) console.error('Query error:', error);
  };

  // Format messages for AI context
  const formatConversationHistory = (messages: Message[]) => {
    return messages.map(msg => ({
      role: msg.user_nickname === nickname ? 'user' : 'assistant',
      content: msg.content
    })).slice(-10); // Keep last 10 messages for context
  };

  // Load messages or initialize with greeting when character changes
  useEffect(() => {
    const loadMessages = async () => {
      console.log('Loading messages for character:', character);
      setMessages([]); // Clear existing messages first
      
      // Get personality
      const personality = await getPersonality(character);
      const greeting = personality?.greeting || "Welcome!";
      
      const initialMessage: Message = {
        id: Date.now().toString(),
        content: greeting,
        user_nickname: character,
        timestamp: new Date().toISOString(),
        chat_id: `${chatId}_${nickname}`
      };

      setMessages([initialMessage]);
      
      // Store greeting
      await supabase
        .from('messages')
        .insert([{
          content: greeting,
          user_nickname: character,
          chat_id: `${chatId}_${nickname}`
        }]);
    };

    loadMessages();
  }, [character, chatId, nickname]); // Trigger on character change

  const sendMessage = useCallback(async (text: string) => {
    try {
      setLoading(true);

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: text.trim(),
        user_nickname: nickname,
        timestamp: new Date().toISOString(),
        chat_id: `${chatId}_${nickname}`
      };

      setMessages(prev => [...prev, userMessage]);

      // Store in Supabase
      await supabase
        .from('messages')
        .insert([{
          content: text.trim(),
          user_nickname: nickname,
          chat_id: `${chatId}_${nickname}`
        }]);

      // Get conversation history for context
      const conversationHistory = formatConversationHistory([...messages, userMessage]);

      // Get AI response with context
      const aiResponse = await generateAIResponse(text, character, conversationHistory);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        user_nickname: character,
        timestamp: new Date().toISOString(),
        chat_id: `${chatId}_${nickname}`
      };

      setMessages(prev => [...prev, aiMessage]);

      await supabase
        .from('messages')
        .insert([{
          content: aiResponse,
          user_nickname: character,
          chat_id: `${chatId}_${nickname}`
        }]);

    } catch (error) {
      console.error('Error in sendMessage:', error);
    } finally {
      setLoading(false);
    }
  }, [messages, nickname, character, chatId]);

  useEffect(() => {
    // Subscribe to new messages for this specific chat
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}_${nickname}`
      }, (payload) => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, nickname]);

  return { messages, loading, sendMessage, error, checkMessages };
}
import { useState, useEffect, useCallback } from 'react';
import { generateAIResponse, Character } from '../services/ai';
import { Message } from '../types';
import { supabase } from '../services/supabase';

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

  // Load messages or initialize with greeting when character changes
  useEffect(() => {
    const loadMessages = async () => {
      console.log('Loading messages for character:', character);
      setMessages([]); // Clear existing messages first
      
      // Get greeting based on character
      const greeting = character === 'etienne' 
        ? "Ah, welcome to Elixir! I'm Étienne. Shall we find you the perfect champagne?"
        : "Welcome to The Blind Duke. Oliver Hawthorne at your service. What's your poison?";
        
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
      const { error } = await supabase
        .from('messages')
        .insert([{
          content: text.trim(),
          user_nickname: nickname,
          chat_id: `${chatId}_${nickname}`
        }]);

      if (error) throw error;

      // Get AI response
      const aiResponse = await generateAIResponse(text, character);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        user_nickname: character,
        timestamp: new Date().toISOString(),
        chat_id: `${chatId}_${nickname}`
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in sendMessage:', error);
    } finally {
      setLoading(false);
    }
  }, [nickname, character, chatId]);

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
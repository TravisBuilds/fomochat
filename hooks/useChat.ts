import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Message } from '../types';
import * as Crypto from 'expo-crypto';
import { generateAIResponse } from '../services/ai';

export function useChat(chatId: string, userNickname: string) {
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

  const sendMessage = async (content: string) => {
    setLoading(true);
    try {
      // Send user message
      const newMessage = {
        chat_id: `${chatId}_${userNickname}`,
        user_nickname: userNickname,
        content: content,
        created_at: new Date().toISOString(),
      };

      const { data: userData, error: userError } = await supabase
        .from('messages')
        .insert([newMessage])
        .select()
        .single();

      if (userError) {
        console.error('Error sending message:', userError);
        return;
      }

      // Update local state with user message
      setMessages(current => [...current, userData as Message]);

      // Generate and send AI response
      const aiResponse = await generateAIResponse(content);
      const aiMessage = {
        chat_id: `${chatId}_${userNickname}`,
        user_nickname: 'AI Assistant',
        content: aiResponse,
        created_at: new Date().toISOString(),
      };

      const { data: aiData, error: aiError } = await supabase
        .from('messages')
        .insert([aiMessage])
        .select()
        .single();

      if (aiError) {
        console.error('Error sending AI response:', aiError);
        return;
      }

      // Update local state with AI response
      setMessages(current => [...current, aiData as Message]);
      
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial messages load with nickname-specific chat_id
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', `${chatId}_${userNickname}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages(data || []);
    };

    loadMessages();

    // Subscribe to new messages for this specific chat
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}_${userNickname}`
      }, (payload) => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, userNickname]);

  return { messages, loading, sendMessage, error, checkMessages };
}
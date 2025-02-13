import { useState, useEffect, useCallback } from 'react';
import { generateNPCResponse } from '../services/ai';
import type { Message, SpeechPattern } from '../types';
import { supabase } from '../services/supabase';
import type { Character } from '../services/ai';


export function useChat(chatId: string, nickname: string, character: Character) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState<any>(null);
  const [tribeSpeech, setTribeSpeech] = useState<SpeechPattern | null>(null);

  // Single effect to load personality and initial message
  useEffect(() => {
    let mounted = true;
    
    const initialize = async () => {
      try {
        console.log('Initializing chat with character:', character);
        
        // Get personality only once
        const { data: personalityData, error: personalityError } = await supabase
          .from('personalities')
          .select('*')
          .eq('id', character)
          .single();

        if (personalityError) throw personalityError;
        if (!mounted) return;

        setPersonality(personalityData);

        // Get tribe speech if applicable
        const tribeSpeechData = personalityData?.tribe ? 
          await getTribeSpeech(personalityData.tribe) : null;
        
        if (!mounted) return;
        setTribeSpeech(tribeSpeechData);

        // Load existing messages or set initial greeting
        const { data: existingMessages } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', `${chatId}_${nickname}`)
          .order('created_at', { ascending: true });

        if (!mounted) return;

        if (existingMessages && existingMessages.length > 0) {
          setMessages(existingMessages);
        } else {
          const greeting = personalityData?.greeting || "Welcome!";
          const initialMessage: Message = {
            id: Date.now().toString(),
            content: greeting,
            user_nickname: character,
            created_at: new Date().toISOString(),
            chat_id: `${chatId}_${nickname}`,
            role: 'assistant'
          };

          const { data: savedGreeting } = await supabase
            .from('messages')
            .insert([initialMessage])
            .select()
            .single();

          if (savedGreeting && mounted) {
            setMessages([savedGreeting]);
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initialize();
    return () => { mounted = false; };
  }, [character, chatId, nickname]);

  const sendMessage = useCallback(async (content: string) => {
    if (!personality) return;
    
    try {
      setLoading(true);

      // Create user message
      const userMessage: Message = {
        chat_id: `${chatId}_${nickname}`,
        content,
        user_nickname: nickname,
        created_at: new Date().toISOString(),
        role: 'user'
      };

      // Save user message to database
      const { data: savedMessage, error: saveError } = await supabase
        .from('messages')
        .insert([userMessage])
        .select()
        .single();

      if (saveError) throw saveError;

      setMessages(prev => [...prev, savedMessage]);

      // Generate AI response using cached personality and tribeSpeech
      const aiResponse = await generateNPCResponse(
        messages,
        personality,
        tribeSpeech
      );

      // Create AI message
      const aiMessage: Message = {
        chat_id: `${chatId}_${nickname}`,
        content: aiResponse,
        user_nickname: character,
        created_at: new Date().toISOString(),
        role: 'assistant'
      };

      // Save AI message to database
      const { data: savedAiMessage, error: aiSaveError } = await supabase
        .from('messages')
        .insert([aiMessage])
        .select()
        .single();

      if (aiSaveError) throw aiSaveError;

      setMessages(prev => [...prev, savedAiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  }, [chatId, nickname, character, messages, personality, tribeSpeech]);

  return { messages, loading, sendMessage };
}

// Helper function to get tribe speech
async function getTribeSpeech(tribeId: number): Promise<SpeechPattern | null> {
  try {
    // Log the query attempt
    console.log('Fetching tribe speech for tribe:', tribeId);
    
    const { data, error } = await supabase
      .from('tribes')
      .select('speech_patterns')  // Changed from 'Speech' to 'speech_patterns'
      .eq('id', tribeId)
      .single();
    
    if (error) {
      console.error('Error fetching tribe speech:', error);
      return null;
    }
    
    return data?.speech_patterns;
  } catch (error) {
    console.error('Error in getTribeSpeech:', error);
    return null;
  }
}
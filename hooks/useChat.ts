import { useState, useEffect, useCallback } from 'react';
import { generateNPCResponse } from '../services/ai';
import type { Message, SpeechPattern } from '../types';
import { supabase } from '../services/supabase';
import type { Character } from '../services/ai';


export function useChat(chatId: string, nickname: string, character: Character) {
  console.log('useChat hook called with:', { chatId, nickname, character });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState<any>(null);
  const [tribeSpeech, setTribeSpeech] = useState<SpeechPattern | null>(null);

  useEffect(() => {
    console.log('useEffect triggered');
    let mounted = true;
    
    const initialize = async () => {
      console.log('Initialize function starting');
      try {
        console.log('Starting initialization for character:', character);
        
        // Get personality from Supabase
        const { data: personalityData, error: personalityError } = await supabase
          .from('personalities')
          .select('*')
          .eq('id', character)
          .single();

        console.log('Personality query result:', { personalityData, error: personalityError });

        if (personalityError) {
          console.error('Personality fetch error:', personalityError);
          throw personalityError;
        }

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

        console.log('Existing messages:', existingMessages?.length || 0);

        if (!mounted) return;

        if (existingMessages && existingMessages.length > 0) {
          console.log('Using existing messages');
          setMessages(existingMessages);
        } else {
          console.log('Creating new greeting with personality:', personalityData);
          
          if (!personalityData?.greeting) {
            console.error('No greeting found in personality data');
            return;
          }

          // Simplified message structure
          const initialMessage = {
            content: personalityData.greeting,
            user_nickname: character,
            chat_id: `${chatId}_${nickname}`,
            role: 'assistant'
          };

          const { data: savedGreeting, error: saveError } = await supabase
            .from('messages')
            .insert([initialMessage])
            .select()
            .single();

          if (saveError) {
            console.error('Error saving greeting:', saveError);
            return;
          }

          if (savedGreeting && mounted) {
            setMessages([savedGreeting]);
          }
        }
      } catch (error) {
        console.error('Error in initialize:', error);
      }
    };

    initialize();
    return () => { 
      console.log('Cleanup running');
      mounted = false; 
    };
  }, [character, chatId, nickname]);

  const sendMessage = useCallback(async (content: string) => {
    try {
      console.log('Sending message:', content); // Debug log
      setLoading(true);

      // Create user message
      const userMessage = {
        content,
        user_nickname: nickname,
        chat_id: `${chatId}_${nickname}`,
        role: 'user'
      };

      console.log('Saving user message:', userMessage); // Debug log

      // Save user message to database
      const { data: savedMessage, error: saveError } = await supabase
        .from('messages')
        .insert([userMessage])
        .select()
        .single();

      if (saveError) {
        console.error('Error saving user message:', saveError);
        throw saveError;
      }

      console.log('User message saved:', savedMessage); // Debug log
      setMessages(prev => [...prev, savedMessage]);

      // Generate AI response
      console.log('Generating AI response with:', {
        messages: [...messages, savedMessage],
        personality,
        tribeSpeech
      }); // Debug log

      const aiResponse = await generateNPCResponse(
        [...messages, savedMessage],
        personality,
        tribeSpeech
      );

      console.log('AI response received:', aiResponse); // Debug log

      // Create AI message
      const aiMessage = {
        content: aiResponse,
        user_nickname: character,
        chat_id: `${chatId}_${nickname}`,
        role: 'assistant'
      };

      // Save AI message to database
      const { data: savedAiMessage, error: aiSaveError } = await supabase
        .from('messages')
        .insert([aiMessage])
        .select()
        .single();

      if (aiSaveError) {
        console.error('Error saving AI message:', aiSaveError);
        throw aiSaveError;
      }

      console.log('AI message saved:', savedAiMessage); // Debug log
      setMessages(prev => [...prev, savedAiMessage]);

    } catch (error) {
      console.error('Error in sendMessage:', error);
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
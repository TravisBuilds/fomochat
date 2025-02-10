import { supabase } from './supabase';
import type { Character } from './ai';

interface Personality {
  id: string;
  name: string;
  base_prompt: string;
  greeting: string;
  fallback_response: string;
  error_response: string;
}

interface Memory {
  character_id: string;
  user_nickname: string;
  memory_type: 'preference' | 'fact' | 'interaction';
  content: string;
  relevance_score: number;
}

interface KnowledgeEntry {
  id: string;
  category: string;
  subcategory: string | null;
  title: string;
  content: string;
  importance: number;
  tags: string[];
}

export async function getPersonality(character: Character): Promise<Personality | null> {
  const { data, error } = await supabase
    .from('personalities')
    .select('*')
    .eq('id', character)
    .single();
    
  if (error) {
    console.error('Error fetching personality:', error);
    return null;
  }
  
  return data;
}

export async function storeMemory(memory: Omit<Memory, 'id' | 'created_at'>) {
  const { error } = await supabase
    .from('memories')
    .insert([memory]);

  if (error) {
    console.error('Error storing memory:', error);
  }
}

export async function getRelevantMemories(
  character: Character,
  userNickname: string,
  limit = 5
): Promise<Memory[]> {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('character_id', character)
    .eq('user_nickname', userNickname)
    .order('relevance_score', { ascending: false })
    .order('last_accessed', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching memories:', error);
    return [];
  }

  // Update last_accessed
  if (data.length > 0) {
    await supabase
      .from('memories')
      .update({ last_accessed: new Date().toISOString() })
      .in('id', data.map(m => m.id));
  }

  return data;
}

export async function getRelevantKnowledge(
  topics: string[],
  limit = 3
): Promise<KnowledgeEntry[]> {
  const { data, error } = await supabase
    .from('layer0_knowledge')
    .select('*')
    .contains('tags', topics)
    .order('importance', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching knowledge:', error);
    return [];
  }

  return data;
} 
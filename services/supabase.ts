import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('Supabase Key exists:', !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anonymous Key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: { 'x-client-info': 'supabase-js-debug' }
  }
});

export async function testDatabaseConnection() {
  try {
    const { error } = await supabase
      .from('messages')
      .select('*')
      .limit(1);

    if (error) {
      console.error('[TEST] Database connection test failed:', error);
      return false;
    }

    console.log('[TEST] Database connection test successful');
    return true;
  } catch (err) {
    console.error('[TEST] Unexpected error during test:', err);
    return false;
  }
}

// Test execution
testDatabaseConnection()
  .then(success => {
    console.log('[TEST] Test completed at:', new Date().toISOString(), 'Success:', success);
  })
  .catch(error => {
    console.log('[TEST] Test failed at:', new Date().toISOString(), 'Error:', error);
  })
  .finally(() => {
    console.log('[TEST] Test finished executing at:', new Date().toISOString());
  });
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

// Add more detailed logging for the test execution
console.log('[TEST] Starting database connection test at:', new Date().toISOString());
console.log('[TEST] Supabase client config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  schema: 'public'
});

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

export async function testDatabaseConnection() {
  console.log('[TEST] Step 1: Starting health check at:', new Date().toISOString());
  try {
    console.log('[TEST] About to call supabase...');
    console.log('[TEST] Supabase URL:', supabaseUrl);
    console.log('[TEST] Supabase Key exists:', !!supabaseAnonKey);
    
    // Create a timeout promise
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000);
    });

    // Use a simple auth check instead of a database query
    const { data: healthCheck, error: healthError } = await Promise.race([
      supabase.auth.getSession(),
      timeout
    ]) as any;
      
    console.log('[TEST] After supabase call, before Step 2');
    console.log('[TEST] Health check response:', healthCheck);
    console.log('[TEST] Step 2: Health check completed at:', new Date().toISOString());
    
    if (healthError) {
      console.log('[TEST] Health check failed:', healthError.message, 'Full error:', JSON.stringify(healthError, null, 2));
      return false;
    }

    console.log('[TEST] Step 3: Basic connection successful');
    
    // Try inserting a test nickname
    console.log('[TEST] Step 4: Testing nickname insertion');
    console.log('[TEST] Creating insert payload...');
    const insertPayload = { nickname: 'test_user6' };
    console.log('[TEST] Payload created:', insertPayload);
    console.log('[TEST] About to call supabase...');
    
    // Create and execute the insert
    const query = supabase.from('nicknames');
    query.insert([insertPayload]);
    
    console.log('[TEST] Step 5: Test completed');
    return true;
    
  } catch (err) {
    const error = err as Error;
    console.log('[TEST] Test failed with error:', {
      message: error?.message || 'Unknown error',
      type: error?.constructor?.name || 'Unknown type'
    });
    return false;
  }
}
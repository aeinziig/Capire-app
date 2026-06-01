// Simple test to check if supabase module loads correctly
try {
  const { createClient } = require('@supabase/supabase-js');
  console.log('Supabase module loaded successfully');

  const supabaseUrl = 'https://zehppoapxmfqjwwekanm.supabase.co';
  const supabaseAnonKey = 'sb_publishable_xDXRzEX73lN8SBWqTz-iGw_7UJopZBa';

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client created successfully');

  // Check if the client has the expected properties
  if (supabase && typeof supabase.from === 'function') {
    console.log('Supabase client appears to be properly configured');
  } else {
    console.log('Warning: Supabase client may not be properly configured');
  }
} catch (error) {
  console.error('Error loading supabase module:', error.message);
}
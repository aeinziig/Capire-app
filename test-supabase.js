// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zehppoapxmfqjwwekanm.supabase.co';
const supabaseAnonKey = 'sb_publishable_xDXRzEX73lN8SBWqTz-iGw_7UJopZBa';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Testing Supabase connection...');

// Test a simple query
supabase
  .from('capstone_projects')
  .select('count')
  .then(({ data, error }) => {
    if (error) {
      console.error('Connection failed:', error);
      process.exit(1);
    } else {
      console.log('Connection successful! Response:', data);
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
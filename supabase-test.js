// Test Supabase connection using existing client
const { supabase } = require('./src/services/supabase');

console.log('Testing Supabase connection...');

// Test a simple query
supabase
  .from('capstone_projects')
  .select('count', { count: 'exact', head: true })
  .then(({ data, error, count }) => {
    if (error) {
      console.error('Connection failed:', error);
      process.exit(1);
    } else {
      console.log('Connection successful! Count:', count);
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
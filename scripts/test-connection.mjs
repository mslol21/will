import fetch from 'node:http';

// Using Supabase REST API to run raw SQL via the pg-meta endpoint
const SUPABASE_URL = 'https://efcrctysxrwnrwlwriiy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY3JjdHlzeHJ3bnJ3bHdyaWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDc5NDksImV4cCI6MjEwMDQyMzk0OX0.zwxyS0EE9rLjFcvaYS9Trvt53QUdC4T5LjVCvI7dV5s';

const createTables = async () => {
  console.log('Testando conexão com Supabase...');

  const res = await globalThis.fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    }
  });
  console.log('Status:', res.status);
  const body = await res.text();
  console.log('Response:', body.substring(0, 200));
};

createTables().catch(console.error);

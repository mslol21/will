import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://efcrctysxrwnrwlwriiy.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmY3JjdHlzeHJ3bnJ3bHdyaWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDc5NDksImV4cCI6MjEwMDQyMzk0OX0.zwxyS0EE9rLjFcvaYS9Trvt53QUdC4T5LjVCvI7dV5s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function submitPrayerRequest(nome: string, oracao: string) {
  try {
    const { data, error } = await supabase.from("pedidos_oracao").insert([
      {
        nome: nome || "Anônimo",
        oracao,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) console.error("Error saving prayer request to Supabase:", error);
    return { data, error };
  } catch (err) {
    console.error("Supabase connection error:", err);
    return { data: null, error: err };
  }
}

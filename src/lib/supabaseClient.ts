import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = []
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  throw new Error(
    `Missing Supabase environment variables: ${missing.join(', ')}. ` +
    'Please add them to your Vercel project settings or .env.local file.'
  )
}

// Tối ưu: Tạo client một lần và reuse
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      // Tối ưu connection
      auth: {
        persistSession: false, // Không persist session vì dùng cookie
        autoRefreshToken: false,
      },
    });
  }
  return supabaseInstance;
})();


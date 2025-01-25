import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Por favor configura las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_KEY en el archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

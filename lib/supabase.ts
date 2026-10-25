import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fzyydfgowpzkxqwrwknl.supabase.co'
const supabaseAnonKey = 'sb_publishable_g6gjvC7QbLoJ3lzR6JyA9Q_B1uk_wxT'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
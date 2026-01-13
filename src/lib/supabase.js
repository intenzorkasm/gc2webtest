
import { createClient } from '@supabase/supabase-js'

// TODO: REPLACE THESE WITH YOUR ACTUAL SUPABASE KEYS
const supabaseUrl = 'https://jwdjcezffywdqnsjkjkp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3ZGpjZXpmZnl3ZHFuc2pramtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDM4NDgsImV4cCI6MjA4MjkxOTg0OH0.UzJfp7j8wnfETizb4FJzELWFy8mNDyXMc5zdGCQYyBg'

export const supabase = createClient(supabaseUrl, supabaseKey)

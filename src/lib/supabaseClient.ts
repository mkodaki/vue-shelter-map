import { createClient } from '@supabase/supabase-js'
import type { Database } from "../types/supabase";

export const supabase = createClient<Database>('https://zsxkmwgaxmjnkknnndmw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzeGttd2dheG1qbmtrbm5uZG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczNTg5NzUsImV4cCI6MjAyMjkzNDk3NX0.1Yh6NRMP1ZSp5UI584Lr2GS5JxJrjLXmOUNFwqlVN24')

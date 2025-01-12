import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserReports = {
  id: string;  // user email
  report_ids: number[];  // array of report IDs
}

export type Report = {
  id: number;
  created_at: string;
}

export async function getReportCount(email: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('userToReports')
      .select('report_ids')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Supabase error:', error.message);
      return 0;
    }

    return data?.report_ids?.length || 0;
  } catch (e) {
    console.error('Failed to fetch report count:', e);
    return 0;
  }
} 
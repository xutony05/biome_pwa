import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Report = {
  email: string;
  report_id: number;
  created_at: string;
  'C.Acne': number;
  'Other': number;
  'C.Krop': number;
  'C.Stri': number;
  'S.Cap': number;
  'S.Epi': number;
  'C.Avi': number;
  'C.gran': number;
  'S.haem': number;
  'S.Aur': number;
  'C.Tub': number;
  'S.hom': number;
  env_score: number;
  microbiome_score: number;
}

export async function getReportCount(email: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('email', email);

    if (error) {
      console.error('Supabase error:', error.message);
      return 0;
    }

    return count || 0;
  } catch (e) {
    console.error('Failed to fetch report count:', e);
    return 0;
  }
}

export async function getReportByNumber(email: string, reportNumber: number): Promise<Report | null> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: true })
      .range(reportNumber - 1, reportNumber - 1)
      .single();

    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Failed to fetch report:', e);
    return null;
  }
}

export interface SurveyAnswers {
  email: string;
  kit_id: string;        // from q1
  exfoliation: string;   // from q2
  breakouts: string;     // from q3
  skin_conditions: string[];  // from q4
}

export async function saveSurveyAnswers(email: string, answers: Record<string, any>): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('surveys')
      .insert({
        email: email,
        kit_id: answers.q1,
        exfoliation: answers.q2,
        breakouts: answers.q3,
        skin_conditions: answers.q4,
      });

    return { error };
  } catch (e) {
    console.error('Error saving survey');
    return { error: e };
  }
} 
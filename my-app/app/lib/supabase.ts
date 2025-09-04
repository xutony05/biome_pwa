import { createClient } from '@supabase/supabase-js';
import { calculateHydrationScore, calculateMicrobiomeScore } from './calculations';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: number;
  // Value products
  value_1_name: string;
  value_1_price: number;
  value_1_image: string;
  value_1_url: string;
  value_2_name: string;
  value_2_price: number;
  value_2_image: string;
  value_2_url: string;
  value_3_name: string;
  value_3_price: number;
  value_3_image: string;
  value_3_url: string;
  // Quality products
  quality_1_name: string;
  quality_1_price: number;
  quality_1_image: string;
  quality_1_url: string;
  quality_2_name: string;
  quality_2_price: number;
  quality_2_image: string;
  quality_2_url: string;
  quality_3_name: string;
  quality_3_price: number;
  quality_3_image: string;
  quality_3_url: string;
  // Luxury products
  luxury_1_name: string;
  luxury_1_price: number;
  luxury_1_image: string;
  luxury_1_url: string;
  luxury_2_name: string;
  luxury_2_price: number;
  luxury_2_image: string;
  luxury_2_url: string;
  luxury_3_name: string;
  luxury_3_price: number;
  luxury_3_image: string;
  luxury_3_url: string;
}

export type Report = {
  id: number;
  email: string;
  created_at: string;
  'C.Acne': number;
  'C.Stri': number;
  'S.Cap': number;
  'S.Epi': number;
  'C.Avi': number;
  'C.gran': number;
  'S.haem': number;
  'S.Aur': number;
  'C.Tub': number;
  'S.hom': number;
  'C.Krop': number;
  env_score: number;
  age: number;
  products: Product | null;
  good_ingredients: string[];
  avoid_ingredients: string[];
  good_food: string[];
  avoid_food: string[];
  lifestyle: string[];
}

export async function getReportCount(email: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('email', email);

    if (error) {
      console.error('Supabase error in getReportCount:', error.message);
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
      .select(`
        *,
        products:products(*)
      `)
      .eq('email', email)
      .order('created_at', { ascending: true })
      .range(reportNumber - 1, reportNumber - 1)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    return data;
  } catch (e) {
    console.error('Failed to fetch report:', e);
    return null;
  }
}

export async function getReportsWithDates(email: string): Promise<Array<{ created_at: string; report_number: number }>> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('created_at')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error in getReportsWithDates:', error.message);
      return [];
    }

    // Add report numbers (most recent = 1, oldest = last)
    return data?.map((report, index) => ({
      created_at: report.created_at,
      report_number: index + 1
    })) || [];
  } catch (e) {
    console.error('Failed to fetch reports with dates:', e);
    return [];
  }
}

export interface SurveyAnswers {
  email: string;
  kit_id: string;        // q1
  age: string;          // q3
  gender: string;       // q4
  city: string;         // q5
  skin_type: string;    // q6
  skin_conditions: string[];  // q7
  allergies: string;    // q8
  skincare_brands: string;    // q9
  additional_info: string;    // q10
  last_question_answered: string;  // Track the last question answered
  completed: boolean;   // Track if survey is completed
}

export async function saveSurveyAnswers(email: string, answers: Record<string, any>, lastQuestionId: string, isCompleted: boolean = false): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('surveys')
      .upsert({
        email: email,
        kit_id: answers.q1,
        age: answers.q3,
        gender: answers.q4,
        city: answers.q5,
        skin_type: answers.q6,
        skin_conditions: answers.q7,
        allergies: answers.q8,
        skincare_brands: answers.q9,
        additional_info: answers.q10,
        last_question_answered: lastQuestionId,
        completed: isCompleted
      }, {
        onConflict: 'kit_id'
      });

    return { error };
  } catch (e) {
    console.error('Error saving survey:', e);
    return { error: e };
  }
}

export async function getSurveyCount(email: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('kit_id')
      .eq('email', email.toLowerCase());

    if (error) {
      console.error('Error fetching survey count:', error);
      return 0;
    }

    return data?.length || 0;
  } catch (e) {
    console.error('Failed to fetch survey count:', e);
    return 0;
  }
}

export async function getLastSurvey(email: string): Promise<SurveyAnswers | null> {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('email', email.toLowerCase())
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching last survey:', error);
      return null;
    }

    // Return the first item if it exists, otherwise return null
    return data?.[0] || null;
  } catch (e) {
    console.error('Failed to fetch last survey:', e);
    return null;
  }
} 
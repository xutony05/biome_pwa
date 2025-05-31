import { createClient } from '@supabase/supabase-js';

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
  good_ingredients: string[];
  avoid_ingredients: string[];
  good_food: string[];
  avoid_food: string[];
  lifestyle: string[];
  products: Product | null;
}

export async function getReportCount(email: string): Promise<number> {
  try {
    console.log('Getting report count for email:', email);
    const { count, error } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('email', email);

    if (error) {
      console.error('Supabase error in getReportCount:', error.message);
      return 0;
    }

    console.log('Report count result:', count);
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
}

export async function saveSurveyAnswers(email: string, answers: Record<string, any>): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('surveys')
      .insert({
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
        created_at: new Date().toISOString()
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
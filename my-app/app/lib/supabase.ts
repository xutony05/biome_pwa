import { createClient } from '@supabase/supabase-js';
import { calculateHydrationScore, calculateMicrobiomeScore } from './calculations';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: number;
  // Value tier products
  value_cleanser_name?: string;
  value_cleanser_url?: string;
  value_cleanser_image?: string;
  value_toner_name?: string;
  value_toner_url?: string;
  value_toner_image?: string;
  value_serum_name?: string;
  value_serum_url?: string;
  value_serum_image?: string;
  value_moisturizer_name?: string;
  value_moisturizer_url?: string;
  value_moisturizer_image?: string;
  value_sunscreen_name?: string;
  value_sunscreen_url?: string;
  value_sunscreen_image?: string;
  // Quality tier products
  quality_cleanser_name?: string;
  quality_cleanser_url?: string;
  quality_cleanser_image?: string;
  quality_toner_name?: string;
  quality_toner_url?: string;
  quality_toner_image?: string;
  quality_serum_name?: string;
  quality_serum_url?: string;
  quality_serum_image?: string;
  quality_moisturizer_name?: string;
  quality_moisturizer_url?: string;
  quality_moisturizer_image?: string;
  quality_sunscreen_name?: string;
  quality_sunscreen_url?: string;
  quality_sunscreen_image?: string;
  // Luxury tier products
  luxury_cleanser_name?: string;
  luxury_cleanser_url?: string;
  luxury_cleanser_image?: string;
  luxury_toner_name?: string;
  luxury_toner_url?: string;
  luxury_toner_image?: string;
  luxury_serum_name?: string;
  luxury_serum_url?: string;
  luxury_serum_image?: string;
  luxury_moisturizer_name?: string;
  luxury_moisturizer_url?: string;
  luxury_moisturizer_image?: string;
  luxury_sunscreen_name?: string;
  luxury_sunscreen_url?: string;
  luxury_sunscreen_image?: string;
}

export type Report = {
  id: number;
  email: string;
  created_at: string;
  kit_id?: string;
  'C.Acne': number;
  'C.Stri': number;
  'S.Cap': number;
  'S.Epi': number;
  'C.Avi': number;
  'C.Gran': number;
  'S.Haem': number;
  'S.Aur': number;
  'C.Tub': number;
  'S.Hom': number;
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

export async function getReportsWithDates(email: string): Promise<Array<{ created_at: string; report_number: number; kit_id?: string }>> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('created_at, kit_id')
      .eq('email', email)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error in getReportsWithDates:', error.message);
      return [];
    }

    // Add report numbers (oldest = 1, newest = last)
    return data?.map((report, index) => ({
      created_at: report.created_at,
      report_number: index + 1,
      kit_id: report.kit_id
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

export async function getTotalSurveyCount(email: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('kit_id')
      .eq('email', email.toLowerCase());

    if (error) {
      console.error('Error fetching total survey count:', error);
      return 0;
    }

    return data?.length || 0;
  } catch (e) {
    console.error('Failed to fetch total survey count:', e);
    return 0;
  }
}

export async function getSurveyCount(email: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('kit_id')
      .eq('email', email.toLowerCase())
      .eq('completed', true);

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

/**
 * Gets the age from the surveys table using kit_id.
 * This function queries the surveys table to find the age associated with a specific kit_id.
 * 
 * @param kit_id - The kit ID to search for in the surveys table
 * @returns Promise<number | null> - The age as a number, or null if not found or error occurs
 */
export async function getAgeByKitId(kit_id: string): Promise<number | null> {
  try {
    // Query the surveys table to get the age for the specific kit_id
    const { data, error } = await supabase
      .from('surveys')
      .select('age')
      .eq('kit_id', kit_id)
      .single(); // Use single() to get only one record

    if (error) {
      return null;
    }

    // Convert the age string to a number (age is stored as string in database)
    const age = parseInt(data?.age, 10);
    
    return age;
  } catch (e) {
    return null;
  }
}

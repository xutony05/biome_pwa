import { supabase } from './supabase';

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, error };
  } catch (error) {
    return { user: null, error };
  }
};

export const loginWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL || window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    return { data, error};
  } catch (error) {
    return { data: null, error };
  }
};

export const registerWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { user: data.user, error };
  } catch (error) {
    return { user: null, error };
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
}; 
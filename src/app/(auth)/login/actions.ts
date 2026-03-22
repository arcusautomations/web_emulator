'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function loginAction(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Username and password are required' };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Invalid credentials. Try player1 / arcadium2026!' };
  }

  redirect('/');
}

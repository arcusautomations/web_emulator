'use server';

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function loginAction(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  // Convert username to email format for Supabase Auth
  const email = username.includes('@') ? username : `${username}@arcadium.app`;

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Invalid credentials' };
  }

  redirect('/');
}

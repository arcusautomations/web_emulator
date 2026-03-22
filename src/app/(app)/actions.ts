'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function toggleFavorite(gameId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('game_id')
    .eq('user_id', user.id)
    .eq('game_id', gameId)
    .single();

  if (existing) {
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('game_id', gameId);
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, game_id: gameId });
  }

  revalidatePath('/');
}

export async function deleteGame(gameId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  await supabase.from('games').delete().eq('id', gameId).eq('user_id', user.id);
  revalidatePath('/');
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
}

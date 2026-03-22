import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { GamePlayerLoader } from '@/components/emulator/GamePlayerLoader';

export default async function PlayPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: game } = await supabase.from('games').select('*').eq('id', gameId).single();

  if (!game) notFound();

  return <GamePlayerLoader game={game} />;
}

export default async function PlayPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  return (
    <div className="min-h-[100dvh] bg-void flex items-center justify-center">
      <p className="text-text-secondary font-mono">Loading game {gameId}...</p>
    </div>
  );
}

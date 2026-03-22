export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-void flex">
      {/* Sidebar will go here */}
      <main className="flex-1 overflow-auto">{children}</main>
      {/* BottomBar will go here */}
    </div>
  );
}

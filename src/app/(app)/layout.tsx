import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomBar } from '@/components/layout/BottomBar';
import { ToastContainer } from '@/components/ui/Toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-void">
      <Navbar />
      <div className="flex pt-14 lg:pt-16">
        <Sidebar />
        <main className="flex-1 lg:ml-60 min-h-[calc(100dvh-56px)] lg:min-h-[calc(100dvh-64px)] pb-16 lg:pb-0">
          {children}
        </main>
      </div>
      <BottomBar />
      <ToastContainer />
    </div>
  );
}

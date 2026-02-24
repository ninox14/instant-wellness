import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import DashboardSidebar from './components/DashboardSideBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="relative w-full">
        <SidebarTrigger className="absolute top-2 left-2" />
        {children}
      </main>
    </SidebarProvider>
  );
}

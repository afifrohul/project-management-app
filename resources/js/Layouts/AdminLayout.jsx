import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Toaster } from 'sonner';
import FlashToast from '@/Components/FlashToast';
import { usePage } from '@inertiajs/react';

export default function AdminLayout({ children, siteHeader }) {
  const { url } = usePage();
  const isKanbanPage = url?.endsWith('/kanban');

  return (
    <SidebarProvider defaultOpen={!isKanbanPage}>
      <Toaster richColors position="top-center" />
      <AppSidebar />
      <main className="max-w-full w-full h-full">
        {siteHeader ?? <SiteHeader />}
        <div className="p-4">
          <FlashToast />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

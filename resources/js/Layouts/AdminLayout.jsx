import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"

export default function AdminLayout({ children, siteHeader }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-full">
        {siteHeader ?? <SiteHeader />}
        <div className="p-4 min-h-screen">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import Footer from "@/components/layout/footer";
import AdminSidebar from "@/components/common/admin-sidebar";

function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SidebarProvider>
                <AdminSidebar />
                <div className="flex min-h-screen w-full flex-col">
                    <main className="flex min-h-screen w-full flex-1 flex-col">
                        {children}
                    </main>
                    <Footer />
                </div>
            </SidebarProvider>
        </>
    );
}

export default UserLayout;

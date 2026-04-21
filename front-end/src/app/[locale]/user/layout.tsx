"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SidebarUser from "@/components/common/admin/sidebar";

function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-slate-950">
                <SidebarUser />
                <div className="flex min-h-screen flex-1 min-w-0 flex-col bg-white dark:bg-slate-950">
                    <Header />
                    <main className="relative flex w-full flex-1 flex-col">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </SidebarProvider>
    );
}

export default UserLayout;

"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SidebarUser from "@/components/common/sidebar";

function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SidebarProvider>
                <SidebarUser />
                <div className="flex min-h-screen w-full flex-col">
                    <Header />
                    <main className="flex w-full flex-1 flex-col">
                        {children}
                    </main>
                    <Footer />
                </div>
            </SidebarProvider>
        </>
    );
}

export default UserLayout;

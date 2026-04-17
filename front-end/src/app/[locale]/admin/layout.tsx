"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Footer from "@/components/layout/footer";
import AdminSidebar from "@/components/common/admin/admin-sidebar";
import { HeaderActions } from "@/components/layout/header-actions";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Separator } from "@/components/ui/separator";

function UserLayout({ children }: { children: React.ReactNode }) {
    const { setTheme } = useTheme();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated } = useAuthStore();

    const changeLocale = (nextLocale: string) => {
        const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
        router.push(newPath);
    };

    return (
        <>
            <SidebarProvider>
                <AdminSidebar />
                <div className="flex min-h-screen w-full flex-col">
                    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                        </div>
                        <HeaderActions
                            locale={locale}
                            changeLocale={changeLocale}
                            setTheme={setTheme}
                            isAuthenticated={isAuthenticated}
                            showCart={false}
                            showMobileMenu={false}
                        />
                    </header>
                    <main className="flex min-h-screen w-full flex-1 flex-col p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                    <Footer />
                </div>
            </SidebarProvider>
        </>
    );
}

export default UserLayout;

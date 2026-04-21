import { User } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "../../ui/sidebar";
import { cn } from "@/lib/utils";
import { USER_SIDEBAR_ITEMS } from "../../../../mock";
import { useTranslations } from "next-intl";

const titleToKeyMap: Record<string, string> = {
    Profile: "profile",
    Memberships: "memberships",
    "Delivery Addresses": "addresses",
    Orders: "orders",
    "Payment Methods": "payments",
    "Help & Support": "support",
    "Change Password": "changePassword",
    "Terms & Conditions": "terms",
    "Privacy Policy": "privacy",
    Settings: "settings",
};

function SidebarUser() {
    const { toggleSidebar } = useSidebar();
    const t = useTranslations("sidebar");

    return (
        <>
            <Sidebar collapsible="icon" className="border-r dark:border-slate-800">
                <SidebarHeader className="p-3 sm:p-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                onClick={toggleSidebar}
                                className="group/header-btn hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-xl"
                            >
                                <div className="bg-blue-600 dark:bg-blue-500 text-white flex aspect-square size-8 sm:size-9 items-center justify-center rounded-lg shadow-sm">
                                    <User className="size-4 sm:size-5" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                                    <span className="truncate font-bold text-slate-800 dark:text-slate-100">
                                        {t("user")}
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent className="px-3">
                    <SidebarGroup className="p-0">
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1.5">
                                {USER_SIDEBAR_ITEMS.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a
                                                href={item.url}
                                                className={cn(
                                                    "hover:bg-slate-100 dark:hover:bg-slate-800 flex h-11 items-center gap-3 rounded-xl px-3 transition-all duration-200",
                                                    "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">
                                                    {t(titleToKeyMap[item.title] || item.title)}
                                                </span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
        </>
    );
}

export default SidebarUser;

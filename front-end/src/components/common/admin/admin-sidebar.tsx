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
import { ADMIN_SIDEBAR_ITEMS } from "../../../../mock";
import { useTranslations } from "next-intl";

const titleToKeyMap: Record<string, string> = {
    Dashboard: "dashboard",
    "Reports & Analytics": "reports",
    Users: "users",
    Orders: "orders",
    Products: "products",
    Categories: "categories",
    Brands: "brands",
    Attributes: "attributes",
    Vouchers: "vouchers",
    Shipping: "shipping",
    Transactions: "transactions",
    "Chat Support": "chat",
    "Comments & Reviews": "reviews",
    "Roles & Permissions": "roles",
    "System Logs": "logs",
    Settings: "settings",
};

function AdminSidebar() {
    const { toggleSidebar } = useSidebar();
    const t = useTranslations("sidebar");

    return (
        <>
            <Sidebar collapsible="icon" className="h-screen">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                onClick={toggleSidebar}
                                className="hover:bg-muted transition-all"
                            >
                                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <User className="size-4" />
                                </div>

                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {t("admin")}
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                {ADMIN_SIDEBAR_ITEMS.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a
                                                href={item.url}
                                                className={cn(
                                                    "hover:bg-muted flex h-10 items-center gap-3 rounded-md px-3 transition-colors"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                <span className="text-sm font-medium">
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

export default AdminSidebar;

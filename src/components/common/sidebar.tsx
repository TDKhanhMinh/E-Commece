import { ArrowRight, Command, User } from "lucide-react";
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
} from "../ui/sidebar";
import { USER_SIDEBAR_ITEMS } from "../../../mock";
import { cn } from "@/lib/utils";

function SidebarUser() {
    const { toggleSidebar, state } = useSidebar();
    const isCollapsed = state === "collapsed";
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
                                        User profile
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
                                {USER_SIDEBAR_ITEMS.map((item) => (
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
                                                    {item.title}
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

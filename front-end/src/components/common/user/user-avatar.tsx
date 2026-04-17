import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "@/i18n/routing";
import { MOCK_USER_ACTIONS } from "../../../../mock";
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

export function UserAvatar() {
    const { logout } = useAuthStore();
    const router = useRouter();
    const tSidebar = useTranslations("sidebar");
    const tUser = useTranslations("common.user");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer rounded-full text-lg"
                >
                    <User />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="mt-2 w-56 cursor-pointer"
            >
                {MOCK_USER_ACTIONS.map((action) => (
                    <DropdownMenuItem
                        key={action.label}
                        onClick={() => router.push(action.url)}
                        className="cursor-pointer"
                    >
                        {action.icon} {tSidebar(titleToKeyMap[action.label] || action.label)}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                        logout();
                        localStorage.clear();
                        router.push("/");
                    }}
                >
                    <LogOutIcon /> {tUser("logout")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

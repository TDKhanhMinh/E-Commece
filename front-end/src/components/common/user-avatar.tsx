import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, User } from "lucide-react";
import { MOCK_USER_ACTIONS } from "../../../mock";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "@/i18n/routing";

export function UserAvatar() {
    const { logout } = useAuthStore();
    const router = useRouter();
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
                        {action.icon} {action.label}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => {
                        logout();
                    }}
                >
                    <LogOutIcon /> Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

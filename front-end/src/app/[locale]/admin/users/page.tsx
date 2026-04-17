"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { deleteUser, getAllUsers, UserProfile } from "@/service/user-service";
import {
    Filter,
    MoreHorizontal,
    Phone,
    Search,
    Shield,
    User as UserIcon,
} from "lucide-react";

// Shadcn UI Components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import useDebounce from "@/hooks/use-debounce";
import { PaginationControl } from "@/components/common";
import RegisterDialog from "@/components/common/dialog/register-dialog";
import ConfirmAction from "@/components/common/dialog/confirm-action";
import { toast } from "sonner";

export default function AdminUsersPage() {
    const t = useTranslations("users");
    const tc = useTranslations("common");
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState("id");
    const [sortDir, setSortDir] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 500);
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: [
            "users",
            pageIndex,
            pageSize,
            sortBy,
            sortDir,
            debouncedSearch,
        ],
        queryFn: () =>
            getAllUsers(
                pageIndex - 1,
                pageSize,
                sortBy,
                sortDir,
                debouncedSearch
            ),
        placeholderData: keepPreviousData,
    });
    const deleteUserMutation = useMutation({
        mutationFn: (id: number) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success(t("messages.deleteSuccess"));
        },
        onError: () => {
            toast.error(t("messages.deleteError"));
        },
    });

    function handleDeleteUser(id: number) {
        deleteUserMutation.mutate(id);
    }
    //@ts-ignore
    const users: UserProfile[] = data?.content || [];
    //@ts-ignore
    const totalPages = data?.totalPages || 0;
    //@ts-ignore
    const totalElements = data?.totalElements || 0;

    const getRoleBadge = (role: string) => {
        const normalizedRole = role?.toUpperCase();
        switch (normalizedRole) {
            case "ADMIN":
                return (
                    <Badge className="border-red-200 bg-red-100 text-red-800 hover:bg-red-200">
                        {tc("roles.admin")}
                    </Badge>
                );
            case "SHIPPER":
                return (
                    <Badge className="border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {tc("roles.shipper")}
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-800"
                    >
                        {tc("roles.user")}
                    </Badge>
                );
        }
    };

    if (isError)
        return (
            <div className="flex h-[50vh] items-center justify-center text-red-500">
                <div className="text-center">
                    <h3 className="text-lg font-bold">{t("errors.loadData")}</h3>
                    <p>{t("errors.tryAgain")}</p>
                </div>
            </div>
        );

    return (
        <div className="bg-muted/40 min-h-screen space-y-6 p-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("subtitle")}
                    </p>
                </div>
                <RegisterDialog>
                    <Button variant="default"> {t("actions.addUser")}</Button>
                </RegisterDialog>
            </div>

            <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                    <CardTitle>{t("list.title")}</CardTitle>
                    <CardDescription>
                        {t("list.showingCount", {
                            count: users.length,
                            total: totalElements,
                        })}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
                        <div className="relative w-full sm:w-72">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                placeholder={t("list.searchPlaceholder")}
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPageIndex(1);
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground hidden text-sm whitespace-nowrap sm:inline">
                                {t("list.rowsPerPage")}
                            </span>
                            <Select
                                value={pageSize.toString()}
                                onValueChange={(val) => {
                                    setPageSize(Number(val));
                                    setPageIndex(1);
                                }}
                            >
                                <SelectTrigger className="w-27.5">
                                    <SelectValue
                                        placeholder={`10 ${t("list.rows")}`}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">
                                        5 {t("list.rows")}
                                    </SelectItem>
                                    <SelectItem value="10">
                                        10 {t("list.rows")}
                                    </SelectItem>
                                    <SelectItem value="20">
                                        20 {t("list.rows")}
                                    </SelectItem>
                                    <SelectItem value="50">
                                        50 {t("list.rows")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-75">
                                        {t("table.userInfo")}
                                    </TableHead>
                                    <TableHead>{t("table.role")}</TableHead>
                                    <TableHead>{t("table.email")}</TableHead>
                                    <TableHead className="text-right">
                                        {t("table.actions")}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: pageSize }).map(
                                        (_, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Skeleton className="h-10 w-10 rounded-full" />
                                                        <div className="space-y-2">
                                                            <Skeleton className="h-4 w-24" />
                                                            <Skeleton className="h-3 w-32" />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-5 w-16 rounded-full" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-40" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="ml-auto h-8 w-8" />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-muted-foreground h-40 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Filter className="h-8 w-8 text-gray-300" />
                                                <p>
                                                    {t("list.noData")}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="hover:bg-muted/5"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border">
                                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                            {user.name
                                                                ?.charAt(0)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">
                                                            {user.name}
                                                        </span>
                                                        {user.phone && (
                                                            <span className="text-muted-foreground flex items-center gap-1 text-xs">
                                                                <Phone className="h-3 w-3" />{" "}
                                                                {user.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getRoleBadge(user.role)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {user.email}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="hover:bg-muted h-8 w-8 p-0"
                                                        >
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            {t("actions.menuTitle")}
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <UserIcon className="text-muted-foreground mr-2 h-4 w-4" />{" "}
                                                            {t("actions.viewDetails")}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Shield className="text-muted-foreground mr-2 h-4 w-4" />{" "}
                                                            {t("actions.permissions")}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive cursor-pointer"
                                                            onSelect={(e) =>
                                                                e.preventDefault()
                                                            }
                                                        >
                                                            <ConfirmAction
                                                                title={t(
                                                                    "actions.deleteAccount"
                                                                )}
                                                                btnText={t(
                                                                    "actions.deleteAccount"
                                                                )}
                                                                description={t(
                                                                    "actions.deleteConfirm"
                                                                )}
                                                                requiredText={
                                                                    "DELETE"
                                                                }
                                                                actionText={t(
                                                                    "actions.delete"
                                                                )}
                                                                onConfirm={() =>
                                                                    handleDeleteUser(
                                                                        user.id
                                                                    )
                                                                }
                                                            />
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {!isLoading && totalElements > 0 && (
                        <div className="flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
                            <div className="text-muted-foreground text-xs">
                                {t("pagination.showing")}{" "}
                                <strong>
                                    {(pageIndex - 1) * pageSize + 1}
                                </strong>{" "}
                                {t("pagination.to")}{" "}
                                <strong>
                                    {Math.min(
                                        pageIndex * pageSize,
                                        totalElements
                                    )}
                                </strong>
                            </div>
                            <PaginationControl
                                currentPage={pageIndex}
                                totalPages={totalPages}
                                onPageChange={(newPage) =>
                                    setPageIndex(newPage)
                                }
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

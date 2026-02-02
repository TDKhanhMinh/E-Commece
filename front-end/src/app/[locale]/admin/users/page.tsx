"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Edit,
    Eye,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Trash,
} from "lucide-react";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmAction from "@/components/common/confirm-action";

// --- TYPES ---
type UserStatus = "active" | "blocked";
type UserRole = "Admin" | "Seller" | "Customer";

type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    avatarUrl?: string;
    lastActive: string; // Thêm trường này cho chuyên nghiệp
};

// --- MOCK DATA ---
const mockUsers: User[] = [
    {
        id: "1",
        name: "Alice Nguyen",
        email: "alice@example.com",
        role: "Customer",
        status: "active",
        avatarUrl: "https://github.com/shadcn.png",
        lastActive: "2 mins ago",
    },
    {
        id: "2",
        name: "Bob Tran",
        email: "bob@example.com",
        role: "Seller",
        status: "active",
        lastActive: "5 hours ago",
    },
    {
        id: "3",
        name: "Cathy Le",
        email: "cathy@example.com",
        role: "Admin",
        status: "active",
        lastActive: "1 day ago",
    },
    {
        id: "4",
        name: "David Pham",
        email: "david@example.com",
        role: "Customer",
        status: "blocked",
        lastActive: "1 month ago",
    },
    {
        id: "5",
        name: "Eve Vo",
        email: "eve@example.com",
        role: "Seller",
        status: "active",
        lastActive: "Just now",
    },
];

export default function AdminUsersPage() {
    // --- STATE ---
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setUsers(mockUsers);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // --- LOGIC: Filter & Search ---
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || user.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [users, searchQuery, statusFilter]);
    const handleDeleteUser = () => {};

    const getStatusBadge = (status: UserStatus) => {
        const styles = {
            active: "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200",
            pending:
                "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 border-yellow-200",
            blocked:
                "bg-red-100 text-red-700 hover:bg-red-100/80 border-red-200",
        };
        return (
            <Badge className={styles[status]} variant="outline">
                {status.toUpperCase()}
            </Badge>
        );
    };

    return (
        <div className="bg-muted/40 min-h-screen space-y-6 p-6">
            {/* Header Section */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Quản lý người dùng
                    </h1>
                    <p className="text-muted-foreground">
                        Quản lý quyền truy cập và thông tin tài khoản.
                    </p>
                </div>
                <Button className="gap-2 shadow-sm">
                    <Plus className="h-4 w-4" /> Thêm mới
                </Button>
            </div>

            {/* Main Content Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Danh sách tài khoản</CardTitle>
                    <CardDescription>
                        Hiển thị {filteredUsers.length} người dùng trong hệ
                        thống.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
                        <div className="relative w-full sm:w-72">
                            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            <Input
                                placeholder="Tìm theo tên hoặc email..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="Trạng thái" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tất cả trạng thái
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Hoạt động
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Chờ duyệt
                                    </SelectItem>
                                    <SelectItem value="blocked">
                                        Đã khóa
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">
                                        Người dùng
                                    </TableHead>
                                    <TableHead>Vai trò</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Hoạt động cuối
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Hành động
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    // Loading Skeletons
                                    Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex gap-3">
                                                        <Skeleton className="h-10 w-10 rounded-full" />
                                                        <div className="space-y-2">
                                                            <Skeleton className="h-4 w-24" />
                                                            <Skeleton className="h-3 w-32" />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-16" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-5 w-20 rounded-full" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-4 w-24" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="ml-auto h-8 w-8" />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )
                                ) : filteredUsers.length === 0 ? (
                                    // Empty State
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-muted-foreground h-24 text-center"
                                        >
                                            Không tìm thấy người dùng nào phù
                                            hợp.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    // Data Rows
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={user.avatarUrl}
                                                            alt={user.name}
                                                        />
                                                        <AvatarFallback>
                                                            {user.name.charAt(
                                                                0
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">
                                                            {user.name}
                                                        </span>
                                                        <span className="text-muted-foreground text-xs">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm font-medium">
                                                    {user.role}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(user.status)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground hidden text-sm md:table-cell">
                                                {user.lastActive}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Thao tác
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Eye className="mr-2 h-4 w-4" />{" "}
                                                            Xem chi tiết
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4" />{" "}
                                                            Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            <Trash />
                                                            <ConfirmAction
                                                                title={
                                                                    "Xác nhận xóa người dùng"
                                                                }
                                                                btnText={"Xóa"}
                                                                description={
                                                                    "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa người dùng này không?"
                                                                }
                                                                requiredText={
                                                                    "DELETE"
                                                                }
                                                                actionText={
                                                                    "Xóa người dùng"
                                                                }
                                                                onConfirm={
                                                                    handleDeleteUser
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

                    {/* Simple Pagination */}
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button variant="outline" size="sm" disabled>
                            Trước
                        </Button>
                        <Button variant="outline" size="sm">
                            Sau
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

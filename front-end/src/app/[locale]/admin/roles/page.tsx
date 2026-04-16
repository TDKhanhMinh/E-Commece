"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Settings,
  Menu,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Mock Data ---

const ROLES_DATA = [
  {
    id: 1,
    name: "Administrator",
    slug: "admin",
    description: "Toàn quyền quản trị hệ thống, quản lý người dùng và cấu hình nâng cao.",
    userCount: 3,
    color: "bg-red-500",
    permissions: ["all"],
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Shipper Manager",
    slug: "shipper_manager",
    description: "Quản lý đội ngũ giao hàng, theo dõi đơn hàng và điều phối vận chuyển.",
    userCount: 8,
    color: "bg-blue-500",
    permissions: ["orders.read", "orders.write", "shipping.all"],
    createdAt: "2024-02-15",
  },
  {
    id: 3,
    name: "Order Processor",
    slug: "order_processor",
    description: "Xử lý đơn hàng, cập nhật trạng thái thanh toán và thông tin khách hàng.",
    userCount: 15,
    color: "bg-green-500",
    permissions: ["orders.read", "orders.write", "products.read"],
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    name: "Inventory Staff",
    slug: "inventory",
    description: "Quản lý kho hàng, cập nhật số lượng tồn kho và thông tin sản phẩm.",
    userCount: 12,
    color: "bg-amber-500",
    permissions: ["products.all", "reports.read"],
    createdAt: "2024-03-20",
  },
];

const MODULES_DATA = [
  {
    id: "orders",
    name: "Quản lý đơn hàng",
    permissions: [
      { id: "orders.read", name: "Xem đơn hàng", description: "Cho phép xem danh sách và chi tiết đơn hàng." },
      { id: "orders.write", name: "Xử lý đơn hàng", description: "Cho phép xác nhận, đóng gói và cập nhật đơn hàng." },
      { id: "orders.delete", name: "Hủy đơn hàng", description: "Cho phép hủy hoặc xóa đơn hàng khỏi hệ thống." },
    ],
  },
  {
    id: "products",
    name: "Quản lý sản phẩm",
    permissions: [
      { id: "products.read", name: "Xem sản phẩm", description: "Cho phép xem danh mục và chi tiết sản phẩm." },
      { id: "products.write", name: "Cập nhật sản phẩm", description: "Cho phép thêm mới, chỉnh sửa thông tin sản phẩm." },
      { id: "products.delete", name: "Xóa sản phẩm", description: "Cho phép xóa sản phẩm khỏi cửa hàng." },
    ],
  },
  {
    id: "users",
    name: "Quản lý người dùng",
    permissions: [
      { id: "users.read", name: "Xem người dùng", description: "Cho phép xem danh sách và hồ sơ khách hàng/nhân viên." },
      { id: "users.write", name: "Chỉnh sửa người dùng", description: "Cho phép cập nhật thông tin và trạng thái tài khoản." },
      { id: "users.delete", name: "Xóa người dùng", description: "Cho phép xóa tài khoản người dùng." },
      { id: "users.roles", name: "Phân vai trò", description: "Cho phép thay đổi vai trò và quyền của người dùng." },
    ],
  },
  {
    id: "transactions",
    name: "Giao dịch & Ví",
    permissions: [
      { id: "transactions.read", name: "Xem lịch sử ví", description: "Cho phép xem các giao dịch nạp/rút tiền." },
      { id: "transactions.verify", name: "Duyệt giao dịch", description: "Cho phép phê duyệt hoặc từ chối các yêu cầu rút tiền." },
    ],
  },
];

// --- Components ---

export default function RolesPermissionsPage() {
  const [activeTab, setActiveTab] = useState("roles");

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vai trò & Quyền hạn</h2>
          <p className="text-muted-foreground">
            Quản lý các nhóm người dùng và thiết lập quyền truy cập hệ thống.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateRoleDialog>
            <Button className="bg-primary shadow-lg hover:shadow-primary/20 transition-all">
              <Plus className="mr-2 h-4 w-4" /> Tạo vai trò mới
            </Button>
          </CreateRoleDialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Tổng vai trò" 
          value="4" 
          icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
          description="Các nhóm quyền đã định nghĩa"
        />
        <StatsCard 
          title="Tổng người dùng" 
          value="38" 
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Nhân viên đã được phân vai"
        />
        <StatsCard 
          title="Permissions" 
          value="24" 
          icon={<Lock className="h-4 w-4 text-muted-foreground" />}
          description="Các điểm kiểm soát quyền"
        />
        <StatsCard 
          title="Admin Accounts" 
          value="3" 
          icon={<ShieldAlert className="h-4 w-4 text-red-500" />}
          description="Tài khoản có quyền tối cao"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="roles" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Danh sách vai trò
          </TabsTrigger>
          <TabsTrigger value="matrix" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Ma trận quyền hạn
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Phân vai người dùng
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4 outline-none">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ROLES_DATA.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
            <Card className="flex flex-col items-center justify-center border-dashed border-2 bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer min-h-[200px]">
              <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                <div className="rounded-full bg-muted p-3">
                  <Plus className="h-6 w-6" />
                </div>
                <p className="font-semibold">Thêm vai trò mới</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4 outline-none">
          <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30">
              <CardTitle>Ma trận phân quyền chi tiết</CardTitle>
              <CardDescription>
                Thiết lập quyền truy cập cụ thể cho từng vai trò trên các module của hệ thống.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow>
                    <TableHead className="w-[300px] pl-6 font-bold text-foreground">HÀNH ĐỘNG / MODULE</TableHead>
                    {ROLES_DATA.map(role => (
                      <TableHead key={role.id} className="text-center font-bold text-foreground">
                        <div className="flex flex-col items-center space-y-1">
                           <span className={`w-2 h-2 rounded-full ${role.color}`}></span>
                           <span>{role.name}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODULES_DATA.map((module) => (
                    <>
                      <TableRow key={module.id} className="bg-muted/5">
                        <TableCell colSpan={ROLES_DATA.length + 1} className="font-bold py-2 pl-6 text-primary">
                          <div className="flex items-center space-x-2">
                             <ChevronRight className="h-4 w-4" />
                             <span>{module.name}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                      {module.permissions.map((permission) => (
                        <TableRow key={permission.id} className="hover:bg-muted/5 transition-colors">
                          <TableCell className="pl-12 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium">{permission.name}</span>
                              <span className="text-xs text-muted-foreground">{permission.description}</span>
                            </div>
                          </TableCell>
                          {ROLES_DATA.map(role => (
                            <TableCell key={`${role.id}-${permission.id}`} className="text-center">
                              <Switch 
                                checked={role.slug === 'admin' || role.permissions.includes(permission.id)}
                                disabled={role.slug === 'admin'}
                                className="data-[state=checked]:bg-primary"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 outline-none">
           <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gán quyền người dùng</CardTitle>
                    <CardDescription>Quản lý danh sách nhân viên và các vai trò tương ứng.</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Input placeholder="Tìm kiếm nhân viên..." className="w-[300px]" />
                    <Button variant="outline">Lọc nhân viên</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nhân viên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vai trò hiện tại</TableHead>
                      <TableHead>Ngày tham gia</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <UserRow 
                      name="Nguyễn Văn Admin" 
                      email="admin@example.com" 
                      role="Administrator" 
                      date="01/01/2024"
                      status="Active"
                    />
                    <UserRow 
                      name="Trần Thị Shipper" 
                      email="shipper.mgr@example.com" 
                      role="Shipper Manager" 
                      date="15/02/2024"
                      status="Active"
                    />
                    <UserRow 
                      name="Lê Văn Kho" 
                      email="kho.van@example.com" 
                      role="Inventory Staff" 
                      date="20/03/2024"
                      status="Active"
                    />
                  </TableBody>
                </Table>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatsCard({ title, value, icon, description }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 font-medium">{description}</p>
      </CardContent>
    </Card>
  );
}

function RoleCard({ role }: any) {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:translate-y-[-4px] transition-all duration-300 bg-card/50 backdrop-blur-sm">
      <div className={`h-2 w-full ${role.color}`} />
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{role.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Users className="mr-2 h-4 w-4" /> Xem người dùng
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Xóa vai trò
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2 mt-2 leading-relaxed">
          {role.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between pt-2 border-t border-muted/30">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Người dùng</span>
            <span className="text-lg font-bold">{role.userCount} thành viên</span>
          </div>
          <div className="flex items-center space-x-1">
             <CheckCircle2 className="h-4 w-4 text-primary" />
             <span className="text-xs font-semibold text-primary italic">System Role</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-2">
           {role.permissions.map((p: string) => (
             <Badge key={p} variant="secondary" className="text-[10px] py-0 px-2 font-semibold">
               {p}
             </Badge>
           ))}
           {role.slug === 'admin' && (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none text-[10px] py-0 px-2 font-bold">
                FULL ACCESS
              </Badge>
           )}
        </div>
      </CardContent>
    </Card>
  );
}

function UserRow({ name, email, role, date, status }: any) {
  return (
    <TableRow className="hover:bg-muted/5 transition-colors">
      <TableCell className="font-medium p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {name.charAt(0)}
          </div>
          <span>{name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{email}</TableCell>
      <TableCell>
        <Badge variant={role === 'Administrator' ? 'destructive' : 'outline'} className="font-semibold">
          {role}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">{date}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-1.5">
           <span className="h-2 w-2 rounded-full bg-green-500"></span>
           <span className="font-medium text-sm">{status}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" className="font-semibold text-primary hover:bg-primary/5">
           Đổi vai trò
        </Button>
      </TableCell>
    </TableRow>
  );
}

function CreateRoleDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo vai trò mới</DialogTitle>
          <DialogDescription>
            Thiết lập tên và mô tả cho vai trò mới. Bạn có thể phân quyền chi tiết sau khi tạo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Tên vai trò</Label>
            <Input id="name" placeholder="Ví dụ: Editor, Moderator..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input id="description" placeholder="Mô tả ngắn gọn về trách nhiệm của vai trò này" />
          </div>
          <div className="grid gap-2">
            <Label>Màu sắc nhận diện</Label>
            <div className="flex gap-2">
              {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500'].map(color => (
                <div key={color} className={`h-8 w-8 rounded-full ${color} cursor-pointer border-2 border-transparent hover:border-white ring-offset-2 ring-primary transition-all`}></div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Hủy</Button>
          <Button type="submit">Xác nhận tạo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

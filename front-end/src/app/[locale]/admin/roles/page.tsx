"use client";

import React, { useState } from "react";
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
  ShieldAlert,
  Zap,
  Globe,
  Fingerprint,
  Filter
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
import { useTranslations } from "next-intl";

export default function RolesPermissionsPage() {
  const t = useTranslations("roles");
  const [activeTab, setActiveTab] = useState("roles");

  const ROLES_DATA = [
    {
      id: 1,
      name: t("data.admin"),
      slug: "admin",
      description: t("data.adminDesc"),
      userCount: 3,
      color: "from-rose-500 to-red-600",
      shadow: "shadow-rose-100",
      permissions: ["all"],
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      name: t("data.shipperManager"),
      slug: "shipper_manager",
      description: t("data.shipperManagerDesc"),
      userCount: 8,
      color: "from-blue-500 to-cyan-600",
      shadow: "shadow-blue-100",
      permissions: ["orders.read", "orders.write", "shipping.all"],
      createdAt: "2024-02-15",
    },
    {
      id: 3,
      name: t("data.orderProcessor"),
      slug: "order_processor",
      description: t("data.orderProcessorDesc"),
      userCount: 15,
      color: "from-emerald-500 to-green-600",
      shadow: "shadow-emerald-100",
      permissions: ["orders.read", "orders.write", "products.read"],
      createdAt: "2024-03-10",
    },
    {
      id: 4,
      name: t("data.inventory"),
      slug: "inventory",
      description: t("data.inventoryDesc"),
      userCount: 12,
      color: "from-amber-400 to-orange-500",
      shadow: "shadow-amber-100",
      permissions: ["products.all", "reports.read"],
      createdAt: "2024-03-20",
    },
  ];

  const MODULES_DATA = [
    {
      id: "orders",
      name: t("data.modules.orders"),
      icon: <Zap className="h-4 w-4" />,
      permissions: [
        { id: "orders.read", name: t("data.permissions.ordersRead"), description: t("data.permissions.ordersReadDesc") },
        { id: "orders.write", name: t("data.permissions.ordersWrite"), description: t("data.permissions.ordersWriteDesc") },
        { id: "orders.delete", name: t("data.permissions.ordersDelete"), description: t("data.permissions.ordersDeleteDesc") },
      ],
    },
    {
      id: "products",
      name: t("data.modules.products"),
      icon: <Globe className="h-4 w-4" />,
      permissions: [
        { id: "products.read", name: t("data.permissions.productsRead"), description: t("data.permissions.productsReadDesc") },
        { id: "products.write", name: t("data.permissions.productsWrite"), description: t("data.permissions.productsWriteDesc") },
        { id: "products.delete", name: t("data.permissions.productsDelete"), description: t("data.permissions.productsDeleteDesc") },
      ],
    },
    {
      id: "users",
      name: t("data.modules.users"),
      icon: <Users className="h-4 w-4" />,
      permissions: [
        { id: "users.read", name: t("data.permissions.usersRead"), description: t("data.permissions.usersReadDesc") },
        { id: "users.write", name: t("data.permissions.usersWrite"), description: t("data.permissions.usersWriteDesc") },
        { id: "users.delete", name: t("data.permissions.usersDelete"), description: t("data.permissions.usersDeleteDesc") },
        { id: "users.roles", name: t("data.permissions.usersRoles"), description: t("data.permissions.usersRolesDesc") },
      ],
    },
    {
      id: "transactions",
      name: t("data.modules.transactions"),
      icon: <Fingerprint className="h-4 w-4" />,
      permissions: [
        { id: "transactions.read", name: t("data.permissions.transactionsRead"), description: t("data.permissions.transactionsReadDesc") },
        { id: "transactions.verify", name: t("data.permissions.transactionsVerify"), description: t("data.permissions.transactionsVerifyDesc") },
      ],
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-8 pt-6">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-400 dark:to-slate-100 bg-clip-text text-transparent">
              {t("title")}
            </h2>
            <p className="text-muted-foreground text-lg font-medium">
              {t("subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CreateRoleDialog>
              <Button size="lg" className="rounded-xl px-6 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-none hover:shadow-slate-300 transition-all active:scale-95">
                <Plus className="mr-2 h-5 w-5" /> {t("createBtn")}
              </Button>
            </CreateRoleDialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title={t("stats.totalRoles")} 
            value="4" 
            icon={<ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            gradient="from-indigo-50 to-white dark:from-indigo-950/20 dark:to-slate-900"
            description={t("stats.rolesDesc")}
          />
          <StatsCard 
            title={t("stats.totalUsers")} 
            value="38" 
            icon={<Users className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />}
            gradient="from-cyan-50 to-white dark:from-cyan-950/20 dark:to-slate-900"
            description={t("stats.usersDesc")}
          />
          <StatsCard 
            title={t("stats.control")} 
            value="24" 
            icon={<Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
            gradient="from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900"
            description={t("stats.controlDesc")}
          />
          <StatsCard 
            title={t("stats.highAdmin")} 
            value="3" 
            icon={<ShieldAlert className="h-6 w-6 text-rose-600 dark:text-rose-400" />}
            gradient="from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900"
            description={t("stats.highAdminDesc")}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center md:justify-start">
            <TabsList className="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
              <TabsTrigger 
                value="roles" 
                className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-lg transition-all font-semibold"
              >
                {t("tabs.roles")}
              </TabsTrigger>
              <TabsTrigger 
                value="matrix" 
                className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-lg transition-all font-semibold"
              >
                {t("tabs.matrix")}
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-lg transition-all font-semibold"
              >
                {t("tabs.users")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="roles" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {ROLES_DATA.map((role) => (
                <RoleCard key={role.id} role={role} t={t} />
              ))}
              <CreateRoleDialog>
                <Card className="group flex flex-col items-center justify-center border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-primary/50 transition-all duration-300 cursor-pointer min-h-[280px] rounded-3xl">
                  <div className="flex flex-col items-center space-y-4 text-slate-400 dark:text-slate-600 group-hover:text-primary transition-colors">
                    <div className="rounded-full bg-white dark:bg-slate-800 p-5 shadow-sm group-hover:shadow-md transition-all group-hover:scale-110">
                      <Plus className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{t("tabsContent.roles.createNew")}</p>
                      <p className="text-xs font-medium opacity-80 mt-1">{t("tabsContent.roles.createNewDesc")}</p>
                    </div>
                  </div>
                </Card>
              </CreateRoleDialog>
            </div>
          </TabsContent>

          <TabsContent value="matrix" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
            <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-slate-800/20">
              <CardHeader className="bg-gradient-to-b from-slate-50/80 dark:from-slate-800/80 to-transparent pb-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold">{t("tabsContent.matrix.title")}</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400 font-medium italic">
                      {t("tabsContent.matrix.subtitle")}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 px-3 py-1 text-slate-600 dark:text-slate-400 font-bold tracking-tight">
                    {t("tabsContent.matrix.lockedAdmin")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/30 dark:bg-slate-800/30">
                      <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                        <TableHead className="w-[320px] pl-8 py-5 font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[11px]">{t("tabsContent.matrix.moduleAction")}</TableHead>
                        {ROLES_DATA.map(role => (
                          <TableHead key={role.id} className="text-center py-5 min-w-[140px]">
                            <div className="flex flex-col items-center space-y-3">
                              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg ${role.shadow} text-white font-bold text-sm`}>
                                {role.name.charAt(0)}
                              </div>
                              <span className="text-slate-900 dark:text-slate-100 font-bold text-sm tracking-tight px-2">{role.name}</span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MODULES_DATA.map((module) => (
                        <React.Fragment key={module.id}>
                          <TableRow className="bg-slate-50/10 dark:bg-slate-800/10 border-slate-100 dark:border-slate-800">
                            <TableCell colSpan={ROLES_DATA.length + 1} className="py-4 pl-8 border-l-4 border-primary">
                              <div className="flex items-center space-x-3 text-slate-900 dark:text-slate-100">
                                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                  {module.icon}
                                </div>
                                <span className="font-extrabold text-base tracking-tight">{module.name}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          {module.permissions.map((permission) => (
                            <TableRow key={permission.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors border-slate-50 dark:border-slate-800 group">
                              <TableCell className="pl-14 py-5 pr-4 border-slate-50 dark:border-slate-800">
                                <div className="flex flex-col space-y-1">
                                  <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{permission.name}</span>
                                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed italic">{permission.description}</span>
                                </div>
                              </TableCell>
                              {ROLES_DATA.map(role => (
                                <TableCell key={`${role.id}-${permission.id}`} className="text-center py-5">
                                  <div className="flex justify-center scale-110">
                                    <Switch 
                                      checked={role.slug === 'admin' || role.permissions.includes(permission.id)}
                                      disabled={role.slug === 'admin'}
                                      className="data-[state=checked]:bg-primary data-[state=checked]:shadow-md ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                  </div>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
            <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-slate-800/20">
              <CardHeader className="pb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-2xl font-bold">{t("tabsContent.users.title")}</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">{t("tabsContent.users.subtitle")}</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Input placeholder={t("tabsContent.users.searchPlaceholder")} className="w-[320px] rounded-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 pl-4 py-6 shadow-sm focus:shadow-md transition-all font-medium" />
                    </div>
                    <Button variant="outline" className="rounded-2xl py-6 px-5 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-slate-700 dark:text-slate-300">
                      <Filter className="h-4 w-4 mr-2" /> {t("tabsContent.users.filter")}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                      <TableHead className="pl-8 py-4 font-bold text-slate-600 dark:text-slate-400 text-[11px] uppercase tracking-widest">{t("tabsContent.users.table.employee")}</TableHead>
                      <TableHead className="py-4 font-bold text-slate-600 dark:text-slate-400 text-[11px] uppercase tracking-widest">{t("tabsContent.users.table.contact")}</TableHead>
                      <TableHead className="py-4 font-bold text-slate-600 dark:text-slate-400 text-[11px] uppercase tracking-widest">{t("tabsContent.users.table.role")}</TableHead>
                      <TableHead className="py-4 font-bold text-slate-600 dark:text-slate-400 text-[11px] uppercase tracking-widest">{t("tabsContent.users.table.joinedDate")}</TableHead>
                      <TableHead className="py-4 font-bold text-slate-600 dark:text-slate-400 text-[11px] uppercase tracking-widest text-center">{t("tabsContent.users.table.status")}</TableHead>
                      <TableHead className="text-right pr-8 py-4 font-bold text-slate-600 dark:text-slate-400 text-[11px] uppercase tracking-widest">{t("tabsContent.users.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <UserRow 
                      name="Nguyễn Văn Admin" 
                      email="admin@system.com" 
                      phone="+84 901 234 567"
                      role={t("data.admin")} 
                      roleColor="from-rose-500 to-red-600"
                      date="01/01/2024"
                      status={t("tabsContent.users.status.ready")}
                      t={t}
                    />
                    <UserRow 
                      name="Trần Thị Shipper" 
                      email="shipper.mgr@system.com" 
                      phone="+84 902 345 678"
                      role={t("data.shipperManager")} 
                      roleColor="from-blue-500 to-cyan-600"
                      date="15/02/2024"
                      status={t("tabsContent.users.status.active")}
                      t={t}
                    />
                    <UserRow 
                      name="Lê Minh Kho" 
                      email="kho.van@system.com" 
                      phone="+84 903 456 789"
                      role={t("data.inventory")} 
                      roleColor="from-amber-400 to-orange-500"
                      date="20/03/2024"
                      status={t("tabsContent.users.status.active")}
                      t={t}
                    />
                  </TableBody>
                </Table>
                <div className="p-8 flex justify-center border-t border-slate-50 dark:border-slate-800">
                  <Button variant="ghost" className="text-slate-400 dark:text-slate-500 font-bold hover:text-primary hover:bg-transparent tracking-widest text-xs uppercase">
                    {t("tabsContent.users.viewMore", { count: 35 })}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, description, gradient }: any) {
  return (
    <Card className={`border-none shadow-xl shadow-slate-200/30 dark:shadow-none overflow-hidden bg-gradient-to-br ${gradient} group hover:translate-y-[-2px] transition-all duration-300 rounded-[2rem]`}>
      <CardHeader className="flex flex-row items-center justify-between pt-6 pb-2 px-6">
        <CardTitle className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{title}</CardTitle>
        <div className="p-3 bg-white dark:bg-slate-800 shadow-sm rounded-2xl group-hover:scale-110 group-hover:shadow-md transition-all">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">
        <div className="text-4xl font-black text-slate-900 dark:text-slate-100 tabular-nums tracking-tighter">{value}</div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-bold flex items-center italic">
          <ChevronRight className="h-3 w-3 mr-1" />
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function RoleCard({ role, t }: any) {
  return (
    <Card className="group relative overflow-hidden border border-white/40 dark:border-slate-800/40 shadow-2xl shadow-slate-200/40 dark:shadow-none hover:translate-y-[-6px] transition-all duration-500 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem]">
      <div className={`absolute -right-8 -top-8 w-24 h-24 blur-3xl opacity-20 bg-gradient-to-br ${role.color} group-hover:scale-150 transition-all duration-700`} />
      
      <div className={`h-1.5 w-full bg-gradient-to-r ${role.color}`} />
      <CardHeader className="pb-4 relative z-10 px-8 pt-8 font-bold">
        <div className="flex justify-between items-center">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${role.color} ${role.shadow} text-white`}>
            {role.slug === 'admin' ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 backdrop-blur-md">
                <MoreVertical className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 font-medium">
              <DropdownMenuLabel className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-widest px-3 py-2">{t("roleCard.actions.title")}</DropdownMenuLabel>
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 focus:bg-slate-50 dark:focus:bg-slate-800 font-semibold group/item">
                <Pencil className="mr-2 h-4 w-4 text-primary group-hover/item:scale-110 transition-transform" /> {t("roleCard.actions.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 focus:bg-slate-50 dark:focus:bg-slate-800 font-semibold group/item">
                <Users className="mr-2 h-4 w-4 text-primary group-hover/item:scale-110 transition-transform" /> {t("roleCard.actions.viewUsers")}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
              <DropdownMenuItem className="rounded-xl text-rose-600 cursor-pointer py-2.5 focus:bg-rose-50 dark:focus:bg-rose-950/30 focus:text-rose-600 font-bold group/item">
                <Trash2 className="mr-2 h-4 w-4 group-hover/item:scale-110 transition-transform" /> {t("roleCard.actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-6 flex flex-col space-y-1">
           <CardTitle className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{role.name}</CardTitle>
           <Badge variant="secondary" className="w-fit bg-slate-100/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-none font-bold text-[10px] py-0 px-2.5 tracking-tighter">
             ID: {role.slug.toUpperCase()}
           </Badge>
        </div>
        <CardDescription className="line-clamp-2 mt-4 text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic h-10">
          {role.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-8 pb-8 relative z-10">
        <div className="flex items-center justify-between pt-6 border-t border-slate-100/50 dark:border-slate-800/50">
          <div className="flex flex-col space-y-0.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{t("roleCard.allocation")}</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-200 tabular-nums tracking-tighter">{t("roleCard.userCount", { count: role.userCount })}</span>
          </div>
          <div className="flex -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className={`h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-br ${role.color} flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-slate-100/20 dark:ring-slate-800/20 shadow-sm`}>
                 {i === 3 ? '+' + (role.userCount - 2) : ''}
               </div>
             ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-1 font-bold">
           {role.permissions.map((p: string) => (
             <Badge key={p} variant="secondary" className="text-[10px] py-1 px-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 font-bold tracking-tight rounded-lg">
               {p}
             </Badge>
           ))}
           {role.slug === 'admin' && (
              <Badge className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 border-none text-[10px] py-1 px-3 font-black tracking-widest rounded-lg ring-1 ring-rose-500/20">
                {t("roleCard.totalControl")}
              </Badge>
           )}
        </div>
      </CardContent>
    </Card>
  );
}

function UserRow({ name, email, phone, role, roleColor, date, status, t }: any) {
  return (
    <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all duration-300 border-slate-50 dark:border-slate-800 group">
      <TableCell className="pl-8 py-5">
        <div className="flex items-center space-x-4">
          <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${roleColor} p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
             <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[0.9rem] flex items-center justify-center text-slate-900 dark:text-slate-100 font-black text-base">
                {name.charAt(0)}
             </div>
          </div>
          <div className="flex flex-col space-y-0.5 font-bold">
            <span className="text-slate-900 dark:text-slate-100 text-sm font-black tracking-tight group-hover:text-primary transition-colors">{name}</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 tracking-tighter font-medium">{date}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-5 font-bold">
         <div className="flex flex-col">
            <span className="text-xs text-slate-800 font-bold tracking-tight">{email}</span>
            <span className="text-[10px] text-slate-400 font-medium tabular-nums">{phone}</span>
         </div>
      </TableCell>
      <TableCell className="py-5 font-bold">
        <Badge variant="secondary" className={`bg-gradient-to-r ${roleColor} bg-clip-text text-transparent font-black tracking-tight text-xs border-none p-0`}>
          {role}
        </Badge>
      </TableCell>
      <TableCell className="py-5 font-bold tabular-nums text-slate-500 dark:text-slate-400 text-sm">{date}</TableCell>
      <TableCell className="py-5 text-center font-bold">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest ring-1 ring-emerald-500/20">
           <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="uppercase">{status}</span>
        </div>
      </TableCell>
      <TableCell className="text-right pr-8 py-5">
        <Button variant="ghost" size="sm" className="font-black text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl px-4 text-xs tracking-widest uppercase hover:scale-105 transition-all">
           {t("tabsContent.users.table.changeRole")}
        </Button>
      </TableCell>
    </TableRow>
  );
}

function CreateRoleDialog({ children }: any) {
  const t = useTranslations("roles");
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] border-none shadow-2xl dark:shadow-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] p-8">
        <DialogHeader className="space-y-2">
          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 dark:bg-slate-100 flex items-center justify-center text-white dark:text-slate-900 mb-4 shadow-xl shadow-slate-200 dark:shadow-none">
             <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{t("createDialog.title")}</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium text-base">
            {t("createDialog.subtitle")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-8">
          <div className="grid gap-3">
            <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{t("createDialog.roleName")}</Label>
            <Input id="name" placeholder="Editor, Analyst, Warehouse Admin..." className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-primary/20 transition-all font-bold text-lg px-5 border-2 focus:border-primary/30 text-slate-900 dark:text-slate-100" />
          </div>
          <div className="grid gap-3 font-bold">
            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{t("createDialog.roleDesc")}</Label>
            <Input id="description" placeholder={t("createDialog.roleDescPlaceholder")} className="h-14 rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-primary/20 transition-all font-bold px-5 border-2 focus:border-primary/30 text-slate-900 dark:text-slate-100" />
          </div>
          <div className="grid gap-4 font-bold">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{t("createDialog.colorProfile")}</Label>
            <div className="flex gap-4 p-5 bg-slate-50/50 dark:bg-slate-950 rounded-3xl border-2 border-slate-100 dark:border-slate-800 border-dashed">
              {[
                { label: 'Rose', color: 'bg-rose-500' },
                { label: 'Indigo', color: 'bg-indigo-500' },
                { label: 'Emerald', color: 'bg-emerald-500' },
                { label: 'Amber', color: 'bg-amber-500' },
                { label: 'Slate', color: 'bg-slate-900 dark:bg-slate-100' }
              ].map(item => (
                <div key={item.color} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className={`h-11 w-11 rounded-2xl ${item.color} border-4 border-white dark:border-slate-800 shadow-lg group-hover:scale-110 transition-transform group-hover:shadow-xl`}></div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-3 sm:justify-start pt-4">
          <Button type="submit" className="h-14 px-10 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 dark:shadow-none hover:shadow-slate-300 transition-all hover:translate-y-[-2px] active:translate-y-[0px]">
            {t("createDialog.confirm")}
          </Button>
          <Button variant="ghost" className="h-14 px-8 rounded-2xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs hover:text-rose-600 transition-colors">
            {t("createDialog.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

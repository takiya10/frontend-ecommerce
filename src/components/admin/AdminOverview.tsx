import {
    DollarSign,
    Users as UsersIcon,
    ShoppingBag,
    Package
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { AdminStats, Order } from "@/types";
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

interface AdminOverviewProps {
    stats?: AdminStats;
    recentOrders?: Order[];
}

const REVENUE_DATA = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
];

const CATEGORY_DATA = [
    { name: 'Hijab', value: 400 },
    { name: 'Outfit', value: 300 },
    { name: 'Accessories', value: 300 },
];

const COLORS = ['#8B7355', '#D8A7B1', '#2C3E50', '#95A5A6'];

function StatCard({ title, value, icon: Icon, trend, color, bgClass }: { title: string, value: string | number, icon: any, trend: string, color: string, bgClass: string }) {
    return (
        <Card className="border-none shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className={cn("absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2", color)} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
                <div className={cn("p-2 rounded-lg text-white shadow-sm transition-transform group-hover:scale-110", color)}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <div className="flex items-center mt-2">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold mr-2", bgClass)}>{trend}</span>
                    <p className="text-[10px] text-muted-foreground">vs last month</p>
                </div>
            </CardContent>
        </Card>
    );
}

export function AdminOverview({ stats, recentOrders }: AdminOverviewProps) {
    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Gross Revenue" value={formatPrice(stats?.totalRevenue || 0)} icon={DollarSign} trend="+12.5%" color="bg-blue-500" bgClass="bg-blue-100 text-blue-700" />
                <StatCard title="Total Customers" value={stats?.totalUsers || 0} icon={UsersIcon} trend="+5.2%" color="bg-purple-500" bgClass="bg-purple-100 text-purple-700" />
                <StatCard title="Orders Placed" value={stats?.totalOrders || 0} icon={ShoppingBag} trend="+18.3%" color="bg-orange-500" bgClass="bg-orange-100 text-orange-700" />
                <StatCard title="Total Inventory" value={stats?.totalProducts || 0} icon={Package} trend="Stable" color="bg-emerald-500" bgClass="bg-emerald-100 text-emerald-700" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b border-border/40">
                            <CardTitle className="text-lg font-serif">Recent Transactions</CardTitle>
                            <CardDescription>Live incoming orders from customers.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/20">
                                    <TableRow>
                                        <TableHead className="text-[10px] uppercase font-bold">Order ID</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold">Customer</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-right">Amount</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders?.map(o => (
                                        <TableRow key={o.id} className="hover:bg-muted/10">
                                            <TableCell className="font-mono text-xs font-bold">#{o.id.split('-')[0]}</TableCell>
                                            <TableCell className="font-medium text-xs">{o.user?.name || "Guest"}</TableCell>
                                            <TableCell className="text-right font-bold text-xs">{formatPrice(o.totalAmount)}</TableCell>
                                            <TableCell>
                                                <Badge className={cn(
                                                    "rounded-full text-[9px] uppercase font-bold px-2 py-0 shadow-none border-none",
                                                    o.status === 'PAID' ? "bg-emerald-100 text-emerald-700" :
                                                        o.status === 'PENDING' ? "bg-orange-100 text-orange-700" :
                                                            "bg-red-100 text-red-700"
                                                )}>
                                                    {o.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!recentOrders?.length && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-xs">No recent orders found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-white to-muted/20">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Sales Trend</CardTitle>
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-full">+12.4% vs last year</span>
                            </div>
                            <div className="text-2xl font-serif font-bold pt-2">{formatPrice(18920000)}</div>
                        </CardHeader>
                        <CardContent className="h-[250px] p-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.1} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 500 }}
                                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3', opacity: 0.3 }}
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--popover))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            fontSize: '12px',
                                            fontWeight: 500
                                        }}
                                        formatter={(value: any) => [formatPrice(Number(value)), "Revenue"]}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Category Distribution (New) for Balance */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Top Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={CATEGORY_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {CATEGORY_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--popover))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            fontSize: '12px'
                                        }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

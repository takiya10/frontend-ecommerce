import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Order } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-client";
import { toast } from "sonner";

interface AdminOrdersProps {
    orders?: Order[];
}

export function AdminOrders({ orders }: AdminOrdersProps) {
    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) =>
            fetcher(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            toast.success("Order status updated");
        }
    });

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-serif">Sales & Operations</h2>
                    <p className="text-sm text-muted-foreground">Manage order fullfillment and track customer payments.</p>
                </div>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none font-bold px-4 py-1.5 h-auto text-xs uppercase tracking-wider">
                    {orders?.filter(o => o.status === 'PENDING').length || 0} Pending Actions
                </Badge>
            </div>

            <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/20">
                            <TableRow>
                                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Order ID</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Customer</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Items</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Total</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Date</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Status</TableHead>
                                <TableHead className="text-right text-[10px] uppercase font-bold text-muted-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders?.map(o => (
                                <TableRow key={o.id} className="hover:bg-muted/5 transition-colors">
                                    <TableCell className="font-mono text-[10px] uppercase font-bold text-primary">#{o.id.split('-')[0]}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{o.user?.name || "Guest Buyer"}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">{o.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex -space-x-2">
                                            {o.items.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden shadow-sm relative hover:z-10 transition-all hover:scale-110">
                                                    <img src={item.product?.images?.[0]?.url || "/placeholder.svg"} className="h-full w-full object-cover" alt="Product" />
                                                </div>
                                            ))}
                                            {o.items.length > 3 && (
                                                <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
                                                    +{o.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-sm">{formatPrice(o.totalAmount)}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge className={cn(
                                            "rounded-full text-[9px] uppercase font-bold px-2.5 py-0.5 border-none shadow-none",
                                            o.status === 'PAID' ? "bg-emerald-100 text-emerald-700" :
                                                o.status === 'PENDING' ? "bg-orange-100 text-orange-700" :
                                                    "bg-red-100 text-red-700"
                                        )}>
                                            {o.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => updateMutation.mutate({ id: o.id, status: 'PAID' })} className="text-emerald-600 focus:text-emerald-700 font-medium">Set as Paid</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateMutation.mutate({ id: o.id, status: 'SHIPPED' })} className="font-medium">Set as Shipped</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateMutation.mutate({ id: o.id, status: 'CANCELLED' })} className="text-red-600 focus:text-red-700 font-medium">Cancel Order</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

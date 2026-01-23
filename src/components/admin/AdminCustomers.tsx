import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, ShieldCheck, Users, Trash2 } from "lucide-react";
import { User } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AdminCustomersProps {
    users?: User[];
}

export function AdminCustomers({ users }: AdminCustomersProps) {
    const queryClient = useQueryClient();
    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }: { id: string, role: string }) =>
            fetcher(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success("User role updated");
        }
    });

    const suspendUserMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string, isActive: boolean }) =>
            fetcher(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success("User status updated");
        }
    });

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-serif">Member Community</h2>
                    <p className="text-sm text-muted-foreground">Monitor and manage registered customers and their privileges.</p>
                </div>
                <Badge variant="outline" className="px-4 py-1.5 h-auto font-bold text-primary border-primary/20 bg-primary/5">
                    {users?.length || 0} Total Members
                </Badge>
            </div>

            <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/20">
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Customer</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Email</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Account Status</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Joined</TableHead>
                                <TableHead className="text-right text-[10px] uppercase font-bold text-muted-foreground">Manage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.map(u => (
                                <TableRow key={u.id} className={cn("hover:bg-muted/5 transition-colors", !u.isActive && "opacity-50 bg-muted/10")}>
                                    <TableCell>
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-sm">
                                            {u.email[0].toUpperCase()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-sm">
                                        {u.name || "Guest Buyer"}
                                        {!u.isActive && <Badge variant="destructive" className="ml-2 text-[9px] px-1.5 h-4">SUSPENDED</Badge>}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground font-mono">{u.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={u.role === 'ADMIN' ? 'secondary' : 'outline'} className="text-[10px] uppercase font-bold tracking-widest px-3 py-1">
                                            {u.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {new Date(u.createdAt!).toLocaleDateString("id-ID", { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest opacity-70">Update Privileges</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => updateRoleMutation.mutate({ id: u.id, role: 'ADMIN' })}>
                                                    <ShieldCheck className="mr-2 h-4 w-4 text-emerald-600" /> Make Admin
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateRoleMutation.mutate({ id: u.id, role: 'USER' })}>
                                                    <Users className="mr-2 h-4 w-4" /> Make Customer
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className={cn("focus:bg-muted", !u.isActive ? "text-emerald-600 focus:text-emerald-600" : "text-destructive focus:text-destructive")}
                                                    onClick={() => suspendUserMutation.mutate({ id: u.id, isActive: !u.isActive })}
                                                >
                                                    {u.isActive ? (
                                                        <><Trash2 className="mr-2 h-4 w-4" /> Suspend Account</>
                                                    ) : (
                                                        <><ShieldCheck className="mr-2 h-4 w-4" /> Activate Account</>
                                                    )}
                                                </DropdownMenuItem>
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

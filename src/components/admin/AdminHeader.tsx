import { ChevronRight, Eye, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
    activeTab: string;
    adminUser: any;
    onMenuClick: () => void;
}

export function AdminHeader({ activeTab, adminUser, onMenuClick }: AdminHeaderProps) {
    return (
        <header className="h-16 border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 transition-all">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Button variant="ghost" size="icon" className="lg:hidden mr-2 -ml-2" onClick={onMenuClick}>
                    <Menu className="h-5 w-5" />
                </Button>
                <span className="text-xs uppercase tracking-widest font-bold opacity-60 hidden md:inline">Portal</span>
                <ChevronRight className="h-3 w-3 opacity-40 hidden md:inline" />
                <span className="text-xs uppercase tracking-widest font-bold text-foreground">{activeTab}</span>
            </div>

            <div className="flex items-center gap-6">
                <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')} className="rounded-full px-4 h-8 bg-background hover:bg-muted transition-colors border-primary/20 text-xs font-bold uppercase tracking-wider">
                    <Eye className="mr-2 h-3 w-3" /> Visit Store
                </Button>
                <div className="h-6 w-[1px] bg-border mx-2" />
                <div className="flex items-center gap-3 pl-2 py-1 rounded-full pr-1 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors">{adminUser?.name || "Admin"}</p>
                        <p className="text-[10px] text-primary font-bold uppercase mt-1">Super Admin</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold shadow-md ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                        {adminUser?.email?.[0]?.toUpperCase() || "A"}
                    </div>
                </div>
            </div>
        </header>
    );
}

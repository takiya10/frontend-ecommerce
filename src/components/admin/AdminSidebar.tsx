import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Image as ImageIcon,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    logout: (redirect: boolean) => void;
}

interface NavItemProps {
    value: string;
    label: string;
    icon: React.ElementType;
    isOpen: boolean;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const NavItem = ({ value, label, icon: Icon, isOpen, activeTab, setActiveTab }: NavItemProps) => (
    <button
        onClick={() => {
            setActiveTab(value);
            // On mobile we might want to close sidebar here, but we'll let parent handle via separate wrapper
        }}
        className={cn(
            "flex items-center w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group",
            activeTab === value
                ? "bg-white text-slate-900 shadow-lg shadow-white/10"
                : "text-white/60 hover:bg-white/10 hover:text-white"
        )}
    >
        <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isOpen && "mr-3")} />
        {isOpen && <span className="animate-fade-in">{label}</span>}
    </button>
);

// Reusable Navigation Content
export function AdminNav({ isOpen, activeTab, setActiveTab, logout }: {
    isOpen: boolean;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    logout: (redir: boolean) => void;
}) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full w-full">
            <div className="p-6 flex items-center justify-between border-b border-white/10">
                {isOpen ? (
                    <div className="flex flex-col animate-fade-in">
                        <span className="font-serif text-2xl font-bold tracking-tighter text-white">Byher</span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">Management</span>
                    </div>
                ) : (
                    <div className="mx-auto font-serif text-xl font-bold text-white">B</div>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto custom-scrollbar">
                <div className={cn("text-[10px] font-bold text-white/30 uppercase px-4 mb-2 tracking-widest", !isOpen && "hidden")}>Main</div>
                <NavItem value="overview" label="Dashboard" icon={LayoutDashboard} isOpen={isOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
                <NavItem value="orders" label="Orders" icon={ShoppingBag} isOpen={isOpen} activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className={cn("text-[10px] font-bold text-white/30 uppercase px-4 mt-8 mb-2 tracking-widest", !isOpen && "hidden")}>Catalog</div>
                <NavItem value="products" label="Products" icon={Package} isOpen={isOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
                <NavItem value="users" label="Customers" icon={Users} isOpen={isOpen} activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className={cn("text-[10px] font-bold text-white/30 uppercase px-4 mt-8 mb-2 tracking-widest", !isOpen && "hidden")}>Storefront</div>
                <NavItem value="cms" label="Hero Banners" icon={ImageIcon} isOpen={isOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
                <NavItem value="settings" label="Site Settings" icon={Settings} isOpen={isOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
            </nav>

            <div className="p-4 mt-auto border-t border-white/10 bg-white/5">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors",
                        isOpen ? "justify-start" : "justify-center px-0"
                    )}
                    onClick={() => { logout(true); navigate("/byher-internal-mgmt/login"); }}
                >
                    <LogOut className={cn("h-5 w-5", isOpen && "mr-3")} />
                    {isOpen && "Sign Out"}
                </Button>
            </div>
        </div>
    );
}

// Desktop Sidebar Wrapper
export function AdminSidebar({ isOpen, setIsOpen, activeTab, setActiveTab, logout }: AdminSidebarProps) {
    return (
        <aside className={cn(
            "bg-[#0F172A] text-white border-r border-white/5 transition-all duration-300 flex-col z-50 sticky top-0 h-screen shadow-2xl hidden lg:flex",
            isOpen ? "w-72" : "w-20"
        )}>
            <div className="absolute right-[-12px] top-6 z-50">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-6 w-6 rounded-full shadow-md border border-slate-200"
                >
                    {isOpen ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
                </Button>
            </div>

            <AdminNav isOpen={isOpen} activeTab={activeTab} setActiveTab={setActiveTab} logout={logout} />
        </aside>
    );
}

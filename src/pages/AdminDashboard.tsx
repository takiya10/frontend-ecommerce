import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetcher } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminStats, Product, Category, Order, User } from "@/types";

// Import new sub-components
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminCustomers } from "@/components/admin/AdminCustomers";
import { AdminCMS } from "@/components/admin/AdminCMS";
import { AdminSettings } from "@/components/admin/AdminSettings";

export default function AdminDashboard() {
  const { adminUser, isAdminAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auth Guard
  useEffect(() => {
    if (!authLoading) {
      if (!isAdminAuthenticated || adminUser?.role !== 'ADMIN') {
        toast.error("Akses ditolak. Halaman khusus Admin.");
        navigate("/byher-internal-mgmt/login");
      }
    }
  }, [isAdminAuthenticated, adminUser, navigate, authLoading]);

  // --- DATA FETCHING (Only fetch what's needed for the active tab to optimize) ---
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => fetcher<AdminStats>('/admin/stats'),
    enabled: !!adminUser && adminUser.role === 'ADMIN' && activeTab === 'overview',
  });

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => fetcher<Product[]>('/products'),
    enabled: !!adminUser && adminUser.role === 'ADMIN' && activeTab === 'products',
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetcher<Category[]>('/categories'),
    enabled: activeTab === 'products',
  });

  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => fetcher<Order[]>('/admin/orders'),
    enabled: !!adminUser && adminUser.role === 'ADMIN' && (activeTab === 'orders' || activeTab === 'overview'),
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => fetcher<User[]>('/admin/users'),
    enabled: !!adminUser && adminUser.role === 'ADMIN' && (activeTab === 'users' || activeTab === 'overview'),
  });

  if (authLoading || !adminUser) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* SIDEBAR */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logout={logout}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* TOPBAR */}
        <AdminHeader activeTab={activeTab} adminUser={adminUser} />

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === "overview" && <AdminOverview stats={stats} recentOrders={orders?.slice(0, 8)} />}
          {activeTab === "products" && <AdminProducts products={products} categories={categories} />}
          {activeTab === "orders" && <AdminOrders orders={orders} />}
          {activeTab === "users" && <AdminCustomers users={users} />}
          {activeTab === "cms" && <AdminCMS />}
          {activeTab === "settings" && <AdminSettings />}
        </div>
      </main>
    </div>
  );
}

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { isAuthenticated, isAdminAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Admin Route Protection
    if (requireAdmin) {
        if (!isAdminAuthenticated) {
            // Redirect to admin login, saving the location they tried to access
            return <Navigate to="/byher-internal-mgmt/login" state={{ from: location }} replace />;
        }
    }
    // User Route Protection
    else {
        if (!isAuthenticated) {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
    }

    return <>{children}</>;
}

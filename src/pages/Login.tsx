import { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface LoginProps {
  isAdminPage?: boolean;
}

export default function Login({ isAdminPage = false }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, isAdminAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // HARD REDIRECT: Immediate check before rendering any UI
  if (!authLoading) {
    if (isAdminPage && isAdminAuthenticated) {
      return <Navigate to="/byher-internal-mgmt" replace />;
    }
    if (!isAdminPage && isAuthenticated) {
      return <Navigate to="/" replace />;
    }
  }

  // Fallback loader (though authLoading should be false due to sync init)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password }, isAdminPage);
      if (isAdminPage) {
        navigate("/byher-internal-mgmt");
      } else {
        navigate("/");
      }
    } catch (error) {
      // Error is handled in AuthContext (toast)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-background",
      isAdminPage && "bg-muted/50"
    )}>
      {!isAdminPage && <Header />}

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif text-center">
              {isAdminPage ? "Admin Portal" : "Welcome back"}
            </CardTitle>
            <CardDescription className="text-center">
              {isAdminPage
                ? "Secure access for Byher internal management"
                : "Enter your credentials to access your account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isAdminPage && (
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAdminPage ? "Authorize Access" : "Sign In"}
              </Button>
            </form>
          </CardContent>
          {!isAdminPage && (
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </main>

      {!isAdminPage && <Footer />}
    </div>
  );
}
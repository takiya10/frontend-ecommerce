import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsSubmitted(true);
            toast.success("Reset link sent! Please check your email inbox.");
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <Card className="w-full max-w-md shadow-xl border-border/50 backdrop-blur-sm bg-background/95">
                    <CardHeader className="space-y-1">
                        <Link
                            to="/login"
                            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4 w-fit"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Link>
                        <CardTitle className="text-3xl font-serif text-center text-primary-foreground/90">
                            Recover Password
                        </CardTitle>
                        <CardDescription className="text-center text-balance pt-2">
                            {isSubmitted
                                ? "We've sent recovery instructions to your email."
                                : "Enter your email address and we'll send you a link to reset your password."
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-11 focus-visible:ring-primary/20"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all active:scale-[0.98]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending Link...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <div className="py-6 flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
                                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-10 w-10 text-primary" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="font-medium text-foreground">Check your email</p>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>.
                                        The link will expire in 1 hour.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full h-11"
                                    onClick={() => setIsSubmitted(false)}
                                >
                                    Use a different email
                                </Button>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 border-t pt-6 bg-muted/10">
                        <p className="text-xs text-center text-muted-foreground">
                            Don't have an account yet?{" "}
                            <Link to="/register" className="font-medium text-primary hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </main>

            <Footer />
        </div>
    );
}

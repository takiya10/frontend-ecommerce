import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/account/ProfileForm";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { User, Lock } from "lucide-react";

export default function AccountSettings() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container mx-auto py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-serif font-medium mb-2">Account Settings</h1>
                    <p className="text-muted-foreground mb-8">Manage your profile information and security.</p>

                    <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8">
                        <aside className="w-full md:w-64">
                            <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                                <TabsTrigger
                                    value="profile"
                                    className="w-full justify-start px-4 py-3 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted/50"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    Profile Details
                                </TabsTrigger>
                                <TabsTrigger
                                    value="security"
                                    className="w-full justify-start px-4 py-3 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted/50"
                                >
                                    <Lock className="mr-2 h-4 w-4" />
                                    Security
                                </TabsTrigger>
                            </TabsList>
                        </aside>

                        <div className="flex-1">
                            <TabsContent value="profile" className="m-0 space-y-6">
                                <div className="border rounded-lg p-6 bg-card">
                                    <h2 className="text-xl font-medium mb-4">Profile Details</h2>
                                    <ProfileForm />
                                </div>
                            </TabsContent>

                            <TabsContent value="security" className="m-0 space-y-6">
                                <div className="border rounded-lg p-6 bg-card">
                                    <h2 className="text-xl font-medium mb-4">Change Password</h2>
                                    <ChangePasswordForm />
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </main>

            <Footer />
        </div>
    );
}

import { useState, useEffect } from "react";
import { Save, Globe, MessageCircle, Instagram, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetcher } from "@/lib/api-client";

interface SiteSettingsData {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    contactEmail: string;
    instagramUrl: string;
    whatsappNumber: string;
}

export function AdminSettings() {
    const queryClient = useQueryClient();
    const { data: siteInfo, isLoading } = useQuery({
        queryKey: ['settings', 'site_info'],
        queryFn: () => fetcher<SiteSettingsData>('/settings/site_info'),
    });

    const defaultSettings: SiteSettingsData = {
        siteName: "Byher Boutique",
        siteDescription: "Premium Modest Fashion",
        maintenanceMode: false,
        contactEmail: "hello@byher.id",
        instagramUrl: "@byher.official",
        whatsappNumber: "+628123456789"
    };

    const [settings, setSettings] = useState<SiteSettingsData>(defaultSettings);

    useEffect(() => {
        if (siteInfo) {
            // Merge remote data with defaults to ensure no undefined values
            setSettings({ ...defaultSettings, ...siteInfo });
        }
    }, [siteInfo]);

    const saveMutation = useMutation({
        mutationFn: (val: SiteSettingsData) => fetcher('/settings/site_info', { method: 'POST', body: JSON.stringify({ value: val }) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', 'site_info'] });
            toast.success("Site settings updated");
        }
    });

    if (isLoading) return <div className="p-12 text-center animate-pulse">Loading site configuration...</div>;

    return (
        <div className="max-w-4xl space-y-10 animate-fade-in pb-12">
            <div>
                <h2 className="text-2xl font-bold font-serif">Site Configuration</h2>
                <p className="text-sm text-muted-foreground">Manage your brand's global presence and technical settings.</p>
            </div>

            <div className="grid gap-8">
                <Card className="border-none shadow-md">
                    <CardHeader className="border-b bg-muted/10">
                        <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider text-muted-foreground"><Globe className="mr-2 h-4 w-4" /> Brand Identity</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase">Store Name</Label>
                                <Input value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase">Support Email</Label>
                                <Input value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase">Brand Slogan/Description</Label>
                            <Textarea value={settings.siteDescription} onChange={e => setSettings({ ...settings, siteDescription: e.target.value })} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardHeader className="border-b bg-muted/10">
                        <CardTitle className="text-sm font-bold flex items-center uppercase tracking-wider text-muted-foreground"><MessageCircle className="mr-2 h-4 w-4" /> Social & Support</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="flex items-center text-xs font-bold uppercase"><Instagram className="mr-2 h-3 w-3" /> Instagram Handle</Label>
                                <Input value={settings.instagramUrl} onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label className="flex items-center text-xs font-bold uppercase"><MessageCircle className="mr-2 h-3 w-3" /> WhatsApp Number</Label>
                                <Input value={settings.whatsappNumber} onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md border-orange-100 bg-orange-50/30">
                    <CardContent className="pt-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 rounded-full text-orange-600 shadow-sm"><Settings className="h-6 w-6" /></div>
                            <div>
                                <p className="font-bold text-sm text-orange-900 uppercase tracking-wider">Maintenance Mode</p>
                                <p className="text-xs text-orange-700 mt-1">When enabled, customers will see a 'Coming Soon' page.</p>
                            </div>
                        </div>
                        <Switch checked={settings.maintenanceMode} onCheckedChange={v => setSettings({ ...settings, maintenanceMode: v })} />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button size="lg" className="px-12 shadow-lg" onClick={() => saveMutation.mutate(settings)}>
                    <Save className="mr-2 h-4 w-4" /> Save Configuration
                </Button>
            </div>
        </div>
    );
}

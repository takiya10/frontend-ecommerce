import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Save, ImageIcon, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetcher } from "@/lib/api-client";

// Default images for seeding/initial view
import heroImage from "@/assets/hero-image.jpg";
import lozyHero1 from "@/assets/lozy-hero-1.jpg";

interface Banner {
    id: number;
    url: string;
    title: string;
    subtitle: string;
    highlight: string;
}

const DEFAULT_BANNERS: Banner[] = [
    {
        id: 1,
        url: heroImage,
        title: "Januari",
        subtitle: "KICK-OFF",
        highlight: "Sale",
    },
    {
        id: 2,
        url: lozyHero1,
        title: "New Season",
        subtitle: "ESSENTIAL",
        highlight: "2026",
    },
];

export function AdminCMS() {
    const queryClient = useQueryClient();
    const { data: remoteBanners, isLoading } = useQuery({
        queryKey: ['settings', 'hero_banners'],
        queryFn: () => fetcher<Banner[]>('/settings/hero_banners'),
    });

    const [banners, setBanners] = useState<Banner[]>([]);
    const [uploadingId, setUploadingId] = useState<number | null>(null);
    const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

    useEffect(() => {
        if (remoteBanners && Array.isArray(remoteBanners) && remoteBanners.length > 0) {
            setBanners(remoteBanners);
        } else if (!isLoading) {
            // If remote is empty, preload with defaults so user can edit them
            setBanners(DEFAULT_BANNERS);
        }
    }, [remoteBanners, isLoading]);

    const saveMutation = useMutation({
        mutationFn: (newBanners: Banner[]) =>
            fetcher('/settings/hero_banners', { method: 'POST', body: JSON.stringify({ value: newBanners }) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', 'hero_banners'] });
            toast.success("Hero section details updated globally!");
        },
    });

    // Handle file upload
    const handleFileUpload = async (file: File, bannerId: number) => {
        const formData = new FormData();
        formData.append('file', file);

        setUploadingId(bannerId);
        try {
            // NOTE: The previous fetcher update allows FormData to pass through without Content-Type: application/json
            const response = await fetcher<{ url: string }>('/upload', {
                method: 'POST',
                body: formData,
            });

            // Update the specific banner's URL with the one returned from the server
            const newBanners = banners.map(b => b.id === bannerId ? { ...b, url: response.url } : b);
            setBanners(newBanners);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload image. Make sure Backend is running.");
        } finally {
            setUploadingId(null);
        }
    };

    const addBanner = () => {
        if (banners.length < 5) {
            setBanners([...banners, { id: Date.now(), url: "", title: "", subtitle: "", highlight: "" }]);
        } else {
            toast.error("Maximum 5 banners allowed");
        }
    };

    if (isLoading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading CMS resources...</div>;

    return (
        <div className="space-y-8 animate-fade-in pb-24 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold font-serif">Storefront CMS</h3>
                    <p className="text-sm text-muted-foreground">Customize the high-impact visual banners on your homepage.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => saveMutation.mutate(banners)} disabled={saveMutation.isPending} className="shadow-sm">
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                    <Button onClick={addBanner} disabled={banners.length >= 5} variant="secondary" className="shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Slide
                    </Button>
                </div>
            </div>

            <div className="grid gap-8">
                {banners.map((banner, index) => (
                    <Card key={banner.id} className="border-none shadow-md overflow-hidden group">
                        <div className="h-1 bg-gradient-to-r from-primary/50 to-primary/10 w-full" />
                        <CardHeader className="bg-muted/10 pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Banner Slide #{index + 1}</CardTitle>
                            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setBanners(banners.filter(b => b.id !== banner.id))}>
                                <Trash2 className="h-4 w-4 mr-2" /> Remove Slide
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-8 grid lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="grid gap-2">
                                    <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Banner Image</Label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <Input
                                                placeholder="https://..."
                                                value={banner.url}
                                                className="font-mono text-xs bg-muted/20 pr-10"
                                                onChange={e => {
                                                    const nb = [...banners];
                                                    nb[index] = { ...nb[index], url: e.target.value };
                                                    setBanners(nb);
                                                }}
                                            />
                                            {/* Hidden File Input */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={el => { fileInputRefs.current[banner.id] = el }}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(file, banner.id);
                                                }}
                                            />
                                            {/* Upload Trigger Button */}
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="absolute right-1 top-1 h-7 px-2 text-xs"
                                                onClick={() => fileInputRefs.current[banner.id]?.click()}
                                                disabled={uploadingId === banner.id}
                                                title="Upload Image"
                                            >
                                                {uploadingId === banner.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                                            </Button>
                                        </div>
                                        {banner.url && <div className="h-10 w-10 rounded overflow-hidden border shrink-0"><img src={banner.url} className="h-full w-full object-cover" /></div>}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Enter URL manually or click the upload icon to browse local files.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Main Title</Label>
                                        <Input placeholder="e.g. New Year" value={banner.title} className="font-serif font-bold text-lg" onChange={e => {
                                            const nb = [...banners];
                                            nb[index] = { ...nb[index], title: e.target.value };
                                            setBanners(nb);
                                        }} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Subtitle</Label>
                                        <Input placeholder="e.g. 2026 Collection" value={banner.subtitle} onChange={e => {
                                            const nb = [...banners];
                                            nb[index] = { ...nb[index], subtitle: e.target.value };
                                            setBanners(nb);
                                        }} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Highlight Text (Color Accent)</Label>
                                    <Input placeholder="e.g. SALE" value={banner.highlight} className="text-primary font-bold" onChange={e => {
                                        const nb = [...banners];
                                        nb[index] = { ...nb[index], highlight: e.target.value };
                                        setBanners(nb);
                                    }} />
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="relative rounded-lg overflow-hidden aspect-video bg-muted flex items-center justify-center text-muted-foreground border">
                                {banner.url ? (
                                    <>
                                        <img src={banner.url} className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="relative text-center text-white p-4">
                                            <p className="text-xs uppercase tracking-widest opacity-90">{banner.title}</p>
                                            <p className="text-xl font-serif font-bold">{banner.subtitle} <span className="text-white font-serif italic">{banner.highlight}</span></p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                                        <span className="text-xs uppercase tracking-widest font-semibold">Image Preview</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

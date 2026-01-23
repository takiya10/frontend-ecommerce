import { useState } from "react";
import { Plus, Edit, Trash2, X, Save, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetcher } from "@/lib/api-client";
import { formatPrice, cn } from "@/lib/utils";
import { Product, Category } from "@/types";

interface AdminProductsProps {
    products?: Product[];
    categories?: Category[];
}

export function AdminProducts({ products, categories }: AdminProductsProps) {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const initialFormState = {
        name: "",
        slug: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: "",
        images: [{ url: "", color: "" }],
        variants: [{ size: "All Size", color: "Original", hex: "#8B7355", stock: 0 }]
    };

    const [formData, setFormData] = useState(initialFormState);

    // Helper: Get unique colors defined in variants for image mapping
    const definedColors = Array.from(new Set(
        formData.variants
            .filter((v: { color: string }) => v.color && v.color.trim() !== "")
            .map((v: { color: string, hex: string }) => JSON.stringify({ name: v.color, hex: v.hex }))
    )).map((s: string) => JSON.parse(s) as { name: string, hex: string });

    const mutation = useMutation({
        mutationFn: (data: typeof initialFormState) => {
            // Transform unified variants back to backend schema
            const transformedVariants: { name: string, value: string, hex: string, stock: number }[] = [];

            const uniqueColors = new Map<string, string>();
            const uniqueSizes = new Set<string>();
            let totalStock = 0;

            data.variants.forEach((v) => {
                if (v.color) uniqueColors.set(v.color, v.hex);
                if (v.size) uniqueSizes.add(v.size);
                totalStock += Number(v.stock || 0);
            });

            uniqueColors.forEach((hex, name) => {
                transformedVariants.push({ name: 'Color', value: name, hex, stock: 0 });
            });
            uniqueSizes.forEach(size => {
                transformedVariants.push({ name: 'Size', value: size, hex: "", stock: 0 });
            });

            const payload = {
                ...data,
                stock: totalStock,
                images: data.images.filter((img) => img.url.trim() !== ""),
                variants: transformedVariants,
            };

            return editingProduct
                ? fetcher(`/products/${editingProduct.id}`, { method: 'PATCH', body: JSON.stringify(payload) })
                : fetcher('/products', { method: 'POST', body: JSON.stringify(payload) });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            setIsDialogOpen(false);
            setEditingProduct(null);
            setFormData(initialFormState);
            toast.success(editingProduct ? "Product updated" : "Product created");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to save product");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => fetcher(`/products/${id}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            toast.success("Product deleted");
        }
    });

    const handleEdit = (p: Product) => {
        setEditingProduct(p);

        // Reverse transform backend data to unified UI structure
        const colors = p.variants?.filter(v => v.name === 'Color') || [];
        const sizes = p.variants?.filter(v => v.name === 'Size') || [];

        const unifiedVariants = colors.length > 0 ? colors.map((c, i) => ({
            color: c.value,
            hex: c.hex || "",
            size: sizes[i]?.value || (sizes[0]?.value || "All Size"),
            stock: Math.floor(p.stock / (colors.length || 1))
        })) : [{ size: "All Size", color: "Original", hex: "#8B7355", stock: p.stock }];

        setFormData({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price,
            stock: p.stock,
            categoryId: p.categoryId,
            images: p.images?.length ? p.images.map(img => ({ url: img.url, color: img.color || "" })) : [{ url: "", color: "" }],
            variants: unifiedVariants
        });
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-serif">Product Inventory</h2>
                    <p className="text-sm text-muted-foreground">Manage your boutique collection and stock levels.</p>
                </div>
                <Button onClick={() => { setEditingProduct(null); setFormData(initialFormState); setIsDialogOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> New Product
                </Button>
            </div>

            <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/20">
                            <TableRow>
                                <TableHead className="w-[80px] text-[10px] uppercase font-bold">Image</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold">Product Name</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold">Category</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold">Price</TableHead>
                                <TableHead className="text-[10px] uppercase font-bold">Stock</TableHead>
                                <TableHead className="text-right text-[10px] uppercase font-bold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.map((p) => (
                                <TableRow key={p.id} className="hover:bg-muted/10 transition-colors">
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-md bg-muted overflow-hidden border">
                                            {p.images?.[0] ? <img src={p.images[0].url} className="h-full w-full object-cover" /> : <ImageIcon className="h-full w-full p-2 text-muted-foreground" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-sm">{p.name}</TableCell>
                                    <TableCell><Badge variant="outline" className="font-normal capitalize text-xs bg-muted/30">{p.category?.name}</Badge></TableCell>
                                    <TableCell className="font-bold text-sm tracking-tight">{formatPrice(p.price)}</TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                            p.stock < 5 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                                        )}>
                                            {p.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => handleEdit(p)}><Edit className="h-3.5 w-3.5" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteMutation.mutate(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* PRO PRODUCT MODAL */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">{editingProduct ? "Edit Product" : "Create New Product"}</DialogTitle>
                        <DialogDescription>Setup your product options and images here.</DialogDescription>
                    </DialogHeader>

                    <div className="grid lg:grid-cols-12 gap-8 py-4">
                        {/* Left: Info & Variants */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Product Name</Label>
                                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} placeholder="e.g. Pashmina Silk Premium" className="font-medium" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Price (IDR)</Label>
                                        <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Category</Label>
                                        <Select value={formData.categoryId} onValueChange={v => setFormData({ ...formData, categoryId: v })}>
                                            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                            <SelectContent>
                                                {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Variants (Size & Color)</Label>
                                    <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => setFormData({ ...formData, variants: [...formData.variants, { size: "", color: "", hex: "", stock: 0 }] })}>
                                        <Plus className="mr-1 h-3 w-3" /> Add Row
                                    </Button>
                                </div>
                                <div className="border rounded-lg overflow-hidden shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="h-8 hover:bg-muted/30">
                                                <TableHead className="text-[10px] uppercase font-bold">Size</TableHead>
                                                <TableHead className="text-[10px] uppercase font-bold">Color Name</TableHead>
                                                <TableHead className="text-[10px] uppercase font-bold">Hex</TableHead>
                                                <TableHead className="text-[10px] uppercase font-bold w-20">Stock</TableHead>
                                                <TableHead className="w-8"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {formData.variants.map((v: { size: string, color: string, hex: string, stock: number }, i: number) => (
                                                <TableRow key={i} className="group hover:bg-muted/5">
                                                    <TableCell className="p-2"><Input className="h-7 text-xs border-transparent bg-transparent focus-visible:bg-white focus-visible:shadow-sm transition-all" placeholder="XL" value={v.size} onChange={e => {
                                                        const nv = [...formData.variants]; nv[i] = { ...nv[i], size: e.target.value }; setFormData({ ...formData, variants: nv });
                                                    }} /></TableCell>
                                                    <TableCell className="p-2"><Input className="h-7 text-xs border-transparent bg-transparent focus-visible:bg-white focus-visible:shadow-sm transition-all" placeholder="Red" value={v.color} onChange={e => {
                                                        const nv = [...formData.variants]; nv[i] = { ...nv[i], color: e.target.value }; setFormData({ ...formData, variants: nv });
                                                    }} /></TableCell>
                                                    <TableCell className="p-2">
                                                        <div className="flex items-center gap-2">
                                                            <Input className="h-7 text-[10px] border-transparent bg-transparent focus-visible:bg-white focus-visible:shadow-sm font-mono w-16 transition-all" placeholder="#FF0000" value={v.hex} onChange={e => {
                                                                const nv = [...formData.variants]; nv[i] = { ...nv[i], hex: e.target.value }; setFormData({ ...formData, variants: nv });
                                                            }} />
                                                            {v.hex && <div className="w-3 h-3 rounded-full border shadow-sm ring-1 ring-offset-1 ring-border/50" style={{ backgroundColor: v.hex }} />}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="p-2"><Input type="number" className="h-7 text-xs border-transparent bg-transparent focus-visible:bg-white focus-visible:shadow-sm transition-all" value={v.stock} onChange={e => {
                                                        const nv = [...formData.variants]; nv[i] = { ...nv[i], stock: Number(e.target.value) }; setFormData({ ...formData, variants: nv });
                                                    }} /></TableCell>
                                                    <TableCell className="p-2 text-right">
                                                        <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10" onClick={() => setFormData({ ...formData, variants: formData.variants.filter((_, idx: number) => idx !== i) })}>
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        {/* Right: Images */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs uppercase font-bold tracking-wider text-primary">Media Gallery</Label>
                                    <Button size="sm" variant="ghost" className="h-7 text-[10px]" onClick={() => setFormData({ ...formData, images: [...formData.images, { url: "", color: "" }] })}>
                                        <Plus className="mr-1 h-3 w-3" /> Add Image
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {formData.images.map((img: { url: string, color: string }, i: number) => (
                                        <Card key={i} className="border shadow-sm overflow-hidden bg-muted/5 group hover:shadow-md transition-all">
                                            <div className="p-3 space-y-3">
                                                <div className="flex gap-2">
                                                    <Input className="text-xs h-8" placeholder="Paste image URL here..." value={img.url} onChange={e => {
                                                        const ni = [...formData.images]; ni[i] = { ...ni[i], url: e.target.value }; setFormData({ ...formData, images: ni });
                                                    }} />
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10" onClick={() => setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) })}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap">Mapped to:</span>
                                                    <Select value={img.color} onValueChange={v => {
                                                        const ni = [...formData.images]; ni[i] = { ...ni[i], color: v }; setFormData({ ...formData, images: ni });
                                                    }}>
                                                        <SelectTrigger className="h-7 text-[10px] bg-white border-border/50"><SelectValue placeholder="Select variant color" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">General (No Color)</SelectItem>
                                                            {definedColors.map((c: { name: string, hex: string }) => (
                                                                <SelectItem key={c.name} value={c.name}>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-2 h-2 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                                                                        {c.name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {img.url && (
                                                    <div className="aspect-[4/3] rounded bg-muted overflow-hidden border">
                                                        <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t pt-6">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button className="px-8 shadow-lg shadow-primary/20" disabled={mutation.isPending} onClick={() => mutation.mutate(formData)}>
                            {mutation.isPending ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

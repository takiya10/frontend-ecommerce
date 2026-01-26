import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, cn } from "@/lib/utils";
import { ShoppingBag, Check } from "lucide-react";
import productPlaceholder from "@/assets/product-1.jpg";

interface ProductQuickViewProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!product) return null;

    const currentImage = product.images?.[0]?.url || product.image || productPlaceholder;
    const hasSizes = product.sizes && product.sizes.length > 0;
    const hasColors = product.colors && product.colors.length > 0;

    const handleAddToCart = async () => {
        if (hasSizes && !selectedSize) return;
        if (hasColors && !selectedColor) return;

        setLoading(true);
        await addItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: currentImage,
            size: selectedSize || "All Size",
            color: selectedColor || "Standard",
            quantity: 1
        });
        setLoading(false);
        onClose();
    };

    const isReady = (!hasSizes || selectedSize) && (!hasColors || selectedColor);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden gap-0">
                <div className="grid md:grid-cols-2">
                    {/* Image Section */}
                    <div className="bg-muted aspect-square md:aspect-auto relative">
                        <img
                            src={currentImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="p-6 flex flex-col h-full">
                        <div className="mb-4">
                            <Badge variant="outline" className="mb-2">{product.category?.name || "Kategori"}</Badge>
                            <DialogTitle className="text-xl font-serif mb-1">{product.name}</DialogTitle>
                            <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
                        </div>

                        <div className="space-y-6 flex-1">
                            {/* Size Selector */}
                            {hasSizes && (
                                <div>
                                    <span className="text-sm font-medium mb-2 block">Pilih Ukuran</span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={cn(
                                                    "h-9 min-w-[36px] px-3 rounded-md border text-sm transition-all",
                                                    selectedSize === size
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-input hover:border-foreground/50"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Selector */}
                            {hasColors && (
                                <div>
                                    <span className="text-sm font-medium mb-2 block">Pilih Warna</span>
                                    <div className="flex gap-2">
                                        {product.colors.map((color, i) => {
                                            const colorValue = typeof color === 'string' ? color : color.hex;
                                            const colorName = typeof color === 'string' ? color : color.name;
                                            const isSelected = selectedColor === colorName;

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedColor(colorName)}
                                                    className={cn(
                                                        "w-8 h-8 rounded-full border shadow-sm relative flex items-center justify-center transition-transform",
                                                        isSelected && "ring-2 ring-primary ring-offset-2 scale-110"
                                                    )}
                                                    style={{ backgroundColor: colorValue }}
                                                    title={colorName}
                                                >
                                                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-4 border-t">
                            <Button
                                onClick={handleAddToCart}
                                className="w-full"
                                size="lg"
                                disabled={!isReady || loading}
                            >
                                {loading ? "Menambahkan..." : "Tambah ke Keranjang"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

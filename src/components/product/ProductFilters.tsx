import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

interface FilterState {
    minPrice: number;
    maxPrice: number;
    sizes: string[];
    colors: string[];
    materials: string[];
}

interface ProductFiltersProps {
    initialFilters?: Partial<FilterState>;
    onFilterChange: (filters: FilterState) => void;
    className?: string;
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "All Size"];
const AVAILABLE_COLORS = [
    { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#000000" },
    { name: "Beige", hex: "#F5F5DC" },
    { name: "Taupe", hex: "#483C32" },
    { name: "Dusty Pink", hex: "#D8A1A1" },
    { name: "Sage", hex: "#9CAF88" },
    { name: "Navy", hex: "#000080" },
    { name: "Brown", hex: "#8B4513" }
];
const AVAILABLE_MATERIALS = ["Silk", "Ceruty", "Cotton", "Voal", "Satin", "Linen"];

export function ProductFilters({ initialFilters, onFilterChange, className }: ProductFiltersProps) {
    const [tempFilters, setTempFilters] = useState<FilterState>({
        minPrice: initialFilters?.minPrice ?? 0,
        maxPrice: initialFilters?.maxPrice ?? 2000000,
        sizes: initialFilters?.sizes ?? [],
        colors: initialFilters?.colors ?? [],
        materials: initialFilters?.materials ?? [],
    });

    const [priceRange, setPriceRange] = useState<[number, number]>([
        tempFilters.minPrice,
        tempFilters.maxPrice
    ]);

    const handlePriceChange = (value: number[]) => {
        setPriceRange([value[0], value[1]]);
        setTempFilters(prev => ({ ...prev, minPrice: value[0], maxPrice: value[1] }));
    };

    const toggleArrayFilter = (key: keyof Pick<FilterState, 'sizes' | 'colors' | 'materials'>, value: string) => {
        setTempFilters(prev => {
            const current = prev[key] as string[];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [key]: updated };
        });
    };

    const handleApply = () => {
        onFilterChange(tempFilters);
    };

    const handleReset = () => {
        const resetValues = {
            minPrice: 0,
            maxPrice: 2000000,
            sizes: [],
            colors: [],
            materials: [],
        };
        setTempFilters(resetValues);
        setPriceRange([0, 2000000]);
        onFilterChange(resetValues);
    };

    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="font-serif text-xl font-medium">Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs h-8 text-muted-foreground hover:text-primary"
                >
                    Reset All
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={["price", "size", "color", "material"]}>
                {/* Price Range */}
                <AccordionItem value="price" className="border-none">
                    <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        Price Range
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 px-1">
                        <div className="space-y-4">
                            <Slider
                                value={priceRange}
                                min={0}
                                max={2000000}
                                step={50000}
                                onValueChange={handlePriceChange}
                                className="my-6"
                            />
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 space-y-1">
                                    <Label className="text-[10px] uppercase text-muted-foreground">Min</Label>
                                    <div className="px-3 py-2 border rounded-md text-sm font-medium">
                                        {formatPrice(priceRange[0])}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label className="text-[10px] uppercase text-muted-foreground">Max</Label>
                                    <div className="px-3 py-2 border rounded-md text-sm font-medium">
                                        {formatPrice(priceRange[1])}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Sizes */}
                <AccordionItem value="size" className="border-none">
                    <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        Sizes
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <div className="grid grid-cols-2 gap-2">
                            {AVAILABLE_SIZES.map(size => (
                                <div key={size} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`size-${size}`}
                                        checked={tempFilters.sizes.includes(size)}
                                        onCheckedChange={() => toggleArrayFilter('sizes', size)}
                                    />
                                    <Label
                                        htmlFor={`size-${size}`}
                                        className="text-sm font-normal cursor-pointer hover:text-primary transition-colors"
                                    >
                                        {size}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Colors */}
                <AccordionItem value="color" className="border-none">
                    <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        Colors
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <div className="grid grid-cols-2 gap-3">
                            {AVAILABLE_COLORS.map(color => (
                                <div key={color.name} className="flex items-center space-x-2 group">
                                    <div
                                        className={cn(
                                            "w-4 h-4 rounded-full border border-border shadow-sm transition-transform group-hover:scale-110",
                                            tempFilters.colors.includes(color.name) && "ring-1 ring-primary ring-offset-1"
                                        )}
                                        style={{ backgroundColor: color.hex }}
                                        onClick={() => toggleArrayFilter('colors', color.name)}
                                    />
                                    <Checkbox
                                        id={`color-${color.name}`}
                                        className="sr-only"
                                        checked={tempFilters.colors.includes(color.name)}
                                        onCheckedChange={() => toggleArrayFilter('colors', color.name)}
                                    />
                                    <Label
                                        htmlFor={`color-${color.name}`}
                                        className={cn(
                                            "text-sm font-normal cursor-pointer transition-colors",
                                            tempFilters.colors.includes(color.name) ? "text-primary font-medium" : "text-muted-foreground"
                                        )}
                                        onClick={() => toggleArrayFilter('colors', color.name)}
                                    >
                                        {color.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Materials */}
                <AccordionItem value="material" className="border-none">
                    <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                        Materials
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <div className="space-y-2">
                            {AVAILABLE_MATERIALS.map(material => (
                                <div key={material} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`material-${material}`}
                                        checked={tempFilters.materials.includes(material)}
                                        onCheckedChange={() => toggleArrayFilter('materials', material)}
                                    />
                                    <Label
                                        htmlFor={`material-${material}`}
                                        className="text-sm font-normal cursor-pointer hover:text-primary transition-colors"
                                    >
                                        {material}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Button
                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium py-6"
                onClick={handleApply}
            >
                Apply Filters
            </Button>
        </div>
    );
}

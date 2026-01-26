import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-client";
import { Product } from "@/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlidersHorizontal, Search, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [filters, setFilters] = useState({
        minPrice: Number(searchParams.get("minPrice")) || 0,
        maxPrice: Number(searchParams.get("maxPrice")) || 2000000,
        sizes: searchParams.get("sizes")?.split(",").filter(Boolean) || [],
        colors: searchParams.get("colors")?.split(",").filter(Boolean) || [],
        materials: searchParams.get("materials")?.split(",").filter(Boolean) || [],
    });

    const { data: products, isLoading } = useQuery({
        queryKey: ['search-results', query, filters],
        queryFn: () => {
            const params = new URLSearchParams();
            params.append("search", query);
            if (filters.minPrice > 0) params.append("minPrice", filters.minPrice.toString());
            if (filters.maxPrice < 2000000) params.append("maxPrice", filters.maxPrice.toString());
            if (filters.sizes.length > 0) params.append("sizes", filters.sizes.join(","));
            if (filters.colors.length > 0) params.append("colors", filters.colors.join(","));
            if (filters.materials.length > 0) params.append("materials", filters.materials.join(","));

            return fetcher<Product[]>(`/products?${params.toString()}`);
        },
        enabled: true,
    });

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);

        // Update URL params
        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.set("minPrice", newFilters.minPrice.toString());
        updatedParams.set("maxPrice", newFilters.maxPrice.toString());

        if (newFilters.sizes.length > 0) updatedParams.set("sizes", newFilters.sizes.join(","));
        else updatedParams.delete("sizes");

        if (newFilters.colors.length > 0) updatedParams.set("colors", newFilters.colors.join(","));
        else updatedParams.delete("colors");

        if (newFilters.materials.length > 0) updatedParams.set("materials", newFilters.materials.join(","));
        else updatedParams.delete("materials");

        setSearchParams(updatedParams);
    };

    const clearQuery = () => {
        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.delete("q");
        setSearchParams(updatedParams);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container mx-auto py-8 px-4">
                {/* Search Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-serif font-medium text-foreground">
                            {query ? `Search Results for "${query}"` : "All Products"}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {isLoading ? "Searching..." : `${products?.length || 0} items found`}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Mobile Filter Trigger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="lg:hidden gap-2 h-11 px-6 border-primary/20 hover:bg-primary/5">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filter
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <SheetHeader className="mb-4">
                                    <SheetTitle className="text-left font-serif text-2xl">Refine Search</SheetTitle>
                                </SheetHeader>
                                <ProductFilters
                                    initialFilters={filters}
                                    onFilterChange={handleFilterChange}
                                    className="mt-4"
                                />
                            </SheetContent>
                        </Sheet>

                        {query && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearQuery}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                title="Clear Search"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden lg:block w-72 shrink-0 space-y-8 sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto pr-4 scrollbar-thin">
                        <ProductFilters
                            initialFilters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="space-y-4">
                                        <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-1/3" />
                                    </div>
                                ))}
                            </div>
                        ) : products && products.length > 0 ? (
                            <motion.div
                                initial="hidden"
                                animate="show"
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1 }
                                    }
                                }}
                                className="grid grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {products.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            show: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/20 rounded-3xl border border-dashed border-primary/20">
                                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Search className="h-10 w-10 text-primary/40" />
                                </div>
                                <div className="space-y-2 max-w-xs">
                                    <h3 className="text-xl font-serif">No products found</h3>
                                    <p className="text-muted-foreground text-sm">
                                        We couldn't find any items matching your current filters or search query.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => handleFilterChange({
                                        minPrice: 0,
                                        maxPrice: 2000000,
                                        sizes: [],
                                        colors: [],
                                        materials: [],
                                    })}
                                    variant="outline"
                                    className="mt-4"
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

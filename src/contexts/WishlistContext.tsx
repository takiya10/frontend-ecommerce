import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetcher } from "@/lib/api-client";

import product1 from "@/assets/product-1.jpg";

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { isAuthenticated } = useAuth();

  // Load from local storage on mount (Guest only)
  useEffect(() => {
    if (!isAuthenticated) {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch (e) {
          console.error("Failed to parse wishlist", e);
        }
      }
    }
  }, [isAuthenticated]);

  // Sync with Backend when Authenticated
  useEffect(() => {
    const syncLocalWishlist = async () => {
        if (isAuthenticated) {
            const savedWishlist = localStorage.getItem("wishlist");
            if (savedWishlist) {
                try {
                    const localItems: WishlistItem[] = JSON.parse(savedWishlist);
                    if (localItems.length > 0) {
                        // Push local items to backend
                        await Promise.all(localItems.map(item => 
                            fetcher('/wishlist', {
                                method: 'POST',
                                body: JSON.stringify({ productId: item.id })
                            }).catch(() => {}) // Ignore conflicts
                        ));
                        
                        localStorage.removeItem("wishlist");
                        toast.success("Wishlist disinkronisasi");
                    }
                } catch (e) {
                    console.error("Failed to sync wishlist", e);
                }
            }
            fetchWishlist();
        }
    };

    syncLocalWishlist();
  }, [isAuthenticated]);

  // Save to local storage whenever items change (Guest only)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated]);

  const fetchWishlist = async () => {
      try {
          const items = await fetcher<any[]>('/wishlist');
          const mappedItems: WishlistItem[] = items.map((item: any) => ({
              id: item.productId,
              name: item.product.name,
              slug: item.product.slug,
              price: item.product.price,
              image: item.product.images?.[0]?.url || product1,
              inStock: item.product.stock > 0
          }));
          setWishlistItems(mappedItems);
      } catch (error) {
          console.error("Failed to fetch wishlist", error);
      }
  };

  const addToWishlist = async (item: WishlistItem) => {
    if (isAuthenticated) {
        try {
            await fetcher('/wishlist', {
                method: 'POST',
                body: JSON.stringify({ productId: item.id })
            });
            await fetchWishlist();
            toast.success("Produk ditambahkan ke wishlist");
        } catch (error) {
            toast.info("Produk sudah ada di wishlist");
        }
        return;
    }

    setWishlistItems((currentItems) => {
      if (currentItems.some((i) => i.id === item.id)) {
        toast.info("Produk sudah ada di wishlist");
        return currentItems;
      }
      toast.success("Produk ditambahkan ke wishlist");
      return [...currentItems, item];
    });
  };

  const removeFromWishlist = async (id: string) => {
    if (isAuthenticated) {
        try {
            await fetcher(`/wishlist/${id}`, { method: 'DELETE' });
            await fetchWishlist();
            toast.success("Produk dihapus dari wishlist");
        } catch (error) {
            toast.error("Gagal menghapus produk");
        }
        return;
    }

    setWishlistItems((currentItems) => currentItems.filter((item) => item.id !== id));
    toast.success("Produk dihapus dari wishlist");
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

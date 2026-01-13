import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetcher } from "@/lib/api-client";

import product1 from "@/assets/product-1.jpg";

export interface CartItem {
  id: string; // Product ID (for local) or CartItem ID (for backend) - unified handling needed
  productId: string; // Explicit Product ID
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "id"> & { id?: string }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth();

  // Load local cart on mount
  useEffect(() => {
    if (!isAuthenticated) {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }
  }, [isAuthenticated]);

  // Sync with Backend when Authenticated (Merge Local Cart)
  useEffect(() => {
      const syncLocalCart = async () => {
          if (isAuthenticated) {
              const savedCart = localStorage.getItem("cart");
              if (savedCart) {
                  try {
                      const localItems: CartItem[] = JSON.parse(savedCart);
                      if (localItems.length > 0) {
                          // Push local items to backend
                          // We use Promise.all to do it in parallel
                          await Promise.all(localItems.map(item => 
                              fetcher('/cart/items', {
                                  method: 'POST',
                                  body: JSON.stringify({
                                      productId: item.productId || item.id, // Handle fallback ID
                                      quantity: item.quantity,
                                      size: item.size,
                                      color: item.color
                                  })
                              })
                          ));
                          
                          // Clear local storage after successful merge
                          localStorage.removeItem("cart");
                          toast.success("Keranjang belanja disinkronisasi");
                      }
                  } catch (e) {
                      console.error("Failed to sync cart", e);
                  }
              }
              // Always fetch the final state from backend
              fetchCart();
          }
      };

      syncLocalCart();
  }, [isAuthenticated]);

  // Save to local storage whenever items change (ONLY if not authenticated)
  useEffect(() => {
    if (!isAuthenticated) {
        localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const fetchCart = async () => {
      try {
          const cart = await fetcher<any>('/cart');
          const mappedItems: CartItem[] = cart.items.map((item: any) => ({
              id: item.id, // CartItem ID
              productId: item.productId,
              name: item.product.name,
              slug: item.product.slug,
              price: item.product.price,
              image: item.product.images?.[0]?.url || product1, // Fallback
              size: item.size || '',
              color: item.color || '',
              quantity: item.quantity
          }));
          setItems(mappedItems);
      } catch (error) {
          console.error("Failed to fetch cart", error);
      }
  };

  const addItem = async (newItem: Omit<CartItem, "quantity" | "id"> & { id?: string }) => {
    // If Authenticated -> API
    if (isAuthenticated) {
        try {
            await fetcher('/cart/items', {
                method: 'POST',
                body: JSON.stringify({
                    productId: newItem.productId || newItem.id, // Handle both props for compatibility
                    quantity: 1,
                    size: newItem.size,
                    color: newItem.color
                })
            });
            await fetchCart();
            toast.success("Produk ditambahkan ke keranjang");
        } catch (error) {
            console.error(error);
            toast.error("Gagal menambahkan ke keranjang");
        }
        return;
    }

    // Local Logic
    setItems((currentItems) => {
      const productId = newItem.productId || newItem.id; // Compatibility
      const existingItem = currentItems.find(
        (item) => item.productId === productId && item.size === newItem.size && item.color === newItem.color
      );

      if (existingItem) {
        toast.success("Jumlah produk diperbarui di keranjang");
        return currentItems.map((item) =>
          item.productId === productId && item.size === newItem.size && item.color === newItem.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      toast.success("Produk ditambahkan ke keranjang");
      return [...currentItems, { 
          ...newItem, 
          id: `local-${Date.now()}`, // Temporary ID for local items
          productId: productId!, // Ensure productId is set
          quantity: 1 
      }];
    });
  };

  const removeItem = async (id: string) => {
    if (isAuthenticated) {
         try {
            await fetcher(`/cart/items/${id}`, { method: 'DELETE' });
            await fetchCart();
            toast.success("Produk dihapus dari keranjang");
        } catch (error) {
            toast.error("Gagal menghapus produk");
        }
        return;
    }

    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    toast.success("Produk dihapus dari keranjang");
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    if (isAuthenticated) {
         try {
            await fetcher(`/cart/items/${id}`, { 
                method: 'PATCH',
                body: JSON.stringify({ quantity })
            });
            await fetchCart();
        } catch (error) {
            toast.error("Gagal update jumlah");
        }
        return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = async () => {
    if (isAuthenticated) {
         try {
            await fetcher('/cart', { method: 'DELETE' });
            setItems([]);
        } catch (error) {
            console.error(error);
        }
        return;
    }
    setItems([]);
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, cartCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

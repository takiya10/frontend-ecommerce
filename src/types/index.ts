export interface User {
  id: string;
  email: string;
  name: string | null;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  color?: string | null;
  productId: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  hex?: string | null;
  stock: number;
  productId: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
  material?: string;
  createdAt?: string;
  updatedAt?: string;

  // Frontend UI specific (compatible with older code)
  image?: string;
  inStock?: boolean;
  badge?: "sale" | "new" | "soldout" | "bestseller";
  colors?: ProductColor[];
  sizes?: string[];
  originalPrice?: number;
}

export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User; // Added this property
  totalAmount: number;
  status: string;
  shippingName?: string;
  shippingEmail?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostal?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface VoucherResponse {
  valid: boolean;
  voucherId: string;
  code: string;
  discountAmount: number;
  discountType: string;
  discountValue: number;
}

export interface MidtransResult {
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  status_message: string;
  status_code: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

export interface MidtransSnap {
  pay: (token: string, options?: {
    onSuccess?: (result: MidtransResult) => void;
    onPending?: (result: MidtransResult) => void;
    onError?: (result: MidtransResult) => void;
    onClose?: () => void;
  }) => void;
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

declare global {
  interface Window {
    snap: MidtransSnap;
  }
}
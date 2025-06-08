
export enum UserRole {
  BUYER = "BUYER",
  VENDOR = "VENDOR",
  ADMIN = "ADMIN"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  vendorId: string;
  available: boolean;
  availableFrom?: string;
  availableTo?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  buyerName: string;
  buyerPhone: string;
  deliveryLocation: string;
  paymentMethod: string;
  paymentAmount: number;
  total: number;
  vendorId: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  createdAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  name: string;
  email: string;
  whatsappNumber: string;
  description: string;
  studentId?: string;
  studentCardImage?: string;
  verified: boolean;
  rejectionReason?: string;
}

export interface Category {
  id: string;
  name: string;
}

// Extended types for database responses
export interface DatabaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: string;
  vendor_id: string;
  available: boolean;
  available_from?: string;
  available_to?: string;
  created_at: string;
  updated_at: string;
  categories?: { name: string } | null;
  vendors?: { name: string; store_name?: string } | null;
}

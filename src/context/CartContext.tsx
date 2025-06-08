
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product, CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  removeFromCart: (productId: string) => void; // Alias for removeItem
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  getTotal: () => number; // Alias for total
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        toast({
          title: "Item quantity updated",
          description: `${product.name} quantity increased`,
        });
        
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      toast({
        title: "Item added to cart",
        description: `${product.name} added to your cart`,
      });
      
      return [...prevItems, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.product.id === productId);
      
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.product.name} removed from your cart`,
        });
      }
      
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const getTotal = () => total;
  const removeFromCart = removeItem; // Alias

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

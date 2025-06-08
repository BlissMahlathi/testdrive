
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Protected from "@/components/auth/Protected";
import { UserRole } from "@/types";

import Index from "@/pages/Index";
import Market from "@/pages/Market";
import Cart from "@/pages/Cart";
import OrderConfirmation from "@/pages/OrderConfirmation";
import VendorRegister from "@/pages/VendorRegister";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/market" element={<Market />} />
                <Route path="/cart" element={<Cart />} />
                <Route 
                  path="/confirmation" 
                  element={
                    <Protected>
                      <OrderConfirmation />
                    </Protected>
                  } 
                />
                <Route 
                  path="/vendor/register" 
                  element={
                    <Protected>
                      <VendorRegister />
                    </Protected>
                  } 
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <Protected>
                      <Dashboard />
                    </Protected>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

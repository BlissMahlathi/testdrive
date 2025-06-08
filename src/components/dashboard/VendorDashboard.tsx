
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import ProductForm from "@/components/products/ProductForm";
import ProductList from "@/components/products/ProductList";
import VendorPerformanceChart from "@/components/charts/VendorPerformanceChart";
import CategoryManager from "@/components/categories/CategoryManager";
import OrderManagement from "@/components/orders/OrderManagement";
import ProfileForm from "@/components/ui/profile-form";
import { Plus, User } from "lucide-react";

interface VendorStats {
  total_sales: number;
  total_orders: number;
  rating: number;
  is_promoted: boolean;
}

const VendorDashboard = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [stats, setStats] = useState<VendorStats>({
    total_sales: 0,
    total_orders: 0,
    rating: 0,
    is_promoted: false,
  });
  const [vendorId, setVendorId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    if (!user) return;

    try {
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("id, total_sales, total_orders, rating, is_promoted")
        .eq("user_id", user.id)
        .single();

      if (vendorError) {
        console.error("Error fetching vendor data:", vendorError);
      } else if (vendorData) {
        setStats({
          total_sales: vendorData.total_sales || 0,
          total_orders: vendorData.total_orders || 0,
          rating: vendorData.rating || 0,
          is_promoted: vendorData.is_promoted || false,
        });
        setVendorId(vendorData.id);
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vendor data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats.is_promoted && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="flex items-center justify-center py-4">
            <Badge variant="default" className="bg-yellow-500 text-white">
              ⭐ PROMOTED VENDOR ⭐
            </Badge>
          </CardContent>
        </Card>
      )}

      <VendorPerformanceChart stats={stats} />

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          <OrderManagement />
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          {!showProductForm ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Products</CardTitle>
                <Button onClick={() => setShowProductForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              <ProductForm onSuccess={() => {
                setShowProductForm(false);
                window.location.reload();
              }} />
              <Button
                variant="outline"
                onClick={() => setShowProductForm(false)}
              >
                Cancel
              </Button>
            </div>
          )}
          
          <ProductList />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorDashboard;

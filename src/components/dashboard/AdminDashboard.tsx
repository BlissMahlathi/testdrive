
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminStatsChart from "@/components/charts/AdminStatsChart";
import OrderManagement from "@/components/orders/OrderManagement";
import AdminProductManager from "@/components/products/AdminProductManager";
import { Users, Store, Package, ShoppingCart, UserX } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  store_name: string;
  email: string;
  verified: boolean;
  total_sales: number;
  total_orders: number;
  created_at: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  created_at: string;
  role: string;
}

const AdminDashboard = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesData, setSalesData] = useState<Array<{ month: string; sales: number; orders: number }>>([]);
  const [totalStats, setTotalStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalVendors: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch vendors
      const { data: vendorsData, error: vendorsError } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

      if (vendorsError) throw vendorsError;

      // Fetch customers (profiles with BUYER role)
      const { data: customersData, error: customersError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "BUYER")
        .order("created_at", { ascending: false });

      if (customersError) throw customersError;

      // Fetch monthly sales data
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("total, created_at")
        .eq("status", "completed");

      if (ordersError) throw ordersError;

      // Process monthly data
      const monthlyData = processMonthlyData(ordersData || []);
      
      // Calculate total stats
      const totalSales = (ordersData || []).reduce((sum, order) => sum + (order.total || 0), 0);
      const totalOrders = (ordersData || []).length;

      setVendors(vendorsData || []);
      setCustomers(customersData || []);
      setSalesData(monthlyData);
      setTotalStats({
        totalSales,
        totalOrders,
        totalVendors: (vendorsData || []).filter(v => v.verified).length,
        totalCustomers: (customersData || []).length,
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (orders: any[]) => {
    const monthlyMap = new Map();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyMap.set(monthKey, { month: monthKey, sales: 0, orders: 0 });
    }

    // Process orders
    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      
      if (monthlyMap.has(monthKey)) {
        const existing = monthlyMap.get(monthKey);
        existing.sales += order.total || 0;
        existing.orders += 1;
      }
    });

    return Array.from(monthlyMap.values());
  };

  const approveVendor = async (vendorId: string) => {
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ verified: true })
        .eq("id", vendorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vendor approved successfully",
      });

      fetchDashboardData();
    } catch (error) {
      console.error("Error approving vendor:", error);
      toast({
        title: "Error",
        description: "Failed to approve vendor",
        variant: "destructive",
      });
    }
  };

  const rejectVendor = async (vendorId: string) => {
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ 
          verified: false,
          rejection_reason: "Application rejected by admin"
        })
        .eq("id", vendorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vendor rejected",
      });

      fetchDashboardData();
    } catch (error) {
      console.error("Error rejecting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to reject vendor",
        variant: "destructive",
      });
    }
  };

  const deleteCustomer = async (customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", customerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });

      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
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
      <AdminStatsChart salesData={salesData} totalStats={totalStats} />

      <Tabs defaultValue="vendors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Vendors</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Customers</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Approve or reject vendor applications and manage existing vendors
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-2 sm:space-y-0">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{vendor.store_name || vendor.name}</h3>
                        <Badge variant={vendor.verified ? "default" : "secondary"}>
                          {vendor.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{vendor.email}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Sales: ${vendor.total_sales || 0}</span>
                        <span>Orders: {vendor.total_orders || 0}</span>
                        <span>Joined: {new Date(vendor.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {!vendor.verified && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveVendor(vendor.id)}
                          className="flex-1 sm:flex-none"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectVendor(vendor.id)}
                          className="flex-1 sm:flex-none"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {vendors.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No vendor applications yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                View and manage customer accounts
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div key={customer.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined: {new Date(customer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCustomer(customer.id)}
                      className="mt-2 sm:mt-0"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                ))}
                {customers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No customers registered yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <AdminProductManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

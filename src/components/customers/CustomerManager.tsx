
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, ShoppingCart, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

interface CustomerOrder {
  id: string;
  total: number;
  status: string;
  created_at: string;
  vendor_name?: string;
}

const CustomerManager = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          email,
          phone,
          created_at
        `)
        .eq("role", "BUYER")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get order statistics for each customer
      const customersWithStats = await Promise.all(
        (data || []).map(async (customer) => {
          const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("total, status")
            .eq("user_id", customer.id);

          if (ordersError) {
            console.error("Error fetching orders for customer:", ordersError);
            return {
              ...customer,
              order_count: 0,
              total_spent: 0,
            };
          }

          const orderCount = orders?.length || 0;
          const totalSpent = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

          return {
            ...customer,
            order_count: orderCount,
            total_spent: totalSpent,
          };
        })
      );

      setCustomers(customersWithStats);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async (customerId: string) => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          total,
          status,
          created_at,
          vendors:vendor_id (name)
        `)
        .eq("user_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const ordersWithVendor = (data || []).map(order => ({
        ...order,
        vendor_name: (order.vendors as any)?.name || "Unknown"
      }));

      setCustomerOrders(ordersWithVendor);
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch customer orders",
        variant: "destructive",
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCustomerOrders(customer.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Customer Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <p className="text-muted-foreground">No customers found</p>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                    {customer.phone && (
                      <p className="text-sm text-muted-foreground">Phone: {customer.phone}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Joined: {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-600">{customer.order_count || 0}</p>
                        <p className="text-xs text-muted-foreground">Orders</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">${customer.total_spent?.toFixed(2) || "0.00"}</p>
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
                          <DialogDescription>
                            Order history and customer information
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedCustomer && (
                          <div className="space-y-4">
                            <div className="grid gap-2">
                              <p><strong>Email:</strong> {selectedCustomer.email}</p>
                              {selectedCustomer.phone && (
                                <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                              )}
                              <p><strong>Member Since:</strong> {new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                Order History
                              </h4>
                              
                              {loadingOrders ? (
                                <div className="flex items-center justify-center py-4">
                                  <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              ) : customerOrders.length === 0 ? (
                                <p className="text-muted-foreground">No orders found</p>
                              ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {customerOrders.map((order) => (
                                    <div key={order.id} className="flex justify-between items-center p-3 border rounded">
                                      <div>
                                        <p className="font-medium">Order #{order.id.slice(-8)}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          Vendor: {order.vendor_name}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-bold">${Number(order.total).toFixed(2)}</p>
                                        <Badge variant={
                                          order.status === 'completed' ? 'default' :
                                          order.status === 'pending' ? 'secondary' : 'destructive'
                                        }>
                                          {order.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerManager;

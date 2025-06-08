
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { Clock, Package, CheckCircle, XCircle, User, MapPin, Phone, CreditCard } from "lucide-react";

interface Order {
  id: string;
  buyer_name: string;
  buyer_phone: string;
  delivery_location: string;
  total: number;
  status: "pending" | "accepted" | "completed" | "cancelled" | "confirmed" | "preparing" | "ready" | "rejected";
  created_at: string;
  payment_method: string;
  vendor_id: string;
  user_id: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      let query = supabase.from("orders").select("*");

      if (profile?.role === "VENDOR") {
        const { data: vendorData } = await supabase
          .from("vendors")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (vendorData) {
          query = query.eq("vendor_id", vendorData.id);
        }
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (orderId: string, type: string, recipientType: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-notifications', {
        body: {
          orderId,
          type,
          recipientType
        }
      });

      if (error) {
        console.error('Error sending notification:', error);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const updateOrderStatus = async (
    orderId: string, 
    status: "pending" | "accepted" | "completed" | "cancelled" | "confirmed" | "preparing" | "ready" | "rejected"
  ) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      // Send appropriate notifications
      if (status === 'confirmed') {
        await sendNotification(orderId, 'order_approved', 'customer');
      } else if (status === 'rejected') {
        await sendNotification(orderId, 'order_rejected', 'customer');
      } else if (status === 'completed') {
        await sendNotification(orderId, 'order_completed', 'customer');
      }

      toast({
        title: "Success",
        description: `Order ${status} successfully`,
      });

      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "confirmed": return "default";
      case "preparing": return "default";
      case "ready": return "default";
      case "completed": return "default";
      case "cancelled": return "destructive";
      case "rejected": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "confirmed": 
      case "preparing": 
      case "ready": return <Package className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": 
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Order Management</h2>
      </div>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="w-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    Order #{order.id.slice(0, 8)}
                  </CardTitle>
                  <Badge variant={getStatusColor(order.status)} className="w-fit">
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Customer:</span> 
                      <span>{order.buyer_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span> 
                      <span>{order.buyer_phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Location:</span> 
                      <span>{order.delivery_location}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Total:</span> 
                      <span className="text-lg font-bold text-primary">{formatCurrency(order.total)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Payment:</span> 
                      <span>{order.payment_method}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Date:</span> 
                      <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons based on user role and order status */}
                {profile?.role === "VENDOR" && (
                  <div className="pt-4 border-t">
                    {order.status === "pending" && (
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "confirmed")}
                          className="flex-1 sm:flex-none"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Order
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateOrderStatus(order.id, "rejected")}
                          className="flex-1 sm:flex-none"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Order
                        </Button>
                      </div>
                    )}
                    
                    {order.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                        className="flex-1 sm:flex-none"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Start Preparing
                      </Button>
                    )}
                    
                    {order.status === "preparing" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "ready")}
                        className="flex-1 sm:flex-none"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Ready
                      </Button>
                    )}
                    
                    {order.status === "ready" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "completed")}
                        className="flex-1 sm:flex-none"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                )}

                {profile?.role === "ADMIN" && (
                  <div className="pt-4 border-t">
                    <Select 
                      onValueChange={(value) => updateOrderStatus(order.id, value as any)}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Change Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

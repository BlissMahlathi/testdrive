
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, MapPin, User, Phone } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, getTotal } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const total = getTotal();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to place an order",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!buyerName || !buyerPhone || !deliveryLocation || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "Cash" && (!paymentAmount || paymentAmount < total)) {
      toast({
        title: "Insufficient Cash Amount",
        description: `Please enter at least ${formatCurrency(total)} for cash payment`,
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Group items by vendor
      const itemsByVendor = items.reduce((acc, item) => {
        const vendorId = item.product.vendorId;
        if (!acc[vendorId]) {
          acc[vendorId] = [];
        }
        acc[vendorId].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      // Create separate orders for each vendor
      for (const [vendorId, vendorItems] of Object.entries(itemsByVendor)) {
        const vendorTotal = vendorItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        // Create order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            buyer_name: buyerName,
            buyer_phone: buyerPhone,
            delivery_location: deliveryLocation,
            payment_method: paymentMethod,
            payment_amount: paymentAmount || vendorTotal,
            total: vendorTotal,
            vendor_id: vendorId,
            user_id: user.id,
            status: "pending",
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = vendorItems.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          product_price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Send notification to vendor
        try {
          await supabase.functions.invoke('send-notifications', {
            body: {
              orderId: order.id,
              type: 'order_received',
              recipientType: 'vendor'
            }
          });
        } catch (notificationError) {
          console.error('Failed to send notification:', notificationError);
          // Don't fail the order if notification fails
        }
      }

      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been submitted and the vendor has been notified.",
      });

      clearCart();
      navigate("/order-confirmation", {
        state: {
          orderDetails: {
            items,
            buyerName,
            buyerPhone,
            deliveryLocation,
            paymentMethod,
            paymentAmount: paymentAmount || total,
            total,
          },
        },
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="container px-4 py-8 mx-auto">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-4">
                Add some items to your cart to get started
              </p>
              <Button onClick={() => navigate("/market")}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.product.price)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Checkout Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="buyerName">Full Name *</Label>
                    <Input
                      id="buyerName"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="buyerPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="buyerPhone"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryLocation" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Location *
                    </Label>
                    <Input
                      id="deliveryLocation"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      placeholder="Enter delivery address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Method *
                    </Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash on Delivery</SelectItem>
                        <SelectItem value="Card">Card Payment</SelectItem>
                        <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === "Cash" && (
                    <div>
                      <Label htmlFor="paymentAmount">
                        Cash Amount (Minimum: {formatCurrency(total)})
                      </Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        min={total}
                        value={paymentAmount || ""}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        placeholder={`Enter amount (min ${formatCurrency(total)})`}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Items ({items.length})</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;

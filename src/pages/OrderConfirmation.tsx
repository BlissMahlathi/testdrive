
import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateWhatsAppLink, formatCurrency } from "@/lib/utils";
import { CartItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, MessageCircle, ShoppingBag, MapPin, Phone, User, CreditCard, Package } from "lucide-react";

interface OrderDetails {
  items: CartItem[];
  buyerName: string;
  buyerPhone: string;
  deliveryLocation: string;
  paymentMethod: string;
  paymentAmount: number;
  total: number;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails as OrderDetails | undefined;
  
  if (!orderDetails) {
    return <Navigate to="/market" replace />;
  }
  
  // Get the vendor of the first item (assuming all items are from the same vendor)
  const vendorId = orderDetails.items[0]?.product.vendorId;
  
  const { data: vendor } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: async () => {
      if (!vendorId) return null;
      
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', vendorId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
  });
  
  if (!vendor) {
    return <Navigate to="/market" replace />;
  }
  
  // Generate the WhatsApp message
  const message = `🛒 *New Order from ${orderDetails.buyerName}*
📍 Delivery to: ${orderDetails.deliveryLocation}
📞 Phone: ${orderDetails.buyerPhone}

*Ordered Items:*
${orderDetails.items
  .map(
    (item) =>
      `- ${item.product.name} x${item.quantity} (${formatCurrency(
        item.product.price * item.quantity
      )})`
  )
  .join("\n")}

💰 *Total: ${formatCurrency(orderDetails.total)}*
💳 *Payment: ${orderDetails.paymentMethod}*
${
  orderDetails.paymentMethod === "Cash"
    ? `💵 *Customer will pay with: ${formatCurrency(
        orderDetails.paymentAmount
      )}*`
    : ""
}`;
  
  const whatsappLink = generateWhatsAppLink(vendor.whatsapp_number, message);
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <main className="container px-4 py-8 mx-auto md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Order Placed Successfully!
              </h1>
              <p className="text-lg text-gray-600">
                Your order has been confirmed and sent to the vendor
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Vendor Information */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Vendor Details</h2>
                        <p className="text-sm text-gray-500">Your order will be prepared by</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">{vendor.store_name || vendor.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Verified Student Vendor</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Information */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Delivery Information</h2>
                        <p className="text-sm text-gray-500">Where your order will be delivered</p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-500">Name</span>
                        </div>
                        <p className="font-medium text-gray-900">{orderDetails.buyerName}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-500">Phone</span>
                        </div>
                        <p className="font-medium text-gray-900">{orderDetails.buyerPhone}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-500">Delivery Location</span>
                        </div>
                        <p className="font-medium text-gray-900">{orderDetails.deliveryLocation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                        <p className="text-sm text-gray-500">How you'll pay for this order</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">{orderDetails.paymentMethod}</p>
                      {orderDetails.paymentMethod === "Cash" && (
                        <p className="text-sm text-gray-600 mt-1">
                          You indicated you'll pay with {formatCurrency(orderDetails.paymentAmount)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary Sidebar */}
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                        <p className="text-sm text-gray-500">{orderDetails.items.length} item(s)</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {orderDetails.items.map((item, index) => (
                        <div key={item.product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <span className="text-lg font-bold text-primary-600">
                            {formatCurrency(orderDetails.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button asChild className="w-full h-12 text-base" size="lg">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Contact Vendor via WhatsApp
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full h-12 text-base" size="lg">
                    <Link to="/market" className="flex items-center justify-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <Card className="border-0 shadow-lg mt-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <p className="font-medium text-gray-900">Vendor Confirmation</p>
                    <p className="text-sm text-gray-600 mt-1">The vendor will confirm your order via WhatsApp</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <p className="font-medium text-gray-900">Order Preparation</p>
                    <p className="text-sm text-gray-600 mt-1">Your order will be prepared fresh</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-bold">3</span>
                    </div>
                    <p className="font-medium text-gray-900">Delivery</p>
                    <p className="text-sm text-gray-600 mt-1">Receive your order at the specified location</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;

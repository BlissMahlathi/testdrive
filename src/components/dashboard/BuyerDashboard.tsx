
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderManagement from "@/components/orders/OrderManagement";
import ProfileForm from "@/components/ui/profile-form";
import { User, ShoppingBag } from "lucide-react";

const BuyerDashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
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

export default BuyerDashboard;

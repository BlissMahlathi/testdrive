
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import HowItWorks from "@/components/home/HowItWorks";
import VendorCTA from "@/components/home/VendorCTA";
import ProductCard from "@/components/products/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, TrendingUp, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Get popular products (limited to 8)
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['popular-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories!products_category_id_fkey(name),
          vendors!products_vendor_id_fkey(name, whatsapp_number, store_name)
        `)
        .eq('available', true)
        .order('created_at', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data.map(product => ({
        ...product,
        category: product.categories?.name || 'Uncategorized',
        vendorId: product.vendor_id,
        vendors: product.vendors
      }));
    },
  });

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        
        <FeaturedCategories />
        
        {/* Popular Products Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Trending Right Now
                </h2>
                <p className="text-lg text-gray-600">
                  Popular items that students love most
                </p>
              </div>
              
              <Button asChild variant="outline" className="hidden md:flex">
                <Link to="/market" className="flex items-center gap-2">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">100+</p>
                      <p className="text-sm text-gray-600">Active Vendors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">2.5k+</p>
                      <p className="text-sm text-gray-600">Orders Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Products Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
                
                {/* Mobile View All Button */}
                <div className="text-center mt-10 md:hidden">
                  <Button asChild className="w-full sm:w-auto">
                    <Link to="/market" className="flex items-center justify-center gap-2">
                      View All Products
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
        
        <HowItWorks />
        
        <VendorCTA />
      </main>
      <Footer />
    </>
  );
};

export default Index;

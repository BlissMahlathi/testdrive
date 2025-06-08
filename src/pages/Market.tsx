
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import AdvancedProductFilters from "@/components/market/AdvancedProductFilters";

const Market = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState("newest");
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories!products_category_id_fkey(name),
          vendors!products_vendor_id_fkey(name, store_name)
        `)
        .eq('available', true);
      
      if (error) throw error;
      
      return data.map(product => ({
        ...product,
        category: product.categories?.name || 'Unknown',
        vendorId: product.vendor_id,
        vendors: product.vendors
      }));
    },
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter((product: any) => {
      // Category filter
      const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
      
      // Search filter
      const searchMatch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Price filter
      const priceMatch = product.price >= priceRange[0] && 
        (priceRange[1] >= 100 || product.price <= priceRange[1]);
      
      // Availability filter
      const availabilityMatch = !showAvailableOnly || product.available;
      
      // Vendor filter
      const vendorMatch = selectedVendors.length === 0 || 
        selectedVendors.includes(product.vendor_id);
      
      return categoryMatch && searchMatch && priceMatch && availabilityMatch && vendorMatch;
    });

    // Sort products
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-az":
          return a.name.localeCompare(b.name);
        case "name-za":
          return b.name.localeCompare(a.name);
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [allProducts, selectedCategory, searchQuery, priceRange, sortBy, showAvailableOnly, selectedVendors]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange([0, 100]);
    setSortBy("newest");
    setShowAvailableOnly(true);
    setSelectedVendors([]);
    setIsExpanded(false);
  };

  return (
    <>
      <Navbar />
      <main className="container px-4 py-8 mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">
            Discover amazing products from verified student vendors
          </p>
        </div>

        <AdvancedProductFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showAvailableOnly={showAvailableOnly}
          setShowAvailableOnly={setShowAvailableOnly}
          selectedVendors={selectedVendors}
          setSelectedVendors={setSelectedVendors}
          resetFilters={resetFilters}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${filteredAndSortedProducts.length} products found`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="mx-auto max-w-md">
                  <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.22 0-4.239.905-5.708 2.367l-.001.002C4.7 19.065 3.467 20.092 2 20.092v-2.598c0-1.035.84-1.875 1.875-1.875.173 0 .344.014.513.042a6 6 0 0112.224 0c.169-.028.34-.042.513-.042 1.035 0 1.875.84 1.875 1.875v2.598c-1.467 0-2.7-1.027-4.291-2.725l-.001-.002z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Market;

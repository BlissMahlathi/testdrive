
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search, Filter, X, Star, Clock, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdvancedProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (show: boolean) => void;
  selectedVendors: string[];
  setSelectedVendors: (vendors: string[]) => void;
  resetFilters: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const AdvancedProductFilters: React.FC<AdvancedProductFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  showAvailableOnly,
  setShowAvailableOnly,
  selectedVendors,
  setSelectedVendors,
  resetFilters,
  isExpanded,
  setIsExpanded,
}) => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ['verified-vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name, store_name')
        .eq('verified', true)
        .order('store_name');
      
      if (error) throw error;
      return data;
    },
  });

  const handleVendorToggle = (vendorId: string) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
    } else {
      setSelectedVendors([...selectedVendors, vendorId]);
    }
  };

  const activeFiltersCount = [
    selectedCategory !== "all",
    searchQuery.length > 0,
    priceRange[0] > 0 || priceRange[1] < 100,
    sortBy !== "newest",
    !showAvailableOnly,
    selectedVendors.length > 0,
  ].filter(Boolean).length;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search and Quick Filters Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Search Products</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-az">Name: A to Z</SelectItem>
                <SelectItem value="name-za">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <div className="w-full">
              <Label className="text-sm font-medium mb-2 block">Availability</Label>
              <ToggleGroup
                type="single"
                value={showAvailableOnly ? "available" : "all"}
                onValueChange={(value) => setShowAvailableOnly(value === "available")}
                className="justify-start"
              >
                <ToggleGroupItem value="all" className="flex-1">
                  All Items
                </ToggleGroupItem>
                <ToggleGroupItem value="available" className="flex-1">
                  Available Now
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>

        {/* Advanced Filters (Collapsible) */}
        {isExpanded && (
          <>
            <div className="border-t pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Price Range: R{priceRange[0]} - R{priceRange[1]}
                  </Label>
                  <div className="px-3">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>R0</span>
                      <span>R100+</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Vendors {selectedVendors.length > 0 && `(${selectedVendors.length} selected)`}
                  </Label>
                  <div className="max-h-32 overflow-y-auto space-y-2 border rounded-md p-2">
                    {vendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                          selectedVendors.includes(vendor.id)
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleVendorToggle(vendor.id)}
                      >
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          selectedVendors.includes(vendor.id)
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`} />
                        <span className="text-sm">
                          {vendor.store_name || vendor.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-3 block">Quick Filters</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={priceRange[1] <= 20 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceRange([0, 20])}
                >
                  Under R20
                </Button>
                <Button
                  variant={priceRange[0] >= 20 && priceRange[1] <= 50 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceRange([20, 50])}
                >
                  R20 - R50
                </Button>
                <Button
                  variant={priceRange[0] >= 50 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriceRange([50, 100])}
                >
                  R50+
                </Button>
                <Button
                  variant={sortBy === "price-low" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("price-low")}
                >
                  Best Value
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedProductFilters;

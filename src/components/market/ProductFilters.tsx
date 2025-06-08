
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showBudget: boolean;
  setShowBudget: (show: boolean) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (show: boolean) => void;
  resetFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  showBudget,
  setShowBudget,
  showAvailableOnly,
  setShowAvailableOnly,
  resetFilters,
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

  return (
    <div className="p-4 mb-6 border rounded-lg bg-gray-50">
      <h2 className="mb-4 text-lg font-semibold">Filters</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div>
          <label className="mb-1 text-sm font-medium">Category</label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
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
        
        <div className="flex items-end gap-4">
          <Button
            variant={showBudget ? "default" : "outline"}
            onClick={() => setShowBudget(!showBudget)}
            className="flex-1"
          >
            Under R20
          </Button>
          
          <Button
            variant={showAvailableOnly ? "default" : "outline"}
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className="flex-1"
          >
            Available Now
          </Button>
        </div>
        
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

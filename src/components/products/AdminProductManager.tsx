
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Edit, Trash2, Search, Filter, Plus } from "lucide-react";
import AdminProductForm from "./AdminProductForm";
import { useToast } from "@/hooks/use-toast";

const AdminProductManager = () => {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState("all");

  const { data: products = [], refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories!products_category_id_fkey(name),
          vendors!products_vendor_id_fkey(name, store_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

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
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name, store_name')
        .eq('verified', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      product.categories?.name === selectedCategory;
    
    const matchesVendor = selectedVendor === "all" || 
      product.vendor_id === selectedVendor;
    
    return matchesSearch && matchesCategory && matchesVendor;
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      refetch();
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    refetch();
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          >
            Back to Products
          </Button>
        </div>
        <AdminProductForm
          product={editingProduct}
          onSuccess={handleFormSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">Manage all products across the platform</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
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

            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger>
                <SelectValue placeholder="All Vendors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.store_name || vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative bg-muted overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
              />
              <Badge 
                variant={product.available ? "default" : "secondary"}
                className="absolute top-2 right-2"
              >
                {product.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Category: {product.categories?.name || 'Unknown'}</p>
                <p>Vendor: {product.vendors?.store_name || product.vendors?.name || 'Unknown'}</p>
                <p>Created: {new Date(product.created_at).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p>Try adjusting your search criteria or add a new product.</p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminProductManager;

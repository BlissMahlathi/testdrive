
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import ProductForm from "./ProductForm";
import { useToast } from "@/hooks/use-toast";

const AdminProductList = () => {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: products = [], refetch } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories!category_id(name),
          vendors!vendor_id(name, store_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data;
    },
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
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
      <ProductForm
        product={editingProduct}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Products</h2>
        <Button onClick={() => setShowForm(true)}>
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-3">
              <div className="aspect-video relative bg-muted rounded-md overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
                <Badge variant={product.available ? "default" : "secondary"}>
                  {product.available ? "Available" : "Unavailable"}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Category: {product.categories?.name || 'Unknown'}</p>
                <p>Vendor: {product.vendors?.store_name || product.vendors?.name || 'Unknown'}</p>
              </div>

              <div className="flex gap-2">
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
    </div>
  );
};

export default AdminProductList;

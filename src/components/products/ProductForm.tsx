
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
  product?: any;
}

const ProductForm = ({ onSuccess, onCancel, product }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: "",
    available_from: "",
    available_to: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category_id: product.category_id || "",
        image: product.image || "",
        available_from: product.available_from || "",
        available_to: product.available_to || "",
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Get vendor ID for current user
      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .eq("verified", true)
        .single();

      if (vendorError) {
        toast({
          title: "Error",
          description: "You must be a verified vendor to add products",
          variant: "destructive",
        });
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        image: formData.image || "https://via.placeholder.com/400x300",
        vendor_id: vendorData.id,
        available_from: formData.available_from || null,
        available_to: formData.available_to || null,
      };

      let error;
      if (product) {
        // Update existing product
        const result = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);
        error = result.error;
      } else {
        // Create new product
        const result = await supabase
          .from("products")
          .insert([productData]);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: product ? "Product updated successfully" : "Product added successfully",
      });

      setFormData({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image: "",
        available_from: "",
        available_to: "",
      });

      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: product ? "Failed to update product" : "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="available_from">Available From</Label>
              <Input
                id="available_from"
                type="time"
                value={formData.available_from}
                onChange={(e) => setFormData({ ...formData, available_from: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="available_to">Available To</Label>
              <Input
                id="available_to"
                type="time"
                value={formData.available_to}
                onChange={(e) => setFormData({ ...formData, available_to: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (product ? "Updating..." : "Adding Product...") : (product ? "Update Product" : "Add Product")}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Vendor {
  id: string;
  name: string;
  store_name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  vendor_id: string;
  image: string;
  available_from: string | null;
  available_to: string | null;
}

interface AdminProductFormProps {
  onSuccess: () => void;
  product?: Product;
}

const AdminProductForm = ({ onSuccess, product }: AdminProductFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    vendor_id: "",
    image: "",
    available_from: "",
    available_to: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchVendors();
    
    // If editing an existing product, populate the form
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category_id: product.category_id,
        vendor_id: product.vendor_id,
        image: product.image,
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

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select("id, name, store_name")
        .eq("verified", true)
        .order("name");

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Use a placeholder URL for now since storage needs proper setup
      const placeholderUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`;
      setFormData(prev => ({ ...prev, image: placeholderUrl }));
      
      toast({
        title: "Image Set",
        description: "Using placeholder image. Storage setup needed for actual uploads.",
      });
    } catch (error) {
      console.error("Error handling image:", error);
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        vendor_id: formData.vendor_id,
        image: formData.image || "https://via.placeholder.com/400x300",
        available_from: formData.available_from || null,
        available_to: formData.available_to || null,
      };

      let error;
      
      if (product) {
        // Update existing product
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);
        error = updateError;
      } else {
        // Create new product
        const { error: insertError } = await supabase
          .from("products")
          .insert([productData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: product ? "Product updated successfully" : "Product added successfully",
      });

      if (!product) {
        setFormData({
          name: "",
          description: "",
          price: "",
          category_id: "",
          vendor_id: "",
          image: "",
          available_from: "",
          available_to: "",
        });
      }

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
        <CardTitle>{product ? "Edit Product" : "Add Product"} (Admin)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="vendor">Vendor</Label>
              <Select
                value={formData.vendor_id}
                onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.store_name || vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="image">Product Image</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="flex-1"
                />
                <Button type="button" disabled={uploading} variant="outline" size="sm">
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {formData.image && (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {!formData.image && (
                <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  <Image className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}
            </div>
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

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 
              (product ? "Updating Product..." : "Adding Product...") : 
              (product ? "Update Product" : "Add Product")
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminProductForm;

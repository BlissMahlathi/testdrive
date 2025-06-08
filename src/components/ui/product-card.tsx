
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product & {
    vendors?: {
      name: string;
      store_name?: string;
    };
  };
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { name, description, price, image, available, vendors } = product;
  
  return (
    <Card className="overflow-hidden transition-all duration-200 border hover:shadow-lg dark:hover:shadow-xl hover:scale-[1.02] bg-card">
      <div className="relative h-48 bg-muted">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Badge variant="secondary" className="bg-red-500 text-white">
              Currently Unavailable
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-1 text-foreground">{name}</h3>
          <p className="font-bold text-primary text-lg">
            {formatCurrency(price)}
          </p>
        </div>
        
        {vendors && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {vendors.store_name || vendors.name}
            </Badge>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(product)}
          variant="default"
          className="w-full transition-all duration-200 hover:scale-[1.02]"
          disabled={!available}
        >
          {available ? "Add to Cart" : "Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

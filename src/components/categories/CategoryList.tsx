
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => onSelectCategory(null)}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.name ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => onSelectCategory(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryList;

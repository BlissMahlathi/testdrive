import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "1",
    name: "Fresh Drinks",
    image: "/drinks.jpeg",
    link: "/market?category=drinks",
    itemCount: "50+ items",
    popular: true,
  },
  {
    id: "2",
    name: "Crispy Snacks",
    image: "/snacks.jpeg",
    link: "/market?category=snacks",
    itemCount: "80+ items",
    popular: true,
  },
  {
    id: "3",
    name: "Hot Meals",
    image: "/hot-meals.jpeg",
    link: "/market?category=hot-meals",
    itemCount: "30+ items",
    popular: false,
  },
  {
    id: "4",
    name: "Budget Deals",
    image: "/budget.jpeg",
    link: "/market?filter=under-r20",
    itemCount: "40+ deals",
    popular: false,
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse Popular Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing food from student vendors across different
            categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={category.link} className="group">
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Popular badge */}
                  {category.popular && (
                    <Badge
                      variant="secondary"
                      className="absolute top-4 left-4 bg-white/90 text-gray-900 font-medium"
                    >
                      Popular
                    </Badge>
                  )}

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-white/80 mb-3">
                      {category.itemCount}
                    </p>

                    <div className="flex items-center text-sm font-medium group-hover:text-primary-300 transition-colors">
                      <span>Explore now</span>
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            to="/market"
            className="inline-flex items-center gap-2 px-6 py-3 text-primary-600 border-2 border-primary-600 rounded-lg font-medium hover:bg-primary-600 hover:text-white transition-all duration-300 group"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;

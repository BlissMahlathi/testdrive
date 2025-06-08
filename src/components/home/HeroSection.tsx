import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="relative container px-4 py-16 mx-auto md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-white space-y-8">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="w-fit bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Zap className="w-4 h-4 mr-2" />
              Fast Campus Delivery
            </Badge>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Student Food,
                <span className="block text-white/90">For Students,</span>
                <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  By Students
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
                Order snacks, drinks and fresh meals from verified student
                vendors on campus. Quick, affordable, and made with love.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">
                  100+ Student Vendors
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm font-medium">15min Avg Delivery</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-white text-primary-600 hover:bg-white/90 shadow-lg"
              >
                <Link to="/market">Order Food Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-semibold text-slate-400 border-2 border-white/30 hover:bg-white/10 hover:border-white/50"
              >
                <Link to="/vendor/register">Start Selling Today</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src="/logo.png"
                alt="Delicious student food"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg z-20 transform -rotate-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Fast Delivery
                  </p>
                  <p className="text-xs text-gray-600">Under 20 minutes</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg z-20 transform rotate-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary-600 fill-current" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Top Rated
                  </p>
                  <p className="text-xs text-gray-600">4.8/5 stars</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

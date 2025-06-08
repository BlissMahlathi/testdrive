
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Clock, Users, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Earn Extra Income",
    description: "Make money selling your favorite foods to fellow students",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Sell when you want, work around your class schedule",
  },
  {
    icon: Users,
    title: "Build Community",
    description: "Connect with students and share your culinary talents",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Start small and scale up as your customer base grows",
  },
];

const VendorCTA = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-blue-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Turn Your Cooking Skills Into Cash
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community of student entrepreneurs and start earning money 
              by selling delicious food to your fellow students on campus.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main CTA Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-primary-500 to-primary-600 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center text-white relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-12 translate-y-12" />
              
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Start Your Food Business?
                </h3>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  Join CampusEats today and become part of a thriving community of student vendors. 
                  Easy registration, instant verification, and direct communication with customers.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    asChild 
                    size="lg" 
                    className="h-14 px-8 text-lg font-semibold bg-white text-primary-600 hover:bg-white/90 shadow-lg"
                  >
                    <Link to="/vendor/register">Become a Vendor Today</Link>
                  </Button>
                  
                  <div className="text-white/80 text-sm">
                    <p>✓ Free to join</p>
                    <p>✓ Quick verification</p>
                    <p>✓ Start earning immediately</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Stories */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Join over 100+ successful student vendors</p>
            <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
              <div>
                <span className="font-semibold text-primary-600">R50k+</span>
                <p>Total earnings</p>
              </div>
              <div>
                <span className="font-semibold text-primary-600">2.5k+</span>
                <p>Orders completed</p>
              </div>
              <div>
                <span className="font-semibold text-primary-600">4.8/5</span>
                <p>Average rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorCTA;

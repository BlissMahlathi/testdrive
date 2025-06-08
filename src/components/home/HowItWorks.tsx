
import React from "react";
import { Search, ShoppingCart, MessageCircle, Utensils } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Browse & Search",
    description: "Explore delicious snacks, drinks and meals from verified student vendors on campus",
    icon: Search,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: "Add to Cart",
    description: "Select your favorites, add them to cart and provide your delivery details",
    icon: ShoppingCart,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    title: "Connect & Pay",
    description: "Chat with vendor via WhatsApp and pay with cash, eWallet, or bank transfer",
    icon: MessageCircle,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    title: "Enjoy Fresh Food",
    description: "Receive your freshly prepared order directly from the student vendor",
    icon: Utensils,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How CampusEats Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From hungry student to satisfied customer in just a few simple steps
          </p>
        </div>
        
        {/* Steps */}
        <div className="grid gap-8 md:gap-12 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 transform translate-x-8 z-0" />
              )}
              
              <div className="relative z-10 text-center group">
                {/* Icon container */}
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${step.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  {step.id}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
            Ready to get started?
          </div>
          <p className="text-gray-600 mb-6">
            Join thousands of students already using CampusEats for their daily food needs
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

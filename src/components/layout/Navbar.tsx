import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ThemeToggle } from "../theme/ThemeToggle";

const Navbar = () => {
  const { user } = useAuth();
  const { items } = useCart();
  const cartItemCount = items.length;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl font-bold text-primary-500">CampusEats</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium hover:text-primary-500 ${
                isActive ? "text-primary-500 underline" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/market"
            className={({ isActive }) =>
              `text-sm font-medium hover:text-primary-500 ${
                isActive ? "text-primary-500 underline" : ""
              }`
            }
          >
            Market
          </NavLink>
          {!user && (
            <NavLink
              to="/vendor/register"
              className={({ isActive }) =>
                `text-sm font-medium hover:text-primary-500 ${
                  isActive ? "text-primary-500 underline" : ""
                }`
              }
            >
              Become a Vendor
            </NavLink>
          )}

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/cart">
              <Button
                variant="outline"
                size="icon"
                className="relative"
                aria-label="View cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <Button variant="default" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="default" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-3 md:hidden">
          <ThemeToggle />
          <Link to="/cart">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              aria-label="View cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <div className="flex flex-col h-full">
                {/* Close button */}
                <div className="flex justify-end p-4">
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Close menu">
                      <Menu className="h-6 w-6 rotate-90" />
                    </Button>
                  </SheetTrigger>
                </div>
                {/* Scrollable menu */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  <nav className="flex flex-col space-y-6">
                    <Link
                      to="/"
                      className="text-lg font-medium rounded hover:bg-accent hover:text-primary-500 transition py-3 px-2"
                    >
                      Home
                    </Link>
                    <Link
                      to="/market"
                      className="text-lg font-medium rounded hover:bg-accent hover:text-primary-500 transition py-3 px-2"
                    >
                      Market
                    </Link>
                    {!user && (
                      <Link
                        to="/vendor/register"
                        className="text-lg font-medium rounded hover:bg-accent hover:text-primary-500 transition py-3 px-2"
                      >
                        Become a Vendor
                      </Link>
                    )}
                  </nav>
                  {/* Divider */}
                  <div className="my-6 border-t" />
                  {/* Action button */}
                  <div>
                    {user ? (
                      <Button
                        variant="default"
                        asChild
                        className="w-full py-3 text-lg"
                      >
                        <Link to="/dashboard">Dashboard</Link>
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        asChild
                        className="w-full py-3 text-lg"
                      >
                        <Link to="/login">Login</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

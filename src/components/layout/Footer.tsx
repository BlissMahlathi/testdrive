
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary">
      <div className="container px-4 py-8 mx-auto md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center mb-4 space-x-2">
              <span className="text-xl font-bold text-primary-500">CampusEats</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The marketplace for student food and snacks at University of Venda.
              Order from student vendors on campus anytime.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/market" className="text-muted-foreground hover:text-primary-500">
                  Market
                </Link>
              </li>
              <li>
                <Link to="/vendor/register" className="text-muted-foreground hover:text-primary-500">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary-500">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact the Developer</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Hlulani Bliss Mahlathi</li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:blissmahlathi37@gmail.com" className="hover:text-primary-500">
                  blissmahlathi37@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+27715231720" className="hover:text-primary-500">
                  (+27) 71 523 1720
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-muted">
          <p className="text-xs text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} CampusEats. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

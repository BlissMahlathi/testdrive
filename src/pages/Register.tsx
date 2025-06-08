
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const { toast } = useToast();
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await signUp(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.phone
      );
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        console.error("Registration error:", error);
      } else {
        toast({
          title: "Registration successful",
          description: "Your account has been created. You can now log in.",
          variant: "default",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Unexpected error during registration:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <main className="container px-4 py-8 mx-auto md:py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Register to start ordering food from student vendors
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block mb-1 text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary-500 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Register;

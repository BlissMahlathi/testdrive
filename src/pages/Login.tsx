
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

const Login = () => {
  const { toast } = useToast();
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        console.error("Login error:", error);
      } else {
        toast({
          title: "Login successful",
          description: "You are now logged in",
          variant: "default",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast({
        title: "Login failed",
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
      <main className="container flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8 mx-auto">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Sign in to your CampusEats account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary-500 hover:underline">
                  Register
                </Link>
              </p>
              <p className="mt-2 text-gray-600">
                Want to become a vendor?{" "}
                <Link to="/vendor/register" className="text-primary-500 hover:underline">
                  Apply here
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

export default Login;

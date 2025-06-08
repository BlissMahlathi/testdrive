
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold mb-4 text-primary-500">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="mb-8 text-gray-500">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

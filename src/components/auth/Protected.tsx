
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface ProtectedProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ADMIN_EMAIL = "blissmahlathi@gmail.com"; // Your specific admin email

const Protected = ({ children, allowedRoles }: ProtectedProps) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If authentication is complete and there's no user, redirect to login
    if (!isLoading && !user) {
      navigate("/login", { replace: true });
      return;
    }

    // Special check for ADMIN role - only allow specified email
    if (
      !isLoading &&
      user &&
      profile &&
      allowedRoles?.includes(UserRole.ADMIN) &&
      profile.email !== ADMIN_EMAIL
    ) {
      // If trying to access admin route but not the approved admin email
      navigate("/dashboard", { replace: true });
      return;
    }

    // General role check
    if (
      !isLoading &&
      user &&
      profile &&
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(profile.role)
    ) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, user, profile, allowedRoles, navigate]);

  // Show loading while checking authentication status
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Protected;

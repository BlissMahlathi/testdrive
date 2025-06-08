
import { ReactNode } from "react";
import Protected from "./Protected";
import { UserRole } from "@/types";

interface VendorRouteProps {
  children: ReactNode;
}

const VendorRoute = ({ children }: VendorRouteProps) => {
  return (
    <Protected allowedRoles={[UserRole.VENDOR, UserRole.ADMIN]}>
      {children}
    </Protected>
  );
};

export default VendorRoute;

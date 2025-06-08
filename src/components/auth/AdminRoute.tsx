
import { ReactNode } from "react";
import Protected from "./Protected";
import { UserRole } from "@/types";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  return (
    <Protected allowedRoles={[UserRole.ADMIN]}>
      {children}
    </Protected>
  );
};

export default AdminRoute;

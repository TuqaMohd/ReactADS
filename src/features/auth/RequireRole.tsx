import type { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface RequireRoleProps {
  role: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RequireRole({ role, children, fallback = null }: RequireRoleProps) {
  const { hasRole } = useAuth();
  return hasRole(role) ? <>{children}</> : <>{fallback}</>;
}

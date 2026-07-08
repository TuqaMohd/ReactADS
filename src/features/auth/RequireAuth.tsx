import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GuestNameForm from "./GuestNameForm";

interface RequireAuthProps {
  children: ReactNode;
  variant?: "redirect" | "guest";
  title?: string;
  message?: string;
}

export default function RequireAuth({
  children,
  variant = "redirect",
  title = "Who Is Playing?",
  message = "Type your name or nickname."
}: RequireAuthProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (variant === "redirect") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="text-center py-6">
      <h2 className="text-xl font-bold text-gold mb-2">{title}</h2>
      <p className="text-ink/70 text-sm mb-4">{message}</p>
      <div className="flex justify-center">
        <GuestNameForm />
      </div>
    </div>
  );
}

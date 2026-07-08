import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "./LoginForm";

interface LocationState {
  from?: { pathname: string };
}

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? "/account";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function handleSuccess() {
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="text-center py-6">
      <h2 className="text-xl font-bold text-gold mb-2">Log in to continue</h2>
      <p className="text-ink/70 text-sm mb-4">Use your account credentials to access this page.</p>
      <div className="flex justify-center">
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

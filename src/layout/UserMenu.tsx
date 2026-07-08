import { Link } from "react-router-dom";
import { CircleUser } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-1.5 text-parchment hover:text-goldBright font-semibold transition-colors"
      >
        <CircleUser size={16} aria-hidden="true" />
        Log in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 text-parchment">
      <Link
        to="/account"
        className="flex items-center gap-1.5 hover:text-goldBright font-semibold transition-colors"
        aria-label={`Account settings for ${user?.username}`}
      >
        <CircleUser size={16} aria-hidden="true" />
        <span className="sm:hidden">{user?.username}</span>
      </Link>
      <button
        onClick={logout}
        className="text-xs text-parchment/70 hover:text-goldBright underline"
      >
        Log out
      </button>
    </div>
  );
}

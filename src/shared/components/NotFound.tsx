import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="text-center py-10 px-2">
      <h2 className="text-xl sm:text-2xl font-bold text-gold mb-2">404 - Page not found</h2>
      <p className="text-ink text-sm sm:text-base mb-1">
        That page doesn't exist on this quest map.
      </p>
      <p className="text-ink/60 text-xs sm:text-sm mb-4 font-mono">{location.pathname}</p>
      <Link
        to="/dashboard"
        className="bg-gold text-ink font-semibold px-4 py-2 rounded text-sm hover:bg-goldBright inline-block"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import type { Tab } from "../shared/types/navigation";
import { useTheme } from "../contexts/ThemeContext";

const linkClasses = (active: boolean, theme: "dark" | "light") =>
  "px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg shadow-sm inline-block text-sm sm:text-base " +
  (theme === "dark"
    ? active
      ? "bg-parchmentDark shadow-lg shadow-white text-orange-950 font-semibold"
      : "bg-parchment text-orange-950 font-semibold transition duration-300 ease-in-out hover:scale-105"
    : active
    ? "bg-emerald shadow-lg shadow-emerald text-parchment font-semibold hover:bg-emeraldDark transition duration-300 ease-in-out"
    : "bg-emerald text-parchment font-semibold transition duration-300 ease-in-out hover:bg-emeraldDark hover:scale-105");

export default function Navbar() {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const activeTab: Tab = pathname.startsWith("/quest") ? "game" : "dashboard";

  return (
    <nav className="flex flex-wrap justify-center gap-2 sm:gap-3">
      <Link to="/dashboard" className={linkClasses(activeTab === "dashboard", theme)}>
        Dashboard
      </Link>
      <Link to="/quest" className={linkClasses(activeTab === "game", theme)}>
        Official Quest
      </Link>
    </nav>
  );
}


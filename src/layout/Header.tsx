import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();

  const textClass = theme === "dark" ? "text-parchmentDark" : "text-emeraldDark";

  return (
    <header className="text-center mb-6">
      <h1 className={`text-2xl sm:text-3xl font-bold ${textClass}`}>JavaScript vs TypeScript</h1>
      <p className={`${textClass} mt-1 mb-5 text-sm sm:text-base px-2`}>
        {isAuthenticated
          ? `Welcome back, ${user?.username}! Explore the difference between JavaScript and TypeScript.`
          : "Welcome to Tuqa's quest where you will explore the difference between JavaScript and TypeScript"}
      </p>
      <Navbar />
    </header>
  );
}

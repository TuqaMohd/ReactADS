import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";
import { comparisons } from "../features/dashboard/data";
import { trialLevels } from "../features/quest/data";
import { getLevelStatus } from "../features/quest/questProgress";
import { useQuestProgress } from "../features/quest/QuestProgressContext";
import { useAuth } from "../contexts/AuthContext";

const panelClasses =
  "absolute right-0 top-full w-56 max-w-[85vw] bg-parchment border-2 border-gold rounded-lg shadow-lg " +
  "py-2 opacity-0 invisible -translate-y-1 transition-all duration-150 " +
  "group-hover:opacity-100 group-hover:visible group-hover:translate-y-0"; 

export default function TopNav() {
  const { cleared } = useQuestProgress();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="relative z-40 bg-orange-950 backdrop-blur border-b-2 border-goldBright shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/dashboard" className="flex items-center gap-2 group/logo">
              <img
                src="/images/cat.jpg"
                alt="TQuest logo"
                className="w-9 h-9 rounded-full border-2 border-gold object-cover group-hover/logo:border-goldBright transition-colors"
              />
              <span className="font-serif font-bold text-lg text-goldBright group-hover/logo:text-parchment transition-colors">
                TQuest
              </span>
            </Link>

            {isAuthenticated && (
              <span className="hidden sm:inline text-sm text-parchment/90 border-l border-goldBright/40 pl-3">
                Welcome, <span className="font-semibold text-goldBright">{user?.username}</span>
              </span>
            )}
          </div>

          <div className="order-3 sm:order-2 w-full sm:w-auto sm:flex-1 sm:max-w-xs">
            <SearchBar />
          </div>

          <nav className="order-2 sm:order-3 flex items-center gap-4 text-xs sm:text-sm">

            <div className="relative group">
              <Link
                to="/dashboard"
                className="text-parchment hover:text-goldBright font-semibold transition-colors pb-2 border-b-2 border-transparent group-hover:border-goldBright"
              >
                Dashboard
              </Link>
              <div className={panelClasses}>
                <p className="px-3 pb-1.5 mb-1 text-[10px] uppercase tracking-wide text-emeraldDark/70 font-bold border-b border-gold/30">
                  Topics
                </p>
                {comparisons.map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/dashboard/topic/${topic.id}`}
                    className="block px-3 py-1.5 text-ink text-sm hover:bg-goldBright/40 transition-colors"
                  >
                    {topic.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group">
              <Link
                to="/quest"
                className="text-parchment hover:text-goldBright font-semibold transition-colors pb-2 border-b-2 border-transparent group-hover:border-goldBright"
              >
                Quest
              </Link>
              <div className={panelClasses}>
                <p className="px-3 pb-1.5 mb-1 text-[10px] uppercase tracking-wide text-emeraldDark/70 font-bold border-b border-gold/30">
                  Levels
                </p>
                {trialLevels.map((level) => {
                  const status = getLevelStatus(level.id, cleared);
                  const locked = status === "locked";
                  return locked ? (

                    <span
                      key={level.id}
                      className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm text-ink/40 cursor-not-allowed"
                    >
                      {level.title}
                      <Lock size={13} aria-hidden="true" />
                    </span>
                  ) : (
                    <Link
                      key={level.id}
                      to={`/quest/level/${level.id}`}
                      className="flex items-center justify-between gap-2 px-3 py-1.5 text-sm text-ink hover:bg-goldBright/40 transition-colors"
                    >
                      {level.title}
                      {status === "cleared" && <span aria-hidden="true">✓</span>}
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link
              to="/library"
              className="text-parchment hover:text-goldBright font-semibold transition-color "
            >
              Library
            </Link>

            <ThemeToggle />

            <UserMenu />
          </nav>
        </div>
      </div>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import { trialLevels } from "./data";
import { getLevelStatus } from "./questProgress";
import { useQuestProgress } from "./QuestProgressContext";
import LevelTracker from "./components/LevelTracker";
import { useAuth } from "../../contexts/AuthContext";
import RequireAuth from "../auth/RequireAuth";

function QuestLayoutInner() {
  const { cleared } = useQuestProgress();
  const { user, logout } = useAuth();

  function statusFor(id: number) {
    return getLevelStatus(id, cleared);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-sm text-ink">
          Playing as <span className="font-semibold text-emeraldDark">{user?.username}</span>
        </p>
        <button onClick={logout} className="text-xs text-ink/60 hover:text-danger underline">
          Not you? Log out
        </button>
      </div>
      <LevelTracker levels={trialLevels} statusFor={statusFor} />
      <Outlet />
    </div>
  );
}

export default function QuestLayout() {
  return (
    <RequireAuth
      variant="guest"
      title="Who Is Playing?"
      message="Type your name or nickname."
    >
      <QuestLayoutInner />
    </RequireAuth>
  );
}

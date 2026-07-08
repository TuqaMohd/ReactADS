import { Navigate, useNavigate } from "react-router-dom";
import { trialLevels } from "./data";
import { useQuestProgress } from "./QuestProgressContext";
import BonusRound from "./components/BonusRound";

export default function QuestComplete() {
  const navigate = useNavigate();
  const { cleared, resetProgress } = useQuestProgress();

  if (cleared.length < trialLevels.length) {
    return <Navigate to="/quest/level/1" replace />;
  }

  function playAgain() {
    resetProgress();
    navigate("/quest/level/1");
  }

  return (
    <div className="text-center py-8 sm:py-10 px-2">
      <h2 className="text-xl sm:text-2xl font-bold text-gold mb-2">Congrats :D !!</h2>
      <p className="text-ink text-sm sm:text-base max-w-md mx-auto mb-4">
        You have managed to answer all three questions correctly and saved yourself the trouble of dealing with TypeScript errors.
      </p>
      <button
        onClick={playAgain}
        className="bg-emerald text-parchment px-5 sm:px-6 py-2 rounded hover:bg-emeraldDark text-sm sm:text-base"
      >
        Play again!
      </button>

      <div className="text-left mt-2">
        <BonusRound />
      </div>
    </div>
  );
}

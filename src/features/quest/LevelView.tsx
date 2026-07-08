import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { trialLevels } from "./data";
import { useQuestProgress } from "./QuestProgressContext";
import QuestTitle from "./components/QuestTitle";
import AnswerOptions from "./components/AnswerOptions";
import ArrivedViaSearchBanner from "../../shared/components/ArrivedViaSearchBanner";

export default function LevelView() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();

  const { markCleared } = useQuestProgress();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  const currentLevel = Number(levelId);
  const level = trialLevels.find((l) => l.id === currentLevel);

  useEffect(() => {
    setSelectedOption(null);
    setFeedback(null);
    setWasCorrect(null);
  }, [levelId]);

  if (!level) {
    return null;
  }

  function pickOption(optionId: string) {
    if (wasCorrect) return;

    const option = level!.options.find((o) => o.id === optionId)!;
    setSelectedOption(optionId);
    setFeedback(option.feedback);
    setWasCorrect(option.correct);
    if (option.correct) {
      markCleared(level!.id);
    }
  }

  function goToNext() {
    if (currentLevel < trialLevels.length) {
      navigate(`/quest/level/${currentLevel + 1}`);
    } else {
      navigate("/quest/complete");
    }
  }

  return (
    <div className="bg-white border border-parchmentDark rounded-lg p-3 sm:p-5">
      <ArrivedViaSearchBanner />
      <QuestTitle level={level} />

      <AnswerOptions
        options={level.options}
        selectedOption={selectedOption}
        wasCorrect={wasCorrect}
        feedback={feedback}
        onSelect={pickOption}
      />

      {wasCorrect && (
        <button
          onClick={goToNext}
          className="mt-4 bg-emerald text-parchment px-4 sm:px-5 py-2 rounded hover:bg-emeraldDark text-sm sm:text-base"
        >
          {currentLevel < trialLevels.length ? "Next level" : "Finish"}
        </button>
      )}
    </div>
  );
}

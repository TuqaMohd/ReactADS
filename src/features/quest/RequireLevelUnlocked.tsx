import type { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { trialLevels } from "./data";
import { getLevelStatus, nextAvailableLevel } from "./questProgress";
import { useQuestProgress } from "./QuestProgressContext";

interface RequireLevelUnlockedProps {
  children: ReactNode;
}

export default function RequireLevelUnlocked({ children }: RequireLevelUnlockedProps) {
  const { levelId } = useParams<{ levelId: string }>();
  const { cleared } = useQuestProgress();

  const id = Number(levelId);
  const levelExists = trialLevels.some((level) => level.id === id);

  if (!levelExists) {
    return <Navigate to="/quest/level/1" replace />;
  }

  if (getLevelStatus(id, cleared) === "locked") {
    return <Navigate to={`/quest/level/${nextAvailableLevel(cleared)}`} replace />;
  }

  return <>{children}</>;
}

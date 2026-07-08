import type { TrialLevel } from "../types";

interface QuestTitleProps {
  level: TrialLevel;
}

export default function QuestTitle({ level }: QuestTitleProps) {
  return (
    <div className="mb-4">
      <h2 className="text-lg sm:text-xl font-bold text-emeraldDark mb-1">{level.title}</h2>
      <p className="text-ink text-sm sm:text-base mb-4">{level.description}</p>
      <pre className="bg-ink text-parchment text-xs sm:text-sm whitespace-pre-wrap break-words font-mono p-3 sm:p-4 rounded mb-4 overflow-x-auto">
        {level.brokenCode}
      </pre>
      <p className="font-semibold text-ink text-sm sm:text-base">{level.question}</p>
    </div>
  );
}

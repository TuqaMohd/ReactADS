import type { TrialOption } from "../types";

interface AnswerOptionsProps {
  options: TrialOption[];
  selectedOption: string | null;
  wasCorrect: boolean | null;
  feedback: string | null;
  onSelect: (optionId: string) => void;
}

function classesFor(option: TrialOption, isSelected: boolean) {
  const base = "text-left border-2 rounded px-3 py-2 text-xs sm:text-sm break-words";
  if (!isSelected) return base + " border-gold bg-parchmentDark";
  return option.correct
    ? base + " border-emerald bg-green-100"
    : base + " border-danger bg-red-100";
}

export default function AnswerOptions({
  options,
  selectedOption,
  wasCorrect,
  feedback,
  onSelect
}: AnswerOptionsProps) {
  return (
    <div>
      <div className="grid gap-2">
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              disabled={wasCorrect === true}
              className={classesFor(option, isSelected)}
            >
              <code className="font-mono break-words">{option.label}</code>
            </button>
          );
        })}
      </div>

      {feedback && (
        <div
          className={
            "mt-4 p-3 rounded border-l-4 text-sm sm:text-base " +
            (wasCorrect ? "bg-green-100 border-emerald" : "bg-red-100 border-danger")
          }
        >
          {feedback}
        </div>
      )}
    </div>
  );
}

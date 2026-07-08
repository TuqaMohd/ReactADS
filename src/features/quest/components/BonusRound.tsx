import { useState } from "react";
import { fetchBonusQuestion, type BonusQuestion } from "../api";
import AnswerOptions from "./AnswerOptions";

export default function BonusRound() {
  const [question, setQuestion] = useState<BonusQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadQuestion() {
    setIsLoading(true);
    setError(null);
    setQuestion(null);
    setSelectedOption(null);
    setWasCorrect(null);
    setFeedback(null);

    try {
      const result = await fetchBonusQuestion();
      setQuestion(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function pickOption(optionId: string) {
    if (!question || wasCorrect) return;
    const option = question.options.find((o) => o.id === optionId)!;
    setSelectedOption(optionId);
    setWasCorrect(option.correct);
    setFeedback(option.feedback);
  }

  return (
    <div className="bg-white border border-parchmentDark rounded-lg p-3 sm:p-5 mt-6">
      <h3 className="text-lg sm:text-xl font-bold text-emeraldDark mb-1">Bonus Round</h3>
      <p className="text-ink text-sm sm:text-base mb-4">
        A live trivia question, fetched fresh from the Open Trivia Database.
      </p>

      {!isLoading && !error && !question && (
        <button
          onClick={loadQuestion}
          className="bg-gold text-ink font-semibold px-4 py-2 rounded text-sm hover:bg-goldBright"
        >
          Load a question
        </button>
      )}

      {isLoading && (
        <p className="text-ink text-sm sm:text-base">Loading a fresh question...</p>
      )}

      {!isLoading && error && (
        <div>
          <p className="text-danger text-sm sm:text-base mb-3">{error}</p>
          <button
            onClick={loadQuestion}
            className="bg-gold text-ink font-semibold px-4 py-2 rounded text-sm hover:bg-goldBright"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && question && (
        <div>
          <p className="text-xs text-parchmentDark mb-2">
            {question.category} - {question.difficulty}
          </p>
          <p className="font-semibold text-ink text-sm sm:text-base mb-3">{question.question}</p>

          <AnswerOptions
            options={question.options}
            selectedOption={selectedOption}
            wasCorrect={wasCorrect}
            feedback={feedback}
            onSelect={pickOption}
          />

          {wasCorrect !== null && (
            <button
              onClick={loadQuestion}
              className="mt-4 bg-emerald text-parchment px-4 sm:px-5 py-2 rounded hover:bg-emeraldDark text-sm sm:text-base"
            >
              Get another question
            </button>
          )}
        </div>
      )}
    </div>
  );
}

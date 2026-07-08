import type { TrialOption } from "./types";
import { httpClient, ApiError } from "../../shared/api/httpClient";

interface OpenTriviaResult {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OpenTriviaResponse {
  response_code: number;
  results: OpenTriviaResult[];
}

export interface BonusQuestion {
  question: string;
  category: string;
  difficulty: string;
  options: TrialOption[];
}

const OPEN_TRIVIA_URL =
  "https://opentdb.com/api.php?amount=1&category=18&type=multiple";

function decodeHtml(text: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, attempts = 3): Promise<OpenTriviaResponse> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await httpClient.get<OpenTriviaResponse>(url);
      return response.data;
    } catch (error) {
      const isLastAttempt = attempt === attempts;
      const isRateLimited = error instanceof ApiError && error.status === 429;

      if (!isRateLimited || isLastAttempt) {
        throw error;
      }

      const backoffMs = (error as ApiError).retryAfterMs ?? attempt * 1500;
      await sleep(backoffMs);
    }
  }

  throw new ApiError("Open Trivia DB is unavailable right now.");
}

export async function fetchBonusQuestion(): Promise<BonusQuestion> {
  let data: OpenTriviaResponse;

  try {
    data = await fetchWithRetry(OPEN_TRIVIA_URL);
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      throw new Error("Open Trivia DB is rate-limiting us right now - wait a few seconds and try again.");
    }

    if (error instanceof ApiError) {
      throw new Error(error.message);
    }

    throw error;
  }

  if (data.response_code !== 0 || data.results.length === 0) {
    throw new Error("Open Trivia DB had no questions available right now.");
  }

  const result = data.results[0];

  const rawOptions = [
    { label: result.correct_answer, correct: true },
    ...result.incorrect_answers.map((label) => ({ label, correct: false }))
  ];

  const options: TrialOption[] = shuffle(rawOptions).map((opt, index) => ({
    id: String(index),
    label: decodeHtml(opt.label),
    correct: opt.correct,
    feedback: opt.correct
      ? "Correct! On to the next question!"
      : "Wrong! Try again :p"
  }));

  return {
    question: decodeHtml(result.question),
    category: decodeHtml(result.category),
    difficulty: result.difficulty,
    options
  };
}

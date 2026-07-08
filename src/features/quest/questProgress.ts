import type { LevelStatus } from "./types";

export function getLevelStatus(id: number, cleared: number[]): LevelStatus {
  if (cleared.includes(id)) return "cleared";
  const nextAvailable = cleared.length + 1;
  return id === nextAvailable ? "available" : "locked";
}

export function nextAvailableLevel(cleared: number[]): number {
  return cleared.length + 1;
}

import type { LevelStatus, TrialLevel } from "../types";

interface LevelTrackerProps {
  levels: TrialLevel[];
  statusFor: (id: number) => LevelStatus;
}

const circleClasses = (status: LevelStatus) =>
  "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 font-semibold text-sm sm:text-base " +
  (status === "cleared"
    ? "bg-emerald text-parchment border-emeraldDark"
    : status === "available"
    ? "bg-gold text-ink border-gold"
    : "bg-parchmentDark text-ink border-gold opacity-60");

export default function LevelTracker({ levels, statusFor }: LevelTrackerProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
      {levels.map((level) => (
        <div key={level.id} className="flex flex-col items-center gap-1">
          <span className={circleClasses(statusFor(level.id))}>{level.id}</span>
          <small className="text-xs text-ink text-center max-w-[5rem]">{level.title}</small>
        </div>
      ))}
    </div>
  );
}

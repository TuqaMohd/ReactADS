import { NavLink } from "react-router-dom";
import type { ComparisonPoint } from "../types";

interface TopicSelectorProps {
  topics: ComparisonPoint[];
}

export default function TopicSelector({ topics }: TopicSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {topics.map((topic) => (
        <NavLink
          key={topic.id}
          to={`/dashboard/topic/${topic.id}`}
          className={({ isActive }) =>
            "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border text-xs sm:text-sm font-bold " +
            (isActive
              ? "bg-emerald text-parchmentDark border-emeraldDark shadow-md shadow-emerald"
              : "bg-parchmentDark border-gold text-ink transition duration-300 ease-in-out hover:scale-105 ")
          }
        >
          {topic.title}
        </NavLink>
      ))}
    </div>
  );
}

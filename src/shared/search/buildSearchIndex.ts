import { comparisons } from "../../features/dashboard/data";
import { trialLevels } from "../../features/quest/data";
import { getLevelStatus } from "../../features/quest/questProgress";

export interface SearchResult {
  id: string;
  label: string;
  category: "Dashboard" | "Quest" | "Library";
  path: string;

  keywords: string;
}

const libraryResults: SearchResult[] = [
  {
    id: "library-data-table",
    label: "Data Table",
    category: "Library",
    path: "/library/data-table",
    keywords: "data table pagination sorting filtering search grid"
  },
  {
    id: "library-components",
    label: "Component Library",
    category: "Library",
    path: "/library/components",
    keywords: "components appbar drawer tabs table list alert snackbar dialog select checkbox radio"
  }
];

export function getSearchIndex(cleared: number[]): SearchResult[] {
  const dashboardResults: SearchResult[] = comparisons.map((topic) => ({
    id: `dashboard-${topic.id}`,
    label: topic.title,
    category: "Dashboard",
    path: `/dashboard/topic/${topic.id}`,
    keywords: topic.title.toLowerCase()
  }));

  const questResults: SearchResult[] = trialLevels
    .filter((level) => getLevelStatus(level.id, cleared) !== "locked")
    .map((level) => ({
      id: `quest-${level.id}`,
      label: level.title,
      category: "Quest",
      path: `/quest/level/${level.id}`,
      keywords: level.title.toLowerCase()
    }));

  return [...dashboardResults, ...questResults, ...libraryResults];
}

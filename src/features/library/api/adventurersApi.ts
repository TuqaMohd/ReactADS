import { adventurers } from "../data/adventurers";
import type { Adventurer, AdventurerStatus } from "../types";

export interface FetchAdventurersParams {
  page: number;
  pageSize: number;
  sortField?: keyof Adventurer;
  sortDirection?: "asc" | "desc";
  status?: AdventurerStatus | "all";
  search?: string;
}

export interface FetchAdventurersResult {
  rows: Adventurer[];
  totalCount: number;
}

const SIMULATED_LATENCY_MS = 350;

export function fetchAdventurers(params: FetchAdventurersParams): Promise<FetchAdventurersResult> {
  const { page, pageSize, sortField, sortDirection = "asc", status = "all", search = "" } = params;

  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = adventurers;

      if (status !== "all") {
        filtered = filtered.filter((row) => row.status === status);
      }

      const query = search.trim().toLowerCase();
      if (query) {
        filtered = filtered.filter(
          (row) => row.name.toLowerCase().includes(query) || row.game.toLowerCase().includes(query)
        );
      }

      if (sortField) {
        filtered = [...filtered].sort((a, b) => {
          const left = a[sortField];
          const right = b[sortField];
          const comparison = typeof left === "number" && typeof right === "number"
            ? left - right
            : String(left).localeCompare(String(right));
          return sortDirection === "asc" ? comparison : -comparison;
        });
      }

      const start = page * pageSize;
      const rows = filtered.slice(start, start + pageSize);

      resolve({ rows, totalCount: filtered.length });
    }, SIMULATED_LATENCY_MS);
  });
}

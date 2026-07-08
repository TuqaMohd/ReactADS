import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSearchIndex, type SearchResult } from "../shared/search/buildSearchIndex";
import { useQuestProgress } from "../features/quest/QuestProgressContext";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { cleared } = useQuestProgress();

  const containerRef = useRef<HTMLDivElement>(null);

  const index = useMemo(() => getSearchIndex(cleared), [cleared]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return index.filter((item) => item.keywords.includes(trimmed)).slice(0, 6);
  }, [query, index]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(result: SearchResult) {
    navigate(
      { pathname: result.path, search: "?ref=search" },
      { state: { from: "search", query } }
    );
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full sm:w-64">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query && setOpen(true)}
        placeholder="Search topics or levels..."
        aria-label="Search dashboard topics and quest levels"
        className="w-full px-3 py-1.5 rounded-full bg-parchment text-ink text-sm outline-none border-2 border-gold placeholder:text-ink/50 focus:border-goldBright transition-colors"
      />

      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 z-30 mt-1 bg-parchment border-2 border-gold rounded-lg shadow-lg overflow-hidden">
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                onClick={() => handleSelect(result)}
                className="w-full flex items-center justify-between gap-2 text-left px-3 py-2 text-sm text-ink hover:bg-goldBright/40 transition-colors"
              >
                <span>{result.label}</span>
                <span className="text-[10px] uppercase tracking-wide text-emeraldDark font-bold shrink-0">
                  {result.category}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute left-0 right-0 z-30 mt-1 bg-parchment border-2 border-gold rounded-lg shadow-lg px-3 py-2 text-xs text-ink/70">
          No matches for "{query}"
        </div>
      )}
    </div>
  );
}

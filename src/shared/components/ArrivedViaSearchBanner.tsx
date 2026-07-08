import { useLocation, useSearchParams } from "react-router-dom";

interface SearchNavigationState {
  from?: string;
  query?: string;
}

export default function ArrivedViaSearchBanner() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const state = location.state as SearchNavigationState | null;

  const ref = searchParams.get("ref");
  if (ref !== "search") return null;

  return (
    <p className="mb-3 text-xs sm:text-sm text-emeraldDark bg-goldBright/30 border border-gold rounded px-3 py-1.5 inline-block">
      Landed here from a search{state?.query ? ` for "${state.query}"` : ""}.
    </p>
  );
}

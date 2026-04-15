import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMulti, Media } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import MediaGrid from "@/components/MediaGrid";
import LoadingGrid from "@/components/LoadingGrid";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(q);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    searchMulti(q).then((r) => {
      setResults(r.results.filter((m) => m.media_type !== "person" && m.poster_path));
      setLoading(false);
    });
  }, [q]);

  return (
    <>
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
          }}
          className="mb-8"
        >
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, series, anime..."
              className="w-full bg-secondary border border-border rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </form>

        {q && <h1 className="text-2xl font-display font-bold mb-6">Results for "{q}"</h1>}
        {loading ? <LoadingGrid /> : results.length > 0 ? <MediaGrid items={results} /> : q && <p className="text-muted-foreground">No results found.</p>}
      </div>
    </>
  );
}

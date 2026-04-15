import { useEffect, useState } from "react";
import { getPopular, getTopRated, Media } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import MediaGrid from "@/components/MediaGrid";
import LoadingGrid from "@/components/LoadingGrid";

export default function SeriesPage() {
  const [series, setSeries] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"popular" | "top_rated">("popular");

  useEffect(() => {
    setLoading(true);
    const fn = tab === "popular" ? getPopular : getTopRated;
    fn("tv", String(page)).then((r) => {
      setSeries(r.results);
      setLoading(false);
    });
  }, [tab, page]);

  return (
    <>
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">
        <h1 className="text-3xl font-display font-bold mb-6">TV Series</h1>
        <div className="flex gap-2 mb-6">
          {(["popular", "top_rated"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? "bg-gold text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
              }`}
            >
              {t === "popular" ? "Popular" : "Top Rated"}
            </button>
          ))}
        </div>
        {loading ? <LoadingGrid /> : <MediaGrid items={series} type="tv" />}
        <div className="flex justify-center gap-2 mt-8">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 bg-secondary rounded-lg text-sm disabled:opacity-30 hover:bg-surface-hover transition-colors">Previous</button>
          <span className="px-4 py-2 text-sm text-muted-foreground">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-surface-hover transition-colors">Next</button>
        </div>
      </div>
    </>
  );
}

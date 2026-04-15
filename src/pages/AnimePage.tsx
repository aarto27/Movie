import { useEffect, useState } from "react";
import { getAnime, Media } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import MediaGrid from "@/components/MediaGrid";
import LoadingGrid from "@/components/LoadingGrid";

export default function AnimePage() {
  const [anime, setAnime] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getAnime(String(page)).then((r) => {
      setAnime(r.results);
      setLoading(false);
    });
  }, [page]);

  return (
    <>
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">
        <h1 className="text-3xl font-display font-bold mb-6">Anime</h1>
        {loading ? <LoadingGrid /> : <MediaGrid items={anime} type="tv" />}
        <div className="flex justify-center gap-2 mt-8">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 bg-secondary rounded-lg text-sm disabled:opacity-30 hover:bg-surface-hover transition-colors">Previous</button>
          <span className="px-4 py-2 text-sm text-muted-foreground">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-surface-hover transition-colors">Next</button>
        </div>
      </div>
    </>
  );
}

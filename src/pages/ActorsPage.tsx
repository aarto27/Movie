import { useEffect, useState } from "react";
import { getPopularActors, Actor, getPoster } from "@/lib/tmdb";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import LoadingGrid from "@/components/LoadingGrid";

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getPopularActors(String(page)).then((r) => {
      setActors(r.results);
      setLoading(false);
    });
  }, [page]);

  return (
    <>
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">
        <h1 className="text-3xl font-display font-bold mb-6">Popular Actors</h1>
        {loading ? (
          <LoadingGrid />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {actors.map((actor) => (
              <motion.div
                key={actor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <Link to={`/actor/${actor.id}`} className="block text-center group">
                  <img
                    src={getPoster(actor.profile_path, "w342")}
                    alt={actor.name}
                    className="w-full aspect-[2/3] object-cover rounded-lg bg-secondary group-hover:ring-2 ring-gold transition-all"
                  />
                  <p className="mt-2 text-sm font-medium group-hover:text-gold transition-colors">{actor.name}</p>
                  <p className="text-xs text-muted-foreground">{actor.known_for_department}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        <div className="flex justify-center gap-2 mt-8">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 bg-secondary rounded-lg text-sm disabled:opacity-30 hover:bg-surface-hover transition-colors">Previous</button>
          <span className="px-4 py-2 text-sm text-muted-foreground">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-surface-hover transition-colors">Next</button>
        </div>
      </div>
    </>
  );
}

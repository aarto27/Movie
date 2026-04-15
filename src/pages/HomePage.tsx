import { useEffect, useState } from "react";
import { getTrending, getPopular, getTopRated, getAnime, Media } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MediaRow from "@/components/MediaRow";

export default function HomePage() {
  const [trending, setTrending] = useState<Media[]>([]);
  const [popularMovies, setPopularMovies] = useState<Media[]>([]);
  const [popularSeries, setPopularSeries] = useState<Media[]>([]);
  const [topMovies, setTopMovies] = useState<Media[]>([]);
  const [anime, setAnime] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTrending("all"),
      getPopular("movie"),
      getPopular("tv"),
      getTopRated("movie"),
      getAnime(),
    ]).then(([t, pm, ps, tm, a]) => {
      setTrending(t.results);
      setPopularMovies(pm.results);
      setPopularSeries(ps.results);
      setTopMovies(tm.results);
      setAnime(a.results);
      setLoading(false);
    });
  }, []);

  const hero = trending[0];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {hero && <HeroBanner media={hero} />}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 space-y-6 pb-20">
        <MediaRow title="Trending This Week" items={trending} />
        <MediaRow title="Popular Movies" items={popularMovies} type="movie" />
        <MediaRow title="Popular Series" items={popularSeries} type="tv" />
        <MediaRow title="Top Rated Movies" items={topMovies} type="movie" />
        <MediaRow title="Anime" items={anime} type="tv" />
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetails, MediaDetails, getTitle, getBackdrop, getPoster, getYear } from "@/lib/tmdb";
import { Star, Clock, Calendar, Play } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import MediaRow from "@/components/MediaRow";

export default function DetailPage({ type }: { type: "movie" | "tv" }) {
  const { id } = useParams();
  const [detail, setDetail] = useState<MediaDetails | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [server, setServer] = useState<"vidsrc" | "vidsrcto" | "2embed" | "superembed">("vidsrc");

  useEffect(() => {
    if (!id) return;
    setDetail(null);
    setShowPlayer(false);
    getDetails(type, Number(id)).then(setDetail);
    window.scrollTo(0, 0);
  }, [type, id]);

  if (!detail) {
    return (
      <>
        <Navbar />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  const backdrop = getBackdrop(detail.backdrop_path);
  const trailer = detail.videos?.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
  const embedId = detail.id;
  const playerUrl =
    type === "movie"
      ? `https://www.2embed.cc/embed/${embedId}`
      : `https://www.2embed.cc/embedtvfull/${embedId}`;

  return (
    <>
      <Navbar />

      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        {backdrop && <img src={backdrop} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-40 relative z-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={getPoster(detail.poster_path, "w500")}
              alt={getTitle(detail)}
              className="w-56 rounded-xl shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-2">{getTitle(detail)}</h1>
            {detail.tagline && <p className="text-gold text-sm italic mb-4">"{detail.tagline}"</p>}

            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-gold fill-gold" />
                {detail.vote_average.toFixed(1)}
              </span>
              {detail.runtime && (
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {detail.runtime} min
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {getYear(detail)}
              </span>
              {detail.number_of_seasons && (
                <span>{detail.number_of_seasons} Seasons</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {detail.genres.map((g) => (
                <span key={g.id} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-secondary-foreground leading-relaxed mb-6 max-w-2xl">{detail.overview}</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPlayer(true)}
                className="inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition"
              >
                <Play size={18} fill="currentColor" />
                Watch Now
              </button>
              {trailer && (
                <a
                  href={`https://youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-medium px-6 py-3 rounded-lg hover:bg-surface-hover transition"
                >
                  <Play size={18} />
                  Trailer
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Embedded Player */}
        {showPlayer && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.95 }}
            animate={{ opacity: 1, scaleY: 1 }}
            className="mt-10 rounded-xl overflow-hidden bg-secondary"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-muted">
              <span className="text-sm font-medium">Now Playing</span>
              <button onClick={() => setShowPlayer(false)} className="text-muted-foreground hover:text-foreground text-sm">
                Close ✕
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                key={playerUrl}
                src={playerUrl}
                title={`${getTitle(detail)} player`}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                referrerPolicy="origin-when-cross-origin"
              />
            </div>
          </motion.div>
        )}

        {/* Cast */}
        {detail.credits?.cast && detail.credits.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gold rounded-full" /> Cast
            </h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {detail.credits.cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="flex-shrink-0 w-24 text-center">
                  <img
                    src={getPoster(actor.profile_path, "w185")}
                    alt={actor.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto bg-secondary"
                  />
                  <p className="text-xs font-medium mt-2 truncate">{actor.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {detail.similar?.results && detail.similar.results.length > 0 && (
          <div className="mt-8">
            <MediaRow title="You May Also Like" items={detail.similar.results} type={type} />
          </div>
        )}
      </div>
    </>
  );
}

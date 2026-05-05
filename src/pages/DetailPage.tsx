import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetails, getSeason, MediaDetails, SeasonDetails, getTitle, getBackdrop, getPoster, getYear } from "@/lib/tmdb";
import { Star, Clock, Calendar, Play, X } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import MediaRow from "@/components/MediaRow";

export default function DetailPage({ type }: { type: "movie" | "tv" }) {
  const { id } = useParams();
  const [detail, setDetail] = useState<MediaDetails | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [server, setServer] = useState<"vidsrc" | "vidsrcto" | "2embed" | "superembed">("vidsrc");
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasonData, setSeasonData] = useState<SeasonDetails | null>(null);

  useEffect(() => {
    if (!id) return;
    setDetail(null);
    setShowPlayer(false);
    setShowTrailer(false);
    setSeason(1);
    setEpisode(1);
    getDetails(type, Number(id)).then(setDetail);
    window.scrollTo(0, 0);
  }, [type, id]);

  useEffect(() => {
    if (type !== "tv" || !detail) return;
    setSeasonData(null);
    getSeason(detail.id, season).then(setSeasonData).catch(() => setSeasonData(null));
  }, [type, detail, season]);

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
  const trailer = detail.videos?.results.find((v) => v.type === "Trailer" && v.site === "YouTube")
    || detail.videos?.results.find((v) => v.site === "YouTube");
  const embedId = detail.id;
  const seasonsList = (detail.seasons || []).filter((s) => s.season_number > 0);
  const playerUrl = (() => {
    if (server === "vidsrc") {
      return type === "movie"
        ? `https://vidsrc.xyz/embed/movie?tmdb=${embedId}`
        : `https://vidsrc.xyz/embed/tv?tmdb=${embedId}&season=${season}&episode=${episode}`;
    }
    if (server === "vidsrcto") {
      return type === "movie"
        ? `https://vidsrc.to/embed/movie/${embedId}`
        : `https://vidsrc.to/embed/tv/${embedId}/${season}/${episode}`;
    }
    if (server === "superembed") {
      return type === "movie"
        ? `https://multiembed.mov/?video_id=${embedId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${embedId}&tmdb=1&s=${season}&e=${episode}`;
    }
    return type === "movie"
      ? `https://www.2embed.cc/embed/${embedId}`
      : `https://www.2embed.cc/embedtv/${embedId}&s=${season}&e=${episode}`;
  })();

  const totalEpisodes = seasonData?.episodes.length || 0;
  const hasPrev = type === "tv" && (episode > 1 || season > 1);
  const hasNext = type === "tv" && (episode < totalEpisodes || season < seasonsList.length);
  const goPrev = () => {
    if (episode > 1) setEpisode(episode - 1);
    else if (season > 1) { setSeason(season - 1); setEpisode(1); }
  };
  const goNext = () => {
    if (episode < totalEpisodes) setEpisode(episode + 1);
    else if (season < seasonsList.length) { setSeason(season + 1); setEpisode(1); }
  };

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
          <div className="flex-shrink-0">
            <img
              src={getPoster(detail.poster_path, "w500")}
              alt={getTitle(detail)}
              className="w-56 rounded-xl shadow-2xl"
            />
          </div>

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
              {detail.number_of_seasons && <span>{detail.number_of_seasons} Seasons</span>}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {detail.genres.map((g) => (
                <span key={g.id} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-secondary-foreground leading-relaxed mb-6 max-w-2xl">{detail.overview}</p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setShowPlayer(true)}
                className="inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition"
              >
                <Play size={18} fill="currentColor" />
                Watch Now
              </button>
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-medium px-6 py-3 rounded-lg hover:bg-surface-hover transition"
                >
                  <Play size={18} />
                  Watch Trailer
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Episode picker */}
        {type === "tv" && seasonsList.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gold rounded-full" /> Episodes
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <label className="text-sm text-muted-foreground">Season:</label>
              <select
                value={season}
                onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(1); }}
                className="bg-secondary text-secondary-foreground rounded-lg px-3 py-2 text-sm border border-border"
              >
                {seasonsList.map((s) => (
                  <option key={s.id} value={s.season_number}>
                    {s.name} ({s.episode_count} eps)
                  </option>
                ))}
              </select>
            </div>

            {seasonData ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {seasonData.episodes.map((ep) => {
                  const active = ep.episode_number === episode;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => { setEpisode(ep.episode_number); setShowPlayer(true); }}
                      className={`text-left rounded-lg overflow-hidden bg-secondary border transition group ${
                        active ? "border-gold ring-2 ring-gold/40" : "border-border hover:border-gold/60"
                      }`}
                    >
                      <div className="aspect-video bg-muted relative">
                        {ep.still_path ? (
                          <img src={getPoster(ep.still_path, "w300")} alt={ep.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No preview</div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 group-hover:opacity-100 transition">
                          <Play size={28} className="text-gold" fill="currentColor" />
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gold font-medium">EP {ep.episode_number}</p>
                        <p className="text-sm font-medium truncate">{ep.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Loading episodes…</div>
            )}
          </section>
        )}

        {/* Embedded Player (fullscreen modal) */}
        {showPlayer && (
          <div className="fixed inset-0 z-50 bg-background flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-muted border-b border-border">
              <span className="text-sm font-medium truncate">
                {getTitle(detail)}{type === "tv" ? ` — S${season} E${episode}` : ""}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {type === "tv" && (
                  <>
                    <button
                      onClick={goPrev}
                      disabled={!hasPrev}
                      className="text-xs px-3 py-1 rounded bg-secondary text-secondary-foreground hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={goNext}
                      disabled={!hasNext}
                      className="text-xs px-3 py-1 rounded bg-gold text-primary-foreground hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </>
                )}
                <span className="text-xs text-muted-foreground ml-1">Server:</span>
                {(["vidsrc", "vidsrcto", "2embed", "superembed"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setServer(s)}
                    className={`text-xs px-2 py-1 rounded ${
                      server === s ? "bg-gold text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <button
                  onClick={() => setShowPlayer(false)}
                  className="text-muted-foreground hover:text-foreground text-sm ml-2 inline-flex items-center gap-1"
                >
                  <X size={16} /> Close
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black">
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
          </div>
        )}

        {/* Trailer modal with autoplay */}
        {showTrailer && trailer && (
          <div
            className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4"
            onClick={() => setShowTrailer(false)}
          >
            <div
              className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-2 right-2 z-10 bg-background/70 hover:bg-background text-foreground rounded-full p-2"
                aria-label="Close trailer"
              >
                <X size={18} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
                title={`${getTitle(detail)} trailer`}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
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

        {detail.similar?.results && detail.similar.results.length > 0 && (
          <div className="mt-8">
            <MediaRow title="You May Also Like" items={detail.similar.results} type={type} />
          </div>
        )}
      </div>
    </>
  );
}

import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Media, getTitle, getBackdrop } from "@/lib/tmdb";

export default function HeroBanner({ media }: { media: Media }) {
  const backdrop = getBackdrop(media.backdrop_path);
  const type = media.media_type === "tv" ? "series" : "movie";

  return (
    <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {backdrop && (
        <img
          src={backdrop}
          alt={getTitle(media)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 max-w-2xl leading-tight">
            {getTitle(media)}
          </h1>
          <p className="text-sm md:text-base text-secondary-foreground max-w-lg mb-6 line-clamp-3">
            {media.overview}
          </p>
          <div className="flex items-center gap-3">
            <Link
              to={`/${type}/${media.id}`}
              className="inline-flex items-center gap-2 bg-gold text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition"
            >
              <Play size={18} fill="currentColor" />
              Watch Now
            </Link>
            <Link
              to={`/${type}/${media.id}`}
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-medium px-6 py-3 rounded-lg hover:bg-surface-hover transition"
            >
              <Info size={18} />
              Details
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

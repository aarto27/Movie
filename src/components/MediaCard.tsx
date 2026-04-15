import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Media, getTitle, getPoster, getYear } from "@/lib/tmdb";

interface Props {
  media: Media;
  type?: "movie" | "tv";
}

export default function MediaCard({ media, type }: Props) {
  const mediaType = type || media.media_type || "movie";
  const href = `/${mediaType === "tv" ? "series" : "movie"}/${media.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group flex-shrink-0 w-[160px] sm:w-[185px]"
    >
      <Link to={href} className="block">
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
          <img
            src={getPoster(media.poster_path)}
            alt={getTitle(media)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {media.vote_average > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs font-medium">
              <Star size={12} className="text-gold fill-gold" />
              {media.vote_average.toFixed(1)}
            </div>
          )}
        </div>
        <div className="mt-2 px-0.5">
          <p className="text-sm font-medium text-foreground truncate group-hover:text-gold transition-colors">
            {getTitle(media)}
          </p>
          <p className="text-xs text-muted-foreground">{getYear(media)}</p>
        </div>
      </Link>
    </motion.div>
  );
}

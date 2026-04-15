import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Media } from "@/lib/tmdb";
import MediaCard from "./MediaCard";

interface Props {
  title: string;
  items: Media[];
  type?: "movie" | "tv";
}

export default function MediaRow({ title, items, type }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="relative py-4">
      <h2 className="text-xl font-display font-semibold mb-4 px-4 md:px-0 flex items-center gap-2">
        <span className="w-1 h-6 bg-gold rounded-full" />
        {title}
      </h2>
      <div className="relative group/row">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-8 z-10 w-10 bg-gradient-to-r from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ChevronLeft className="text-foreground" />
        </button>
        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-0 pb-2"
        >
          {items.map((m) => (
            <MediaCard key={m.id} media={m} type={type} />
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-8 z-10 w-10 bg-gradient-to-l from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ChevronRight className="text-foreground" />
        </button>
      </div>
    </section>
  );
}

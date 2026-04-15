import { Media } from "@/lib/tmdb";
import MediaCard from "./MediaCard";

interface Props {
  items: Media[];
  type?: "movie" | "tv";
}

export default function MediaGrid({ items, type }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((m) => (
        <div key={m.id} className="w-full">
          <MediaCard media={m} type={type} />
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActorDetails, getPoster, getTitle, Media } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import MediaRow from "@/components/MediaRow";

export default function ActorDetailPage() {
  const { id } = useParams();
  const [actor, setActor] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    getActorDetails(Number(id)).then(setActor);
    window.scrollTo(0, 0);
  }, [id]);

  if (!actor) {
    return (
      <>
        <Navbar />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  const credits: Media[] = actor.combined_credits?.cast
    ?.filter((m: Media) => m.poster_path)
    .sort((a: Media, b: Media) => b.vote_average - a.vote_average)
    .slice(0, 20) || [];

  return (
    <>
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <img
            src={getPoster(actor.profile_path, "w500")}
            alt={actor.name}
            className="w-56 rounded-xl shadow-2xl flex-shrink-0"
          />
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">{actor.name}</h1>
            {actor.birthday && (
              <p className="text-sm text-muted-foreground mb-2">
                Born: {actor.birthday} {actor.place_of_birth && `• ${actor.place_of_birth}`}
              </p>
            )}
            <p className="text-secondary-foreground leading-relaxed max-w-2xl">{actor.biography || "No biography available."}</p>
          </div>
        </div>
        {credits.length > 0 && <MediaRow title="Known For" items={credits} />}
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { Media, getTitle, getPoster } from "@/lib/tmdb";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<(Media & { mediaType: string })[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cinewave_favorites") || "[]");
    setFavorites(stored);
  }, []);

  const remove = (id: number) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("cinewave_favorites", JSON.stringify(updated));
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 pb-20">
        <h1 className="text-3xl font-display font-bold mb-6">My Favorites</h1>
        {favorites.length === 0 ? (
          <p className="text-muted-foreground">No favorites yet. Browse and add some!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((m) => (
              <div key={m.id} className="relative group">
                <Link to={`/${m.mediaType === "tv" ? "series" : "movie"}/${m.id}`}>
                  <img src={getPoster(m.poster_path)} alt={getTitle(m)} className="w-full aspect-[2/3] object-cover rounded-lg" />
                  <p className="text-sm font-medium mt-2 truncate">{getTitle(m)}</p>
                </Link>
                <button
                  onClick={() => remove(m.id)}
                  className="absolute top-2 right-2 p-1.5 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} className="text-destructive-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

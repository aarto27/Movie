import { Link, useLocation } from "react-router-dom";
import { Film, Tv, Users, Search, Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: Sparkles },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/series", label: "Series", icon: Tv },
  { to: "/anime", label: "Anime", icon: Sparkles },
  { to: "/actors", label: "Actors", icon: Users },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight text-gold">
          CINEWAVE
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === to
                  ? "text-gold bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, series..."
                className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold w-48"
                onBlur={() => !query && setSearchOpen(false)}
              />
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <Search size={20} />
            </button>
          )}
          <Link
            to="/favorites"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            <Heart size={20} />
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center justify-around border-t border-border/50 py-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 text-xs transition-colors ${
              pathname === to ? "text-gold" : "text-muted-foreground"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

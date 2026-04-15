const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MjFmZTUxZTI0NjY5ZmE4MDNmMzlkMDZkNGQzNmQ3MyIsIm5iZiI6MTc3NjI2NzQzOC4xNzUsInN1YiI6IjY5ZGZiMGFlYzU4NTE1NzlhMjJkOThkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8pqfudgGKILsO-zcH1UlL5TrHDYUIH568Tg25SFxLE8";
const BASE = "https://api.themoviedb.org/3";

export const IMG_BASE = "https://image.tmdb.org/t/p";

export interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids?: number[];
}

export interface MediaDetails extends Media {
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string;
  status: string;
  videos?: { results: { key: string; type: string; site: string }[] };
  credits?: { cast: Actor[] };
  similar?: { results: Media[] };
}

export interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  known_for_department?: string;
  known_for?: Media[];
}

async function fetchTMDB<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
  });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export const getTrending = (type: "movie" | "tv" | "all" = "all", page = "1") =>
  fetchTMDB<{ results: Media[] }>(`/trending/${type}/week`, { page });

export const getPopular = (type: "movie" | "tv", page = "1") =>
  fetchTMDB<{ results: Media[]; total_pages: number }>(`/${type}/popular`, { page });

export const getTopRated = (type: "movie" | "tv", page = "1") =>
  fetchTMDB<{ results: Media[]; total_pages: number }>(`/${type}/top_rated`, { page });

export const getDetails = (type: "movie" | "tv", id: number) =>
  fetchTMDB<MediaDetails>(`/${type}/${id}`, { append_to_response: "videos,credits,similar" });

export const searchMulti = (query: string, page = "1") =>
  fetchTMDB<{ results: Media[]; total_pages: number }>("/search/multi", { query, page });

export const getAnime = (page = "1") =>
  fetchTMDB<{ results: Media[]; total_pages: number }>("/discover/tv", {
    with_genres: "16",
    with_original_language: "ja",
    sort_by: "popularity.desc",
    page,
  });

export const getPopularActors = (page = "1") =>
  fetchTMDB<{ results: Actor[]; total_pages: number }>("/person/popular", { page });

export const getActorDetails = (id: number) =>
  fetchTMDB<Actor & { biography: string; birthday: string; place_of_birth: string; combined_credits: { cast: Media[] } }>(
    `/person/${id}`,
    { append_to_response: "combined_credits" }
  );

export const getTitle = (m: Media) => m.title || m.name || "Untitled";
export const getYear = (m: Media) => (m.release_date || m.first_air_date || "").slice(0, 4);
export const getPoster = (path: string | null, size = "w342") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder.svg";
export const getBackdrop = (path: string | null, size = "original") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

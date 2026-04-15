import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import AnimePage from "./pages/AnimePage";
import DetailPage from "./pages/DetailPage";
import SearchPage from "./pages/SearchPage";
import ActorsPage from "./pages/ActorsPage";
import ActorDetailPage from "./pages/ActorDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/movie/:id" element={<DetailPage type="movie" />} />
          <Route path="/series/:id" element={<DetailPage type="tv" />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/actors" element={<ActorsPage />} />
          <Route path="/actor/:id" element={<ActorDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

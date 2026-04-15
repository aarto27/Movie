export default function LoadingGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-secondary rounded-lg" />
          <div className="mt-2 h-4 bg-secondary rounded w-3/4" />
          <div className="mt-1 h-3 bg-secondary rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

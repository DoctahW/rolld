"use client";

interface RatingsChartProps {
  ratings: {
    0: number;
    0.5: number;
    1: number;
    1.5: number;
    2: number;
    2.5: number;
    3: number;
    3.5: number;
    4: number;
    4.5: number;
    5: number;
  };
}

export default function RatingsChart({ ratings }: RatingsChartProps) {
  const ratingEntries = Object.entries(ratings)
    .map(([rating, count]) => ({
      rating: parseFloat(rating),
      count,
    }))
    .filter((r) => r.rating > 0)
    .sort((a, b) => a.rating - b.rating);

  const maxCount = Math.max(...ratingEntries.map((r) => r.count));
  const totalCount = ratingEntries.reduce((sum, r) => sum + r.count, 0);

  return (
    <div>
      <h2 className="text-xl font-rpg text-white tracking-wide mb-4">
        Ratings
      </h2>
      <div className="h-px bg-linear-to-r from-gold/30 via-gold/10 to-transparent mb-4"></div>
      <div className="flex items-end justify-between gap-px h-8 mb-1.5">
        {ratingEntries.map(({ rating, count }) => {
          const maxHeight = 32;
          const heightPx =
            maxCount > 0 ? Math.max((count / maxCount) * maxHeight, 2) : 0;
          const percentage =
            totalCount > 0 ? ((count / totalCount) * 100).toFixed(0) : 0;

          return (
            <div
              key={rating}
              className="flex-1 flex flex-col items-center justify-end group relative"
            >
              <div
                className={`w-full ${
                  count > 0
                    ? "bg-primary hover:bg-primary-light"
                    : "bg-dark-lighter/50"
                } transition-colors rounded-sm`}
                style={{
                  height: count > 0 ? `${heightPx}px` : "1px",
                }}
              >
                {count > 0 && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-lighter border border-gold/30 rounded px-2 py-1.5 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                    <div className="text-xs text-white font-serif font-semibold mb-0.5">
                      {rating === 0.5 ||
                      rating === 1.5 ||
                      rating === 2.5 ||
                      rating === 3.5 ||
                      rating === 4.5
                        ? `★`.repeat(Math.floor(rating)) + "½"
                        : `★`.repeat(rating)}
                    </div>
                    <div className="text-xs text-gray-400 font-serif">
                      {count} {count === 1 ? "avaliação" : "avaliações"} (
                      {percentage}%)
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <div className="flex gap-0.5">
          <span className="text-gold">★</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            <span className="text-gold">★</span>
            <span className="text-gold">★</span>
            <span className="text-gold">★</span>
            <span className="text-gold">★</span>
            <span className="text-gold">★</span>
          </div>
          <div className="text-xs font-serif text-gold">
            {(() => {
              if (totalCount === 0) return "—";
              const average =
                ratingEntries.reduce((sum, r) => sum + r.rating * r.count, 0) /
                totalCount;
              return average.toFixed(1);
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

interface RPGCardProps {
  id: number;
  name: string;
  cover: string;
  rating: number;
  date?: string;
}

export default function RPGCard({ name, cover, rating, date }: RPGCardProps) {
  return (
    <div className="shrink-0 group cursor-pointer">
      <div className="w-150px h-225px rounded border border-gold/15 hover:border-gold transition-colors mb-2 bg-linear-to-br from-dark-lighter to-primary-dark/40 flex flex-col items-center justify-center p-3 relative overflow-hidden">
        <div className="text-5xl mb-2">{cover}</div>
        <h3 className="text-white text-xs font-serif font-semibold text-center line-clamp-2 mb-2">
          {name}
        </h3>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-xs ${i < rating ? "text-gold" : "text-gray-700"}`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      {date && (
        <p className="text-xs text-gray-500 text-center font-serif italic">
          {date}
        </p>
      )}
    </div>
  );
}

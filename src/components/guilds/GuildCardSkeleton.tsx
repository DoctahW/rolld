export function GuildCardSkeleton() {
  return (
    <div className="bg-dark-lighter border border-primary/30 rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
      </div>
      <div className="border-t border-primary/20 pt-4 flex justify-between items-center">
        <div>
          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-700 rounded w-12"></div>
        </div>
        <div className="h-10 bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  );
}

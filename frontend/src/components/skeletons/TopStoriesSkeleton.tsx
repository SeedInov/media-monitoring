import React from 'react';

const TopStoriesSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-4 ml-2 bg-gray-200 rounded animate-pulse"></div>
      </h2>

      <div className="grid gap-6">
        {/* Featured Article Skeleton */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="flex flex-col">
            <div className="h-64 w-full bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Other Articles Skeletons */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden">
            <div className="flex items-center p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-20 w-20 ml-4 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopStoriesSkeleton;

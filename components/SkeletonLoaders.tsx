import React from 'react';

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-6 animate-pulse">
      {Array(count).fill(null).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-1/3"></div>
          <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array(rows).fill(null).map((_, i) => (
        <div key={i} className="flex gap-3">
          {Array(cols).fill(null).map((_, j) => (
            <div key={j} className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded mb-4 w-1/3"></div>
    <div className="space-y-3">
      <div className="h-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg"></div>
      <div className="h-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg"></div>
      <div className="h-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg w-2/3"></div>
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-3 gap-6">
      {Array(3).fill(null).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-lg mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-96">
      <div className="h-full bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg"></div>
    </div>
  </div>
);

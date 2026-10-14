import React from 'react';
import { Skeleton, SkeletonCircle } from './SkeletonPrimitives';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-0 flex flex-col overflow-hidden shadow-xs relative">
      {/* Image Area with placeholders */}
      <div className="w-full aspect-square bg-slate-100 p-4 relative flex items-center justify-center overflow-hidden">
        {/* Wishlist pill top right */}
        <div className="absolute top-3 right-3 z-10">
          <SkeletonCircle size="w-8 h-8" className="bg-white/80" />
        </div>

        {/* Badge placeholder top left */}
        <div className="absolute top-3 left-3 z-10">
          <Skeleton className="h-5 w-20 rounded-md bg-slate-200/90" />
        </div>

        {/* Product image silhouette */}
        <Skeleton className="w-3/4 h-3/4 rounded-xl bg-slate-200/70" />
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Brand & Category line */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>

          {/* Product Title (2 lines) */}
          <div className="space-y-1.5 pt-0.5">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>

          {/* Rating Pill + Review Count */}
          <div className="flex items-center space-x-2 pt-1">
            <Skeleton className="h-5 w-12 rounded-md bg-emerald-100/70" />
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-16 ml-auto rounded bg-emerald-50" />
          </div>
        </div>

        <div className="pt-2 space-y-3">
          {/* Price details line */}
          <div className="flex items-baseline space-x-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-14 rounded bg-emerald-100/70" />
          </div>

          {/* Quick Add To Cart Button */}
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

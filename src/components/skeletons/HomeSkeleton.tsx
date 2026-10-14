import React from 'react';
import { Skeleton, SkeletonCircle } from './SkeletonPrimitives';
import { ProductCardSkeleton } from './ProductCardSkeleton';

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 animate-fade-in" aria-busy="true" aria-label="Loading homepage content">
      {/* 1. Hero Carousel Banner Skeleton */}
      <section className="relative overflow-hidden rounded-3xl mx-4 max-w-7xl lg:mx-auto mt-4 shadow-xl">
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-10 md:p-14 text-white min-h-[320px] sm:min-h-[380px] flex items-center justify-between">
          <div className="max-w-xl z-10 space-y-4 w-full">
            {/* Badge pill */}
            <Skeleton className="h-6 w-36 rounded-full" variant="dark" />

            {/* Title (2 lines) */}
            <div className="space-y-2.5">
              <Skeleton className="h-9 sm:h-12 w-4/5 rounded-xl" variant="dark" />
              <Skeleton className="h-9 sm:h-12 w-3/5 rounded-xl" variant="dark" />
            </div>

            {/* Tagline */}
            <Skeleton className="h-5 w-2/3 rounded-lg" variant="dark" />

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Skeleton className="h-11 w-40 rounded-xl" variant="dark" />
              <Skeleton className="h-10 w-56 rounded-xl" variant="dark" />
            </div>
          </div>

          {/* Right Product Spotlight Image Skeleton */}
          <div className="hidden md:block w-72 lg:w-96 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 shrink-0">
            <Skeleton className="w-full h-full" variant="dark" />
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
            <Skeleton className="h-2 w-8 rounded-full" variant="dark" />
            <Skeleton className="h-2 w-2 rounded-full" variant="dark" />
            <Skeleton className="h-2 w-2 rounded-full" variant="dark" />
          </div>
        </div>
      </section>

      {/* 2. Category Bubbles Grid Skeleton */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-3.5 w-64 rounded" />
          </div>
          <Skeleton className="h-4 w-16 rounded" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-2xl border border-slate-200/80 text-left flex flex-col items-center sm:items-start space-y-2.5"
            >
              <Skeleton className="w-11 h-11 rounded-xl bg-slate-100" />
              <Skeleton className="h-3.5 w-16 rounded" />
              <Skeleton className="h-2.5 w-24 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Deal of the Day Banner Skeleton */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-red-600/90 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <SkeletonCircle size="w-12 h-12" variant="dark" className="bg-white/20" />
              <div className="space-y-1.5 flex-1 sm:flex-initial">
                <Skeleton className="h-4 w-28 rounded" variant="dark" />
                <Skeleton className="h-6 w-64 sm:w-80 rounded-lg" variant="dark" />
              </div>
            </div>

            {/* Countdown Box Skeleton */}
            <div className="flex items-center space-x-2 bg-black/20 px-3 py-2 rounded-2xl border border-white/20">
              <Skeleton className="h-4 w-16 rounded" variant="dark" />
              <Skeleton className="h-7 w-8 rounded-lg" variant="dark" />
              <span className="text-white font-bold">:</span>
              <Skeleton className="h-7 w-8 rounded-lg" variant="dark" />
              <span className="text-white font-bold">:</span>
              <Skeleton className="h-7 w-8 rounded-lg" variant="dark" />
            </div>
          </div>

          {/* Deal Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        </div>
      </section>

      {/* 4. Tech Spotlight Section Skeleton */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-56 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-full bg-blue-100" />
            </div>
            <Skeleton className="h-3.5 w-80 rounded" />
          </div>
          <Skeleton className="h-4 w-20 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      </section>

      {/* 5. Handloom & Indian Crafts Banner Skeleton */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 w-full md:max-w-xl">
            <Skeleton className="h-5 w-48 rounded-md bg-amber-200/70" />
            <Skeleton className="h-7 w-3/4 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>
            <div className="pt-2">
              <Skeleton className="h-10 w-56 rounded-xl bg-amber-200/80" />
            </div>
          </div>

          <div className="flex -space-x-4 overflow-hidden py-2 shrink-0">
            <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-white shadow-md bg-amber-100" />
            <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-white shadow-md bg-amber-200/60" />
            <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-white shadow-md bg-amber-100" />
          </div>
        </div>
      </section>

      {/* 6. Home, Kitchen & Groceries Section Skeleton */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-60 rounded-lg" />
            <Skeleton className="h-3.5 w-72 rounded" />
          </div>
          <Skeleton className="h-4 w-20 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      </section>

      {/* 7. Trust & Guarantee Banner Skeleton */}
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center space-x-4 w-full md:max-w-xl">
            <SkeletonCircle size="w-14 h-14" variant="dark" className="bg-blue-600/30" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3.5 w-36 rounded" variant="dark" />
              <Skeleton className="h-6 w-72 rounded-lg" variant="dark" />
              <Skeleton className="h-4 w-full rounded" variant="dark" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Skeleton className="h-14 w-28 rounded-xl bg-slate-800" variant="dark" />
            <Skeleton className="h-14 w-28 rounded-xl bg-slate-800" variant="dark" />
            <Skeleton className="h-14 w-28 rounded-xl bg-slate-800" variant="dark" />
          </div>
        </div>
      </section>
    </div>
  );
};

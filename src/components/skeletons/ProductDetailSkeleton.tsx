import React from 'react';
import { Skeleton, SkeletonCircle } from './SkeletonPrimitives';
import { ProductCardSkeleton } from './ProductCardSkeleton';

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fade-in" aria-busy="true" aria-label="Loading product details">
      {/* 1. Breadcrumbs Skeleton */}
      <nav className="flex items-center space-x-2 text-xs">
        <Skeleton className="h-3.5 w-12 rounded" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-3.5 w-20 rounded" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-3.5 w-16 rounded" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-3.5 w-36 rounded" />
      </nav>

      {/* 2. Main Product Showcase Grid (5 cols + 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Main Photo Skeleton */}
          <div className="relative aspect-square w-full rounded-2xl bg-slate-100 border border-slate-200 p-6 flex items-center justify-center overflow-hidden">
            {/* Wishlist button placeholder */}
            <div className="absolute top-4 right-4 z-10">
              <SkeletonCircle size="w-10 h-10" className="bg-white shadow-xs" />
            </div>

            {/* Assured badge placeholder */}
            <div className="absolute top-4 left-4 z-10">
              <Skeleton className="h-5 w-24 rounded-md bg-blue-100/70" />
            </div>

            {/* Product Center Silhouette */}
            <Skeleton className="w-4/5 h-4/5 rounded-2xl bg-slate-200/80" />
          </div>

          {/* Thumbnails Row */}
          <div className="flex items-center space-x-3 overflow-x-auto py-1">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="w-16 h-16 rounded-xl border-2 border-slate-100 shrink-0 bg-slate-100"
              />
            ))}
          </div>

          {/* Direct CTA Buttons */}
          <div className="space-y-2 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-12 w-full rounded-xl bg-amber-200/70" />
              <Skeleton className="h-12 w-full rounded-xl bg-blue-200/70" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl bg-slate-100" />
          </div>
        </div>

        {/* Right Column: Details, Pricing, Offers & Specs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            {/* Brand & Seller */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3.5 w-24 rounded bg-blue-100" />
              <span className="text-slate-300">•</span>
              <Skeleton className="h-3.5 w-32 rounded" />
            </div>

            {/* Title (2 lines) */}
            <div className="space-y-2 pt-1">
              <Skeleton className="h-7 w-full rounded-lg" />
              <Skeleton className="h-7 w-3/4 rounded-lg" />
            </div>

            {/* Ratings & Assured pill */}
            <div className="flex items-center space-x-3 pt-2">
              <Skeleton className="h-5 w-14 rounded-md bg-emerald-100" />
              <Skeleton className="h-4 w-48 rounded" />
              <Skeleton className="h-5 w-28 rounded bg-blue-50" />
            </div>
          </div>

          {/* Pricing Box Skeleton */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-baseline space-x-3">
              <Skeleton className="h-9 w-32 rounded-lg" />
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="h-6 w-20 rounded-md bg-emerald-100" />
            </div>
            <Skeleton className="h-3 w-48 rounded" />
            <Skeleton className="h-4 w-60 rounded bg-emerald-50" />
          </div>

          {/* Bank & Payment Offers Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-44 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                <Skeleton className="h-4 w-3/4 rounded bg-blue-100" />
                <Skeleton className="h-3 w-full rounded bg-blue-50" />
              </div>
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1.5">
                <Skeleton className="h-4 w-3/4 rounded bg-amber-100" />
                <Skeleton className="h-3 w-full rounded bg-amber-50" />
              </div>
            </div>
          </div>

          {/* Pincode & Delivery Options Skeleton */}
          <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-32 rounded" />
              <Skeleton className="h-3.5 w-28 rounded bg-emerald-50" />
            </div>
            <div className="flex gap-2 max-w-sm">
              <Skeleton className="h-9 flex-1 rounded-xl" />
              <Skeleton className="h-9 w-20 rounded-xl bg-slate-800" />
            </div>
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3.5 w-56 rounded bg-emerald-50" />
              <Skeleton className="h-3.5 w-48 rounded" />
              <Skeleton className="h-3.5 w-40 rounded" />
            </div>
          </div>

          {/* Key Highlights Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28 rounded" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-5/6 rounded" />
              <Skeleton className="h-3.5 w-4/5 rounded" />
              <Skeleton className="h-3.5 w-3/4 rounded" />
            </div>
          </div>

          {/* Technical Specifications Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28 rounded" />
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="grid grid-cols-3 p-2.5 bg-slate-50/50">
                  <Skeleton className="h-3.5 w-20 rounded" />
                  <Skeleton className="col-span-2 h-3.5 w-36 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Customer Ratings & Reviews Skeleton */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <Skeleton className="h-6 w-52 rounded-lg" />
            <Skeleton className="h-3.5 w-48 rounded" />
          </div>
          <Skeleton className="h-10 w-40 rounded-xl bg-blue-100/70" />
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4 border-b border-slate-100">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <Skeleton className="h-12 w-16 rounded-xl" />
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>

          <div className="md:col-span-2 space-y-2.5 justify-center flex flex-col">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <Skeleton className="w-8 h-3 rounded" />
                <Skeleton className="flex-1 h-2 rounded-full" />
                <Skeleton className="w-12 h-3 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Sample Review Cards Skeleton */}
        <div className="space-y-4 pt-2">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="py-4 space-y-2.5 border-b border-slate-100 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-12 rounded-md bg-emerald-100" />
                  <Skeleton className="h-4 w-44 rounded" />
                </div>
                <Skeleton className="h-3 w-16 rounded" />
              </div>
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-4/5 rounded" />
              <div className="flex items-center space-x-2 pt-1">
                <Skeleton className="h-3 w-28 rounded" />
                <span className="text-slate-300">•</span>
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Similar Products Carousel Skeleton */}
      <section className="space-y-4">
        <Skeleton className="h-6 w-56 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      </section>
    </div>
  );
};

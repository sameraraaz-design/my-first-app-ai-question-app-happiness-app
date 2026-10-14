import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'light' | 'dark';
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'light', style }) => {
  const shimmerClass = variant === 'dark' ? 'skeleton-shimmer-dark' : 'skeleton-shimmer';
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`rounded-xl ${shimmerClass} ${className}`}
    />
  );
};

export const SkeletonText: React.FC<{
  className?: string;
  lines?: number;
  lastLineWidth?: string;
  variant?: 'light' | 'dark';
}> = ({ className = 'h-4', lines = 1, lastLineWidth = '70%', variant = 'light' }) => {
  if (lines === 1) {
    return <Skeleton className={`w-full ${className}`} variant={variant} />;
  }

  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={`${className}`}
          variant={variant}
          // Set width inline or via tailwind if last line
          style={idx === lines - 1 ? { width: lastLineWidth } : { width: '100%' }}
        />
      ))}
    </div>
  );
};

export const SkeletonCircle: React.FC<{
  size?: string;
  className?: string;
  variant?: 'light' | 'dark';
}> = ({ size = 'w-10 h-10', className = '', variant = 'light' }) => {
  const shimmerClass = variant === 'dark' ? 'skeleton-shimmer-dark' : 'skeleton-shimmer';
  return (
    <div
      aria-hidden="true"
      className={`rounded-full ${size} ${shimmerClass} shrink-0 ${className}`}
    />
  );
};

export const SkeletonButton: React.FC<{
  className?: string;
  variant?: 'light' | 'dark';
}> = ({ className = 'h-10 w-28', variant = 'light' }) => {
  return <Skeleton className={`rounded-xl ${className}`} variant={variant} />;
};

import { FC } from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'button';
  width?: string;
  height?: string;
  lines?: number;
}

export const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width = 'w-full',
  height = 'h-4',
  lines = 1,
}) => {
  const baseClasses = `animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200px_100%]`;

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'rounded';
      case 'circular':
        return 'rounded-full';
      case 'button':
        return 'rounded-lg';
      case 'rectangular':
      default:
        return 'rounded-md';
    }
  };

  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()} ${width} ${height} ${
              index === lines - 1 ? 'w-3/4' : ''
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${width} ${height} ${className}`}
    />
  );
};

// Card skeleton for complex layouts
export const CardSkeleton: FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm animate-fade-in ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <LoadingSkeleton variant="circular" width="w-12" height="h-12" />
      <div className="flex-1">
        <LoadingSkeleton variant="text" width="w-1/2" height="h-4" className="mb-2" />
        <LoadingSkeleton variant="text" width="w-1/3" height="h-3" />
      </div>
    </div>
    <LoadingSkeleton variant="text" lines={3} className="mb-4" />
    <LoadingSkeleton variant="button" width="w-24" height="h-8" />
  </div>
);

// Balance skeleton
export const BalanceSkeleton: FC = () => (
  <div className="flex flex-row justify-center items-center space-x-2">
    <LoadingSkeleton variant="text" width="w-20" height="h-6" />
    <LoadingSkeleton variant="text" width="w-8" height="h-4" />
  </div>
);

export default LoadingSkeleton;
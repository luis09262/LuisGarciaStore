import React from 'react';
import { formatReviewsCount } from '../../utils/formatters';

interface RatingStarsProps {
  rating: number; // e.g. 4.8
  reviewsCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewsCount,
  size = 'sm',
  showCount = true,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5 text-[#D48B38]">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const fillPercentage = Math.max(0, Math.min(100, (rating - (starIndex - 1)) * 100));
          const gradientId = `star-grad-${starIndex}-${Math.round(rating * 10)}`;

          return (
            <svg
              key={starIndex}
              width={iconSize}
              height={iconSize}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <defs>
                <linearGradient id={gradientId}>
                  <stop offset={`${fillPercentage}%`} stopColor="#C85A32" />
                  <stop offset={`${fillPercentage}%`} stopColor="#E2DDD5" />
                </linearGradient>
              </defs>
              <path
                d="M10 1.5L12.5 6.7L18.2 7.5L14.1 11.5L15.1 17.2L10 14.5L4.9 17.2L5.9 11.5L1.8 7.5L7.5 6.7L10 1.5Z"
                fill={`url(#${gradientId})`}
                stroke={fillPercentage > 0 ? '#C85A32' : '#D8D2C6'}
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          );
        })}
      </div>

      <span className="text-xs font-semibold text-[#1A1A1A] tabular-nums">
        {rating.toFixed(1)}
      </span>

      {showCount && reviewsCount !== undefined && (
        <span className="text-xs text-[#666059]">
          ({formatReviewsCount(reviewsCount)})
        </span>
      )}
    </div>
  );
};

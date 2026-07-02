'use client';

import type { CSSProperties } from 'react';
import { BarLoader } from 'react-spinners';

export interface PageBarLoaderOptions {
  loading?: boolean;
  color?: string;
  height?: number;
  className?: string;
  style?: CSSProperties;
}

export const pageBarLoaderService = {
  defaultColor: '#fbbf13',
  defaultHeight: 4,

  create(options: PageBarLoaderOptions = {}) {
    return {
      loading: options.loading ?? true,
      color: options.color ?? pageBarLoaderService.defaultColor,
      height: options.height ?? pageBarLoaderService.defaultHeight,
      className: options.className,
      style: options.style,
    };
  },
};

export function PageBarLoader({
  loading = true,
  color = pageBarLoaderService.defaultColor,
  height = pageBarLoaderService.defaultHeight,
  className = '',
  style,
}: PageBarLoaderOptions) {
  if (!loading) return null;

  return (
    <div
      className={`ecap-page-loader ${className}`.trim()}
      style={style}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <BarLoader
        color={color}
        height={height}
        width="100%"
        loading
        cssOverride={{ width: '100%', display: 'block' }}
      />
    </div>
  );
}

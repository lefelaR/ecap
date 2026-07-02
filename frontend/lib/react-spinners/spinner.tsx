'use client';

import type { CSSProperties, ReactNode } from 'react';
import { ClipLoader } from 'react-spinners';

export interface SpinnerOptions {
  loading?: boolean;
  message?: string;
  size?: number;
  color?: string;
  className?: string;
  centered?: boolean;
  style?: CSSProperties;
}

export const spinnerService = {
  defaultColor: '#fbbf13',
  defaultSize: 32,

  create(options: SpinnerOptions = {}) {
    return {
      loading: options.loading ?? true,
      message: options.message,
      size: options.size ?? spinnerService.defaultSize,
      color: options.color ?? spinnerService.defaultColor,
      className: options.className,
      centered: options.centered ?? true,
      style: options.style,
    };
  },

  render(options: SpinnerOptions = {}): ReactNode {
    return <LoadingSpinner {...spinnerService.create(options)} />;
  },
};

export function LoadingSpinner({
  loading = true,
  message,
  size = spinnerService.defaultSize,
  color = spinnerService.defaultColor,
  className = '',
  centered = true,
  style,
}: SpinnerOptions) {
  if (!loading) return null;

  const content = (
    <div className={`ecap-spinner ${className}`.trim()} style={style}>
      <ClipLoader color={color} loading size={size} aria-label={message ?? 'Loading'} />
      {message && <p className="text-muted small mb-0 mt-2">{message}</p>}
    </div>
  );

  if (!centered) return content;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-3">{content}</div>
  );
}

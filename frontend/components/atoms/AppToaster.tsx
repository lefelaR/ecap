'use client';

import { Toaster, ToastBar } from 'react-hot-toast';

const toastOptions = {
  duration: 4000,
  style: {
    color: '#ffffff',
  },
  success: {
    style: {
      background: '#16a34a',
      color: '#ffffff',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#16a34a',
    },
  },
  error: {
    style: {
      background: '#dc2626',
      color: '#ffffff',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#dc2626',
    },
  },
} as const;

export function AppToaster() {
  return (
    <Toaster position="bottom-left" toastOptions={toastOptions}>
      {(t) => (
        <ToastBar
          toast={t}
          position="bottom-left"
          style={{
            ...t.style,
            animation: t.visible
              ? 'toast-slide-in-bottom-left 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards'
              : 'toast-slide-out-bottom-left 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) forwards',
          }}
        />
      )}
    </Toaster>
  );
}

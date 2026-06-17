'use client';

import { Toaster } from 'react-hot-toast';

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
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
      }}
    />
  );
}

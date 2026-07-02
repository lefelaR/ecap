'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { PageBarLoader } from '@/lib/react-spinners';

interface PageLoadingContextValue {
  startPageLoading: () => void;
}

const PageLoadingContext = createContext<PageLoadingContextValue | null>(null);

function isInternalNavigationLink(anchor: HTMLAnchorElement, pathname: string): boolean {
  if (!anchor.href || anchor.target === '_blank' || anchor.hasAttribute('download')) {
    return false;
  }

  const url = new URL(anchor.href, window.location.origin);
  if (url.origin !== window.location.origin) return false;

  return url.pathname !== pathname || url.search !== window.location.search;
}

export function PageLoadingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [initialLoading, setInitialLoading] = useState(true);
  const [navigationLoading, setNavigationLoading] = useState(false);

  const startPageLoading = useCallback(() => {
    setNavigationLoading(true);
  }, []);

  useEffect(() => {
    const completeInitialLoad = () => setInitialLoading(false);

    if (document.readyState === 'complete') {
      completeInitialLoad();
      return;
    }

    window.addEventListener('load', completeInitialLoad);
    return () => window.removeEventListener('load', completeInitialLoad);
  }, []);

  useEffect(() => {
    setNavigationLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (anchor instanceof HTMLAnchorElement && isInternalNavigationLink(anchor, pathname)) {
        setNavigationLoading(true);
      }
    };

    const handlePopState = () => setNavigationLoading(true);

    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = (...args) => {
      setNavigationLoading(true);
      return originalPushState(...args);
    };

    history.replaceState = (...args) => {
      setNavigationLoading(true);
      return originalReplaceState(...args);
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', handlePopState);
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [pathname]);

  const loading = initialLoading || navigationLoading;
  const value = useMemo(() => ({ startPageLoading }), [startPageLoading]);

  return (
    <PageLoadingContext.Provider value={value}>
      <PageBarLoader loading={loading} />
      {children}
    </PageLoadingContext.Provider>
  );
}

export function usePageLoading() {
  const context = useContext(PageLoadingContext);
  if (!context) {
    throw new Error('usePageLoading must be used within PageLoadingProvider.');
  }
  return context;
}

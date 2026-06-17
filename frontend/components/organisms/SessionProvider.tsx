'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { SessionUser } from '@/lib/types';
import { appApi } from '@/services/app-api';

interface SessionContextValue {
  session: SessionUser | null;
  ready: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  const refreshSession = useCallback(async () => {
    try {
      const { user } = await appApi.getSession();
      setSession(user ?? null);
    } catch {
      setSession(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const logout = useCallback(async () => {
    await appApi.logout();
    setSession(null);
    window.location.href = '/';
  }, []);

  const value = useMemo(
    () => ({
      session,
      ready,
      refreshSession,
      logout,
    }),
    [session, ready, refreshSession, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider.');
  }
  return context;
}

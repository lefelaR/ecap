import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import type { SessionUser } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const DEFAULT_TTL_HOURS = 8;

export interface SessionRecord {
  id: string;
  user: SessionUser;
  createdAt: string;
  expiresAt: string;
}

interface SessionStore {
  sessions: SessionRecord[];
}

async function ensureSessionsFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(SESSIONS_FILE);
  } catch {
    await fs.writeFile(SESSIONS_FILE, JSON.stringify({ sessions: [] }, null, 2), 'utf-8');
  }
}

async function readStore(): Promise<SessionStore> {
  await ensureSessionsFile();
  const raw = await fs.readFile(SESSIONS_FILE, 'utf-8');
  return JSON.parse(raw) as SessionStore;
}

async function writeStore(store: SessionStore): Promise<void> {
  await ensureSessionsFile();
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

function isExpired(record: SessionRecord): boolean {
  return new Date(record.expiresAt).getTime() <= Date.now();
}

export async function createSession(user: SessionUser, ttlHours = DEFAULT_TTL_HOURS): Promise<SessionRecord> {
  const store = await readStore();
  const now = new Date();
  const record: SessionRecord = {
    id: randomUUID(),
    user,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlHours * 60 * 60 * 1000).toISOString(),
  };

  store.sessions = [record, ...store.sessions.filter((session) => session.user.authorityId !== user.authorityId)];
  await writeStore(store);
  return record;
}

export async function getSessionById(sessionId: string): Promise<SessionRecord | null> {
  const store = await readStore();
  const record = store.sessions.find((session) => session.id === sessionId);
  if (!record) return null;

  if (isExpired(record)) {
    await deleteSession(sessionId);
    return null;
  }

  return record;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const store = await readStore();
  store.sessions = store.sessions.filter((session) => session.id !== sessionId);
  await writeStore(store);
}

export async function purgeExpiredSessions(): Promise<void> {
  const store = await readStore();
  store.sessions = store.sessions.filter((session) => !isExpired(session));
  await writeStore(store);
}

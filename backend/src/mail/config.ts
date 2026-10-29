export function statusPageUrl(): string {
  const base = process.env.APP_URL ?? 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/status`;
}

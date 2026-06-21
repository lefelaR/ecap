export const ECAP_MAIL_FROM = 'ECAP <noreply@ecap.local>';

export function statusPageUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';
  return `${base}/status`;
}

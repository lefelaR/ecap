export const ECAP_MAIL_FROM = process.env.SMTP_FROM ?? 'ECAP <noreply@ecap.local>';

export const MAILPIT_WEB_URL = process.env.MAILPIT_WEB_URL ?? 'http://localhost:8025';

export function statusPageUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';
  return `${base}/status`;
}

export function shouldUseMailpit(): boolean {
  if (process.env.USE_MAILPIT === 'false') return false;
  if (process.env.USE_MAILPIT === 'true') return true;
  return process.env.NODE_ENV === 'development';
}

export function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: process.env.SMTP_SECURE === 'true',
  };
}

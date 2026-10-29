export const ECAP_MAIL_FROM = process.env.SMTP_FROM ?? 'ECAP <noreply@ecap.local>';

export const MAILPIT_WEB_URL = process.env.MAILPIT_WEB_URL ?? 'http://localhost:8025';

export function statusPageUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';
  return `${base}/status`;
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

export function shouldUseMailpit(): boolean {
  if (process.env.USE_LIVE_EMAIL === 'true') return false;
  if (process.env.USE_MAILPIT === 'true') return true;
  if (process.env.USE_MAILPIT === 'false') return false;
  if (isSmtpConfigured()) return false;
  return process.env.NODE_ENV === 'development';
}

export function getSmtpConfig() {
  const useMailpit = shouldUseMailpit();

  return {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? (useMailpit ? 1025 : 587)),
    secure: process.env.SMTP_SECURE === 'true',
    useMailpit,
    auth: useMailpit
      ? undefined
      : {
          user: process.env.SMTP_USER ?? '',
          pass: process.env.SMTP_PASS ?? '',
        },
  };
}

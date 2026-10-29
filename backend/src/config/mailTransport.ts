import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export const ECAP_MAIL_FROM = process.env.SMTP_FROM ?? 'ECAP <noreply@ecap.local>';
export const MAILPIT_WEB_URL = process.env.MAILPIT_WEB_URL ?? 'http://localhost:8025';

export function isSesSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

export function useMailpit(): boolean {
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) return false;
  if (process.env.USE_LIVE_EMAIL === 'true') return false;
  if (process.env.USE_MAILPIT === 'true') return true;
  if (process.env.USE_MAILPIT === 'false') return false;
  if (isSesSmtpConfigured()) return false;
  return process.env.NODE_ENV === 'development';
}

export function shouldDeliverMail(): boolean {
  return useMailpit() || isSesSmtpConfigured();
}

export function getSmtpTransportOptions(): SMTPTransport.Options {
  const host = process.env.SMTP_HOST ?? 'localhost';
  const port = Number(process.env.SMTP_PORT ?? (useMailpit() ? 1025 : 587));
  const secure = process.env.SMTP_SECURE === 'true';

  const options: SMTPTransport.Options = {
    host,
    port,
    secure,
    requireTLS: !secure && !useMailpit(),
  };

  if (!useMailpit()) {
    options.auth = {
      user: process.env.SMTP_USER ?? '',
      pass: process.env.SMTP_PASS ?? '',
    };
  } else {
    options.ignoreTLS = true;
  }

  return options;
}

export function mailDeliveryLabel(): string {
  if (useMailpit()) return `Mailpit (${MAILPIT_WEB_URL})`;
  if (isSesSmtpConfigured()) return `SES SMTP (${process.env.SMTP_HOST})`;
  return 'console';
}

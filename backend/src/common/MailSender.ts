import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';

const ECAP_MAIL_FROM = process.env.SMTP_FROM ?? 'ECAP <noreply@ecap.local>';
const MAILPIT_WEB_URL = process.env.MAILPIT_WEB_URL ?? 'http://localhost:8025';

let transporter: nodemailer.Transporter | null = null;

function shouldUseMailpit(): boolean {
  if (process.env.USE_MAILPIT === 'false') return false;
  if (process.env.USE_MAILPIT === 'true') return true;
  return process.env.NODE_ENV === 'development';
}

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'localhost',
      port: Number(process.env.SMTP_PORT ?? 1025),
      secure: process.env.SMTP_SECURE === 'true',
      ignoreTLS: process.env.SMTP_SECURE !== 'true',
    });
  }
  return transporter;
}

export class MailSender {
  static isEnabled(): boolean {
    return shouldUseMailpit();
  }

  static async send(payload: { to: string; subject: string; text: string; html?: string }): Promise<void> {
    if (!this.isEnabled()) {
      console.info(`[ECAP email] To: ${payload.to} | ${payload.subject}`);
      return;
    }

    const message: Mail.Options = {
      from: ECAP_MAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html ?? payload.text.replace(/\n/g, '<br>'),
    };

    await getTransporter().sendMail(message);
    console.info(`[ECAP email] Sent to Mailpit (${MAILPIT_WEB_URL}) → ${payload.to} | ${payload.subject}`);
  }
}

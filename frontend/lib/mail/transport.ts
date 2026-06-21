import { MAILPIT_WEB_URL, shouldUseMailpit } from './config';
import { sendSmtpMail } from './smtp';
import type { MailTransport } from './types';

export const consoleMailTransport: MailTransport = async (mail) => {
  console.info(`[ECAP email] To: ${mail.to} | ${mail.subject}`);
};

export const mailpitMailTransport: MailTransport = async (mail) => {
  await sendSmtpMail(mail);
  console.info(`[ECAP email] Sent to Mailpit (${MAILPIT_WEB_URL}) → ${mail.to} | ${mail.subject}`);
};

export function createDefaultMailTransport(): MailTransport {
  return shouldUseMailpit() ? mailpitMailTransport : consoleMailTransport;
}

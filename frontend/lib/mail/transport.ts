import type { MailTransport } from './types';

export const consoleMailTransport: MailTransport = async (mail) => {
  console.info(`[ECAP email] To: ${mail.to} | ${mail.subject}`);
};

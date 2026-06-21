import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import { ECAP_MAIL_FROM, getSmtpConfig } from './config';
import type { RenderedMail } from './types';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const smtp = getSmtpConfig();
    transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      ignoreTLS: !smtp.secure,
    });
  }
  return transporter;
}

export async function sendSmtpMail(mail: Pick<RenderedMail, 'to' | 'subject' | 'html' | 'text'>): Promise<void> {
  const payload: Mail.Options = {
    from: ECAP_MAIL_FROM,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  };

  await getTransporter().sendMail(payload);
}

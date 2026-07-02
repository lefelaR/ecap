import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import {
  ECAP_MAIL_FROM,
  getSmtpTransportOptions,
  mailDeliveryLabel,
  shouldDeliverMail,
} from '../config/mailTransport';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(getSmtpTransportOptions());
  }
  return transporter;
}

export class MailSender {
  static isEnabled(): boolean {
    return shouldDeliverMail();
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
    console.info(`[ECAP email] Sent via ${mailDeliveryLabel()} → ${payload.to} | ${payload.subject}`);
  }
}

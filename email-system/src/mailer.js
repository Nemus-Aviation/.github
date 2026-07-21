import nodemailer from 'nodemailer';
import { config, assertDeliverable } from './config.js';

/**
 * Thin wrapper around a Nodemailer transport.
 *
 * In dry-run mode the transport is never created; messages are logged to the
 * console instead. This keeps local development and tests free of real
 * credentials and prevents accidental sends.
 */

let cachedTransport = null;

function getTransport() {
  if (cachedTransport) return cachedTransport;
  assertDeliverable();
  cachedTransport = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.auth.user,
      pass: config.smtp.auth.pass,
    },
  });
  return cachedTransport;
}

/**
 * Verify the SMTP connection and credentials without sending anything.
 * @returns {Promise<boolean>}
 */
export async function verifyConnection() {
  if (config.dryRun) return true;
  return getTransport().verify();
}

/**
 * Send a single message.
 *
 * @param {object} message
 * @param {string|string[]} message.to
 * @param {string} message.subject
 * @param {string} message.html
 * @param {string} [message.text]
 * @param {Array<object>} [message.attachments]
 * @param {string|string[]} [message.cc]
 * @param {string|string[]} [message.bcc]
 * @returns {Promise<{messageId: string, dryRun: boolean, accepted: string[]}>}
 */
export async function sendMail(message) {
  const envelope = {
    from: { name: config.from.name, address: config.from.address },
    replyTo: config.replyTo,
    ...message,
  };

  if (config.dryRun) {
    const recipients = [].concat(message.to || []);
    console.log('\n[DRY_RUN] Email not sent. Preview:');
    console.log(`  From:    ${config.from.name} <${config.from.address}>`);
    console.log(`  To:      ${recipients.join(', ')}`);
    console.log(`  Subject: ${message.subject}`);
    if (message.text) {
      console.log(`  Text:    ${message.text.slice(0, 240)}`);
    }
    return { messageId: 'dry-run', dryRun: true, accepted: recipients };
  }

  const info = await getTransport().sendMail(envelope);
  return {
    messageId: info.messageId,
    dryRun: false,
    accepted: info.accepted || [],
  };
}

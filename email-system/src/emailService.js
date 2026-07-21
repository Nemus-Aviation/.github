import { sendMail, verifyConnection } from './mailer.js';
import { renderTemplate, htmlToText } from './templateEngine.js';

/**
 * High-level notification API for Nemus Aviation.
 *
 * Each method builds a subject line, renders the matching template, and hands
 * the message to the mailer. Callers never touch SMTP or HTML directly.
 *
 * All methods accept an optional `to` override; if omitted, the relevant
 * recipient field on the payload (e.g. `customerEmail`) is used.
 */

function firstDefined(...values) {
  return values.find((v) => v !== undefined && v !== null && v !== '');
}

async function deliver({ to, cc, bcc, subject, template, data, attachments }) {
  const recipient = firstDefined(to);
  if (!recipient) {
    throw new Error(`Cannot send "${template}" email: no recipient provided.`);
  }
  const html = renderTemplate(template, { subject, ...data });
  return sendMail({
    to: recipient,
    cc,
    bcc,
    subject,
    html,
    text: htmlToText(html),
    attachments,
  });
}

export const emailService = {
  /** Verify SMTP connectivity. Returns true in dry-run mode. */
  verify: verifyConnection,

  /**
   * Send an invoice notification.
   * @param {object} payload
   * @param {string} [payload.to]              Recipient (defaults to customerEmail).
   * @param {string} payload.customerEmail
   * @param {string} payload.customerName
   * @param {string} payload.invoiceNumber
   * @param {string|Date} payload.issueDate
   * @param {string|Date} payload.dueDate
   * @param {Array<{description:string, amount:number}>} payload.lineItems
   * @param {number} payload.total
   * @param {string} [payload.currency='USD']
   * @param {string} [payload.payUrl]
   */
  sendInvoice(payload) {
    const currency = payload.currency || 'USD';
    return deliver({
      to: payload.to || payload.customerEmail,
      cc: payload.cc,
      bcc: payload.bcc,
      subject: `Invoice ${payload.invoiceNumber} from Nemus Aviation`,
      template: 'invoice',
      data: { ...payload, currency },
      attachments: payload.attachments,
    });
  },

  /**
   * Send a general announcement.
   * @param {object} payload
   * @param {string} payload.to
   * @param {string} payload.title
   * @param {string} [payload.subtitle]
   * @param {string[]} payload.paragraphs
   * @param {string} [payload.ctaUrl]
   * @param {string} [payload.ctaLabel]
   */
  sendAnnouncement(payload) {
    return deliver({
      to: payload.to,
      cc: payload.cc,
      bcc: payload.bcc,
      subject: payload.subject || payload.title,
      template: 'announcement',
      data: payload,
      attachments: payload.attachments,
    });
  },

  /**
   * Send a service/account update.
   * @param {object} payload
   * @param {string} payload.to
   * @param {string} payload.title
   * @param {string} [payload.message]
   * @param {string[]} [payload.changes]
   * @param {string} [payload.detailsUrl]
   */
  sendUpdate(payload) {
    return deliver({
      to: payload.to,
      cc: payload.cc,
      bcc: payload.bcc,
      subject: payload.subject || `Update: ${payload.title}`,
      template: 'update',
      data: payload,
      attachments: payload.attachments,
    });
  },

  /**
   * Send a scheduling notification (booking, reschedule, reminder, ...).
   * @param {object} payload
   * @param {string} [payload.to]              Recipient (defaults to passengerEmail).
   * @param {string} payload.passengerEmail
   * @param {string} payload.passengerName
   * @param {string} payload.title
   * @param {string} [payload.statusLabel]     e.g. "Confirmed", "Rescheduled", "Reminder".
   * @param {string} payload.flightNumber
   * @param {string} payload.origin
   * @param {string} payload.destination
   * @param {string|Date} payload.departureTime
   * @param {string|Date} payload.arrivalTime
   * @param {string} [payload.timeZone]         IANA zone (e.g. "America/New_York") used to
   *                                            render both times in the flight's local time.
   *                                            Strongly recommended — without it, times render
   *                                            in the server's zone. Defaults per-leg below.
   * @param {string} [payload.departureTimeZone] Overrides `timeZone` for the departure time.
   * @param {string} [payload.arrivalTimeZone]   Overrides `timeZone` for the arrival time.
   * @param {string} [payload.aircraft]
   * @param {string} [payload.gate]
   * @param {string} [payload.manageUrl]
   * @param {string} [payload.note]
   */
  sendScheduling(payload) {
    return deliver({
      to: payload.to || payload.passengerEmail,
      cc: payload.cc,
      bcc: payload.bcc,
      subject:
        payload.subject ||
        `${payload.statusLabel || 'Scheduling'}: ${payload.flightNumber} ${payload.origin} → ${payload.destination}`,
      template: 'scheduling',
      data: {
        ...payload,
        departureTimeZone: payload.departureTimeZone || payload.timeZone,
        arrivalTimeZone: payload.arrivalTimeZone || payload.timeZone,
      },
      attachments: payload.attachments,
    });
  },

  /**
   * Escape hatch: send a fully custom message using a named template.
   * @param {object} payload
   * @param {string} payload.to
   * @param {string} payload.subject
   * @param {string} payload.template  Template name (without extension).
   * @param {object} [payload.data]
   */
  send(payload) {
    return deliver({
      to: payload.to,
      cc: payload.cc,
      bcc: payload.bcc,
      subject: payload.subject,
      template: payload.template,
      data: payload.data || {},
      attachments: payload.attachments,
    });
  },
};

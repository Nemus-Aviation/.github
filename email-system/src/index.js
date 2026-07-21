/**
 * Nemus Aviation — Email System
 * Public entry point.
 *
 * @example
 *   import { emailService } from '@nemus-aviation/email-system';
 *   await emailService.sendInvoice({ ... });
 */
export { emailService } from './emailService.js';
export { renderTemplate, htmlToText } from './templateEngine.js';
export { sendMail, verifyConnection } from './mailer.js';
export { config } from './config.js';
export { lookupTimeZone, AIRPORT_TIMEZONES } from './airportTimeZones.js';

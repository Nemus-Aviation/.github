import 'dotenv/config';

/**
 * Centralised configuration for the email system.
 *
 * Every value is sourced from environment variables so the same code can run
 * in local development, CI, and production without changes. See `.env.example`
 * for the full list of supported variables.
 */

function bool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function required(name, value) {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        'Copy .env.example to .env and fill it in.'
    );
  }
  return value;
}

const dryRun = bool(process.env.DRY_RUN, false);

export const config = {
  dryRun,

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: bool(process.env.SMTP_SECURE, false),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },

  from: {
    name: process.env.MAIL_FROM_NAME || 'Nemus Aviation',
    address: process.env.MAIL_FROM_ADDRESS || 'notifications@nemusaviation.com',
  },

  replyTo: process.env.MAIL_REPLY_TO || undefined,

  branding: {
    companyName: process.env.COMPANY_NAME || 'Nemus Aviation',
    companyUrl: process.env.COMPANY_URL || 'https://nemusaviation.com',
    supportEmail:
      process.env.COMPANY_SUPPORT_EMAIL || 'support@nemusaviation.com',
    brandColor: process.env.BRAND_COLOR || '#0b3d5b',
  },
};

/**
 * Validates that everything needed to actually deliver mail is present.
 * Skipped in dry-run mode, where no transport is used.
 */
export function assertDeliverable() {
  if (config.dryRun) return;
  required('SMTP_HOST', config.smtp.host);
  required('SMTP_USER', config.smtp.auth.user);
  required('SMTP_PASS', config.smtp.auth.pass);
}

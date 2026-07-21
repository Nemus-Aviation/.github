import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Handlebars from 'handlebars';
import { config } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatesDir = join(__dirname, 'templates');

const compiledCache = new Map();

// --- Helpers ---------------------------------------------------------------

Handlebars.registerHelper('currency', (amount, code = 'USD') => {
  const value = Number(amount);
  if (Number.isNaN(value)) return amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code,
  }).format(value);
});

Handlebars.registerHelper('date', (value, options) => {
  if (!value) return '';
  // A date-only string (YYYY-MM-DD) is parsed by JS as UTC midnight. Rendering
  // it in the server's local zone can roll it back a day (e.g. a due date of
  // Jul 21 showing as Jul 20 west of UTC), so pin those to UTC.
  const isDateOnly =
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim());
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const fmt = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  if (isDateOnly) fmt.timeZone = 'UTC';
  const tz = options && options.hash && options.hash.tz;
  if (tz) fmt.timeZone = tz;
  return d.toLocaleDateString('en-US', fmt);
});

Handlebars.registerHelper('datetime', (value, options) => {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const fmt = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    // Always label the zone so a time is never silently ambiguous. Callers
    // should pass `tz=` (an IANA name like "America/New_York") to render in the
    // event's local zone rather than the server's.
    timeZoneName: 'short',
  };
  const tz = options && options.hash && options.hash.tz;
  if (tz) fmt.timeZone = tz;
  return d.toLocaleString('en-US', fmt);
});

// Register the shared layout as a partial so every template can wrap itself.
const layoutPath = join(templatesDir, 'layout.hbs');
if (existsSync(layoutPath)) {
  Handlebars.registerPartial('layout', readFileSync(layoutPath, 'utf8'));
}

// --- Public API ------------------------------------------------------------

function compile(name) {
  if (compiledCache.has(name)) return compiledCache.get(name);
  const path = join(templatesDir, `${name}.hbs`);
  if (!existsSync(path)) {
    throw new Error(`Unknown email template: "${name}" (looked in ${path})`);
  }
  const fn = Handlebars.compile(readFileSync(path, 'utf8'));
  compiledCache.set(name, fn);
  return fn;
}

/**
 * Render a named template to an HTML string.
 *
 * Branding values from config are always merged in under `brand` so templates
 * never have to be passed company details explicitly.
 *
 * @param {string} name  Template file name without extension.
 * @param {object} data  Values available to the template.
 * @returns {string} Rendered HTML.
 */
export function renderTemplate(name, data = {}) {
  const template = compile(name);
  return template({
    brand: config.branding,
    year: new Date().getFullYear(),
    ...data,
  });
}

/**
 * Produce a plain-text fallback from an HTML string.
 * A best-effort conversion — good enough for the text/plain MIME part.
 * @param {string} html
 * @returns {string}
 */
export function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<\/(p|div|tr|h[1-6]|li)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // Decode &amp; last so we don't double-decode (e.g. "&amp;lt;" -> "&lt;").
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();
}

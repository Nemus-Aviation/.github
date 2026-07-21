/**
 * Render every template to an HTML file under ./preview/ so you can open them
 * in a browser without sending mail. Run:
 *
 *   npm run preview
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { renderTemplate } from '../src/templateEngine.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'preview');
mkdirSync(outDir, { recursive: true });

const samples = {
  invoice: {
    subject: 'Invoice INV-2026-0042',
    customerName: 'Jordan Rivera',
    invoiceNumber: 'INV-2026-0042',
    issueDate: '2026-07-21',
    dueDate: '2026-08-04',
    currency: 'USD',
    lineItems: [
      { description: 'Charter flight KTEB → KMIA', amount: 12800 },
      { description: 'Catering & ground handling', amount: 950 },
    ],
    total: 13750,
    payUrl: 'https://pay.nemusaviation.com/inv/INV-2026-0042',
  },
  announcement: {
    subject: 'New direct routes this fall',
    title: 'New direct routes from Teterboro this fall',
    subtitle: 'Expanded East Coast availability',
    paragraphs: [
      'We are excited to announce three new direct charter routes.',
      'Members get priority booking for the first 30 days.',
    ],
    ctaUrl: 'https://nemusaviation.com/routes',
    ctaLabel: 'Explore routes',
  },
  update: {
    subject: 'Updated baggage policy',
    title: 'Updated baggage policy',
    message: 'We have refreshed our baggage allowance.',
    changes: ['Light jets: up to 6 bags.', 'Midsize jets: up to 10 bags.'],
    detailsUrl: 'https://nemusaviation.com/policies/baggage',
  },
  scheduling: {
    subject: 'Your flight is confirmed',
    passengerName: 'Jordan Rivera',
    title: 'Your flight is confirmed',
    statusLabel: 'Confirmed',
    flightNumber: 'NEM-118',
    origin: 'KTEB',
    destination: 'KMIA',
    departureTime: '2026-07-28T14:30:00-04:00',
    arrivalTime: '2026-07-28T17:25:00-04:00',
    aircraft: 'Cessna Citation CJ3+',
    gate: 'Signature FBO, Terminal A',
    manageUrl: 'https://nemusaviation.com/bookings/NEM-118',
    note: 'Please arrive 30 minutes before departure.',
  },
};

for (const [name, data] of Object.entries(samples)) {
  const html = renderTemplate(name, data);
  const file = join(outDir, `${name}.html`);
  writeFileSync(file, html);
  console.log(`Wrote ${file}`);
}

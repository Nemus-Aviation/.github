/**
 * Runnable examples for every notification type.
 *
 * With DRY_RUN=true (the default in `.env.example`) these print a preview to
 * the console instead of sending real email:
 *
 *   DRY_RUN=true node examples/sendExamples.js
 *
 * Remove DRY_RUN and configure SMTP_* variables to send for real.
 */
import { emailService } from '../src/index.js';

async function main() {
  const ok = await emailService.verify();
  console.log(`SMTP connection: ${ok ? 'ok' : 'unavailable'}`);

  await emailService.sendInvoice({
    customerEmail: 'client@example.com',
    customerName: 'Jordan Rivera',
    invoiceNumber: 'INV-2026-0042',
    issueDate: '2026-07-21',
    dueDate: '2026-08-04',
    currency: 'USD',
    lineItems: [
      { description: 'Charter flight KTEB → KMIA (Citation CJ3)', amount: 12800 },
      { description: 'Catering & ground handling', amount: 950 },
    ],
    total: 13750,
    payUrl: 'https://pay.nemusaviation.com/inv/INV-2026-0042',
  });

  await emailService.sendAnnouncement({
    to: 'client@example.com',
    title: 'New direct routes from Teterboro this fall',
    subtitle: 'Expanded East Coast availability',
    paragraphs: [
      'We are excited to announce three new direct charter routes departing from Teterboro (KTEB) starting September 2026.',
      'Members get priority booking on all new routes for the first 30 days.',
    ],
    ctaUrl: 'https://nemusaviation.com/routes',
    ctaLabel: 'Explore routes',
  });

  await emailService.sendUpdate({
    to: 'client@example.com',
    title: 'Updated baggage policy',
    message: 'We have refreshed our baggage allowance for light and midsize jets.',
    changes: [
      'Light jets: up to 6 standard bags included.',
      'Midsize jets: up to 10 standard bags included.',
      'Ski and golf equipment now carried free of charge.',
    ],
    detailsUrl: 'https://nemusaviation.com/policies/baggage',
  });

  await emailService.sendScheduling({
    passengerEmail: 'client@example.com',
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
    note: 'Please arrive at the FBO 30 minutes before departure.',
  });

  console.log('\nDone. (Set DRY_RUN=false and SMTP_* to send for real.)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

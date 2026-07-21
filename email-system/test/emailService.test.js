import { test } from 'node:test';
import assert from 'node:assert/strict';

// Force dry-run so no network/credentials are needed.
process.env.DRY_RUN = 'true';

const { emailService } = await import('../src/index.js');
const { renderTemplate, htmlToText } = await import('../src/templateEngine.js');

test('renderTemplate produces HTML with branding and currency formatting', () => {
  const html = renderTemplate('invoice', {
    subject: 'Invoice INV-1',
    customerName: 'Sam',
    invoiceNumber: 'INV-1',
    issueDate: '2026-07-21',
    dueDate: '2026-08-04',
    currency: 'USD',
    lineItems: [{ description: 'Charter', amount: 1000 }],
    total: 1000,
  });
  assert.match(html, /Nemus Aviation/);
  assert.match(html, /INV-1/);
  assert.match(html, /\$1,000\.00/);
});

test('htmlToText strips tags and keeps content', () => {
  const text = htmlToText('<p>Hello <strong>world</strong></p><br><p>Bye</p>');
  assert.match(text, /Hello world/);
  assert.match(text, /Bye/);
  assert.doesNotMatch(text, /</);
});

test('sendInvoice resolves in dry-run and accepts the recipient', async () => {
  const res = await emailService.sendInvoice({
    customerEmail: 'a@example.com',
    customerName: 'Sam',
    invoiceNumber: 'INV-2',
    issueDate: '2026-07-21',
    dueDate: '2026-08-04',
    lineItems: [{ description: 'Charter', amount: 500 }],
    total: 500,
  });
  assert.equal(res.dryRun, true);
  assert.deepEqual(res.accepted, ['a@example.com']);
});

test('sendScheduling falls back to passengerEmail when no `to` given', async () => {
  const res = await emailService.sendScheduling({
    passengerEmail: 'p@example.com',
    passengerName: 'Sam',
    title: 'Confirmed',
    flightNumber: 'NEM-1',
    origin: 'KTEB',
    destination: 'KMIA',
    departureTime: '2026-07-28T14:30:00-04:00',
    arrivalTime: '2026-07-28T17:25:00-04:00',
  });
  assert.deepEqual(res.accepted, ['p@example.com']);
});

test('deliver throws a clear error when no recipient is provided', async () => {
  await assert.rejects(
    () => emailService.sendAnnouncement({ title: 'Hi', paragraphs: ['x'] }),
    /no recipient/i
  );
});

test('unknown template name raises a helpful error', () => {
  assert.throws(() => renderTemplate('does-not-exist', {}), /Unknown email template/);
});

test('date-only values do not shift a day regardless of server timezone', () => {
  // Regression: 'YYYY-MM-DD' parsed as UTC midnight must not roll back a day
  // when rendered west of UTC. This test runs under whatever TZ the process
  // has; the invoice date must always read Jul 21.
  const html = renderTemplate('invoice', {
    subject: 'Invoice INV-3',
    customerName: 'Sam',
    invoiceNumber: 'INV-3',
    issueDate: '2026-07-21',
    dueDate: '2026-08-04',
    currency: 'USD',
    lineItems: [{ description: 'Charter', amount: 1 }],
    total: 1,
  });
  assert.match(html, /Jul 21, 2026/);
  assert.doesNotMatch(html, /Jul 20, 2026/);
});

test('flight times render in the provided IANA zone with a zone label', () => {
  // Regression: times must follow the flight's zone, not the server's.
  const html = renderTemplate('scheduling', {
    subject: 'Confirmed',
    passengerName: 'Sam',
    title: 'Confirmed',
    flightNumber: 'NEM-1',
    origin: 'KTEB',
    destination: 'KMIA',
    departureTime: '2026-07-28T14:30:00-04:00', // 2:30 PM Eastern
    arrivalTime: '2026-07-28T17:25:00-04:00', // 5:25 PM Eastern
    departureTimeZone: 'America/New_York',
    arrivalTimeZone: 'America/New_York',
  });
  assert.match(html, /2:30\s?PM/);
  assert.match(html, /5:25\s?PM/);
  // Zone must be labelled so the time is never ambiguous.
  assert.match(html, /EDT/);
});

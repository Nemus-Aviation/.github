# Nemus Aviation — Email System

A small, dependency-light notification email system for Nemus Aviation. It
sends branded transactional emails for:

- **Invoices** — itemised billing with a pay link
- **Announcements** — company news and product updates
- **Updates** — account/service/policy changes
- **Scheduling** — flight confirmations, reschedules, and reminders

It uses [Nodemailer](https://nodemailer.com) for delivery (works with any SMTP
provider — SendGrid, Amazon SES, Postmark, Mailgun, Gmail, …) and
[Handlebars](https://handlebarsjs.com) for responsive HTML templates with a
plain-text fallback generated automatically.

## Quick start

```bash
cd email-system
npm install
cp .env.example .env        # then fill in SMTP_* and branding values
```

Preview the templates in a browser without sending anything:

```bash
npm run preview             # writes ./preview/*.html
```

Run the examples in dry-run mode (prints previews, sends nothing):

```bash
DRY_RUN=true npm start
```

## Usage

```js
import { emailService } from '@nemus-aviation/email-system';

// Invoice
await emailService.sendInvoice({
  customerEmail: 'client@example.com',
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
});

// Announcement
await emailService.sendAnnouncement({
  to: 'client@example.com',
  title: 'New direct routes from Teterboro this fall',
  paragraphs: ['We are excited to announce three new charter routes.'],
  ctaUrl: 'https://nemusaviation.com/routes',
  ctaLabel: 'Explore routes',
});

// Update
await emailService.sendUpdate({
  to: 'client@example.com',
  title: 'Updated baggage policy',
  message: 'We have refreshed our baggage allowance.',
  changes: ['Light jets: up to 6 bags.', 'Midsize jets: up to 10 bags.'],
});

// Scheduling
await emailService.sendScheduling({
  passengerEmail: 'client@example.com',
  passengerName: 'Jordan Rivera',
  statusLabel: 'Confirmed',
  title: 'Your flight is confirmed',
  flightNumber: 'NEM-118',
  origin: 'KTEB',
  destination: 'KMIA',
  departureTime: '2026-07-28T14:30:00-04:00',
  arrivalTime: '2026-07-28T17:25:00-04:00',
  timeZone: 'America/New_York', // render times in the flight's local zone
  aircraft: 'Cessna Citation CJ3+',
  manageUrl: 'https://nemusaviation.com/bookings/NEM-118',
});
```

> **Times & timezones.** Flight times render in the flight's local zone. The
> zone is resolved in this order: an explicit `timeZone` (IANA name like
> `America/New_York`) → the origin/destination **airport code** (`KTEB`, `MIA`,
> … — both ICAO and IATA are recognised, see
> [`src/airportTimeZones.js`](src/airportTimeZones.js)) → the server's zone as a
> last resort (always labelled, e.g. `EDT`, so it's never ambiguous). For legs
> that cross zones, set `departureTimeZone` and `arrivalTimeZone` individually.
> Date-only invoice fields (`issueDate`, `dueDate`) always render in UTC so they
> never shift a day.

The airport table is a curated list of airports Nemus Aviation is likely to
serve, not an exhaustive database. For any airport not listed, pass `timeZone`
explicitly — or add the code to `src/airportTimeZones.js`.

Every method returns `{ messageId, dryRun, accepted }`.

## Configuration

All configuration is via environment variables — see [`.env.example`](.env.example)
for the full list. Key ones:

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | SMTP server connection |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials (or API key) |
| `MAIL_FROM_NAME` / `MAIL_FROM_ADDRESS` | Sender identity |
| `MAIL_REPLY_TO` | Optional reply-to address |
| `COMPANY_NAME` / `COMPANY_URL` / `BRAND_COLOR` | Branding used in templates |
| `DRY_RUN` | When `true`, logs instead of sending — for dev/CI |

## Project layout

```
email-system/
├── src/
│   ├── index.js            Public exports
│   ├── config.js           Env-driven configuration
│   ├── mailer.js           Nodemailer transport (+ dry-run)
│   ├── templateEngine.js   Handlebars rendering + helpers
│   ├── emailService.js     High-level notification methods
│   └── templates/          Responsive HTML templates
├── examples/sendExamples.js
├── scripts/previewTemplates.js
└── test/emailService.test.js
```

## Testing

```bash
npm test        # runs in dry-run mode; no credentials needed
```

## Adding a new notification type

1. Add `src/templates/<name>.hbs` (wrap it in `{{#> layout}} … {{/layout}}`).
2. Add a `send<Name>()` method to `src/emailService.js`.
3. Add a sample to `scripts/previewTemplates.js` and a test.

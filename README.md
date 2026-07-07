# WiE Academy

A Next.js platform for engineering student communities — announcements, events, a
discussion forum, and quizzes, with role-based access and an application/approval
flow for new members.

Built with **Next.js 16** (app router), **TypeScript**, **PostgreSQL + Prisma**,
**better-auth**, **Resend**, **TipTap**, **shadcn/ui**, and **Zod**.

> **New to this codebase?** Read [HANDOFF.md](HANDOFF.md) for the current state of
> the project — what's built, what's left, and the known bugs.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`) — this project uses pnpm, not npm/yarn
- A PostgreSQL database (local or hosted)
- A [Resend](https://resend.com/) API key (for verification / password-reset emails)

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:LennyPK/wie-academy-v2.git
   cd wie-academy-v2
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### Environment Setup

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. Fill in the values in `.env` (see [.env.example](.env.example) for the full list):
   - `DATABASE_URL` — PostgreSQL connection string
   - `BETTER_AUTH_SECRET` — generate with `openssl rand -base64 32`
   - `RESEND_API_KEY`, `EMAIL_SENDER_NAME`, `EMAIL_SENDER_ADDRESS`, `EMAIL_SUPPORT_ADDRESS`
   - `NEXT_PUBLIC_SITE_URL`

### Database Setup

Push the Prisma schema to your database and generate the client:

```bash
pnpm db:push       # push schema/models to the database
pnpm db:generate   # generate the Prisma client (into lib/generated/prisma)
pnpm db:seed       # optional: seed reference data + sample content
```

> **Note:** Seeded user accounts are not usable for sign-in as-is — they have no
> password/account record and are not email-verified or approved. To use the app,
> register through the UI, then approve your account (see [HANDOFF.md](HANDOFF.md)
> for the current manual approval workaround). This is a known gap.

Useful database commands:

```bash
pnpm db:studio     # open Prisma Studio
pnpm db:reset      # DESTRUCTIVE: force-reset the schema
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start the dev server                     |
| `pnpm build`        | Generate the Prisma client and build     |
| `pnpm start`        | Start the production server              |
| `pnpm lint`         | Run ESLint                               |
| `pnpm lint:fix`     | Fix ESLint issues                        |
| `pnpm format`       | Format with Prettier                     |
| `pnpm ts-check`     | Type-check with `tsc --noEmit`           |
| `pnpm email:dev`    | Preview email templates locally          |

## Additional Tools

### shadcn/ui

This project uses [shadcn/ui](https://ui.shadcn.com/docs). Add components with:

```bash
pnpm dlx shadcn@latest add
```

### Fonts

Uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to load [Geist](https://vercel.com/font).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branching and commit conventions.

## Contributors

Originally created by SOFTENG 761 2025 Team 6.

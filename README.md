# WiE Academy

A comprehensive Next.js platform for engineering student communities with event management, member engagement, and admin analytics. Built with Supabase, TypeScript, and modern React patterns.

## Getting Started

### Prerequisites

If you do not have npm installed, download Node.js and npm from [the official npm documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SOFTENG761/project-team-6-2025.git
   cd project-team-6-2025
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Environment Setup

1. Copy the environment example file:

   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your configuration:

   You will need to obtain the Supabase URL and keys from your Supabase project settings.

   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key
   EVENT_JWT_SECRET=your-secret-key
   ```

### Running the Development Server

To launch the app for development, run:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

This will start the development server with Turbopack. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Testing and Linting

- Running Tests:

  To run the test suite, use:

  ```bash
  npm run test
  ```

- Linting:

  To check the code for linting errors, run:

  ```bash
  npm run lint
  ```

## Additional Tools

### ShadCN

This project uses [ShadCN](https://ui.shadcn.com/docs). To add new components, use the ShadCN CLI:

```bash
npx shadcn@latest add
```

### Fonts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Contributors

This project was created by SOFTENG 761 2025 Team 6.

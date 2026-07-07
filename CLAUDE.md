# WIE Academy

Next.js 16 application using, pnpm, Prisma, shadcn/ui, TipTap, better-auth, Resend, and Zod.

## Coding Behavior

- Explain what to do and why --- do not edit files unless explicitly asked.
- Prefer step-by-step guidance so the developer can write the code themselves.
- When suggesting code, use code blocks with file paths in comments at the top.

## Code Formatting Rules

- ALL code MUST be in fenced code blocks with language tags
- NEVER write code inline, no matter how small the snippet
- ONLY exception: when a code term is referenced naturally within a
  sentence or paragraph (e.g. "the `isAnswered` function returns false"),
  inline backticks are acceptable
- WRONG: Here is the fix: `const x = 1`
- RIGHT:

```js
s
const x = 1
```

## Code Style

- This project uses pnpm as the package manager.
- Prefer kebab-case for all files
- Prefer `export default function ComponentName()` over arrow functions for pages, components and modules.
- Avoid arrow functions like `const Component = () => {}` unless explicitly requested.
- Keep things simple and developer friendly when appropriate rather than focusing conciseness and line count

## Commenting Guidelines

- Execution flow: Skip comments when code is self-documenting. Keep for complex logic, non-obvious "why", multi-line context, or if following a documented, multi-step flow.
- Top of file/module: Use sparingly; only for non-obvious purpose/context or an overview of complex logic.
- Type definitions: Property/interface documentation is always acceptable.

## Database

- Use Prisma for all database access.
- Schema lives in `prisma/models/*`.
- Migrations via `pnpm db:push` and `pnpm db:generate` for the client.
- Seed with `pnpm db:seed` --- rarely used.

## Linting & Formatting

pnpm run lint - Run ESLint
pnpm run lint:fix - Fix ESLint issues
pnpm run format - Format code with Prettier
pnpm run format:check - Check code formatting

## Additional Resources

These resources may be situationally useful depending on the task. Consider these when problem solving.

### Next.js LLMs.txt File

llms-full.txt: <https://nextjs.org/docs/llms-full.txt>

### Tanstack LLMs.txt Files

llms.txt: <https://tanstack.com/llms.txt>

### Better Auth LLM.txt File

llms.txt: <https://better-auth.com/llms.txt>

### TipTap LLM.txt File

llms.txt: <https://tiptap.dev/llms.txt>

### Zod LLM.txt File

llms-full.txt: <https://zod.dev/llms-full.txt>
llms.txt: <https://zod.dev/llms.txt>

### Resend LLM.txt File

llms.txt: <https://resend.com/llms.txt>

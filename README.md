# Minna no Nihongo Companion

[![CI](https://github.com/izumi6803/JapLearningApp/actions/workflows/ci.yml/badge.svg)](https://github.com/izumi6803/JapLearningApp/actions/workflows/ci.yml)

## What it is

I built **Minna no Nihongo Companion**, a free web app for learning Japanese. It teaches hiragana and katakana, vocabulary, grammar and kanji with flashcards, quizzes, spaced review, streaks, a roadmap, and an AI tutor you can chat or speak with. Progress syncs to your account; it runs in any browser, with no install or fee.

## Why I built it

My dream is to go to Japan for work and culture, but my Japanese was weak and courses were costly and hard to fit into a busy day. Many share that dream without the time or money, so I built the tool I wished existed.

## Decisions and tradeoffs

My decisions: Minna no Nihongo as the spine, web-first so anyone can start instantly, free access, streaks and review to build habit, and database-backed lessons with a free AI model to keep costs low. Tradeoffs: browser voice works best in Chrome/Edge, AI advice can be wrong, and I seeded core units first — more content, then more languages, next.

## Engineering

- **Stack:** Next.js 16 (App Router), React 19, TypeScript in strict mode, Tailwind CSS 4.
- **Data:** Postgres via `pg` in production; a JSON-file fallback under `.data/` keeps local development zero-setup. The repository layer hides the switch behind one interface.
- **Auth:** JWT sessions with `jose` (30-day cookie), Google OAuth, password reset tokens, and an admin role.
- **Content pipeline:** lessons are validated with a hand-written sanitizer before they are written (length caps, type checks, bounded lists), then hydrated with stable ids.
- **Spaced repetition:** a small Leitner-style scheduler (`lib/review.ts`) plus streak calculation (`lib/streak.ts`) are pure functions, which keeps them easy to test and reason about.
- **Quality gates:** Vitest unit tests (28 cases) cover scheduling, streak edges, progress sanitisation/merging, and lesson validation. GitHub Actions runs lint, `tsc --noEmit`, tests, and a production build on every push and pull request.

### Scripts

```bash
npm run dev        # start the dev server
npm test           # run the unit tests (Vitest)
npm run typecheck  # TypeScript, no emit
npm run lint       # ESLint
npm run build      # production build
```

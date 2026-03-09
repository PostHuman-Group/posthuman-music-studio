# PostHuman Music: Studio

PostHuman Music: Studio is an AI superagent music production tool that:

- generates audio, image, and video assets for 24/7 live music radio streams;
- sets up, manages, and schedules 24/7 music livestreams.

PostHuman Music: Studio is being built specifically for the PostHuman Music brand (not launched yet).

## Core Features

- **Sample Generator**: Text-to-audio sample geneator for creating synths, loops, FX, pads, drums, and more.
- **Stream Engine**: 24/7 AI-composed music generation in real-time, with mastering built-in.
- **Visualiser**: Audio-reactive visuals based on the PostHuman design system.
- **Studio Bridge**: Automated scheduling and livestream management for YouTube, TikTok, and Instagram. More platforms are coming later.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Framer Motion.
- **AI**: Genkit, Google AI (Gemini).
- **Database**: Neon with Drizzle ORM.
- **Hosting**: Netlify + Netlify Functions.

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Configure your environment in `.env` (see `.env.example`).
4. Run the development server: `npm run dev`.

## Development Standards & Best Practices

As a solo "vibe coder," we maintain high standards using Agile principles to keep the build lean, performant, and focused on the MVP.

### 1. Agile & Lean MVP Focus

- **Iterative Grains**: Build in small, functional increments. Every commit should move the needle.
- **Ruthless Prioritization**: If it doesn't serve the core 24/7 stream or asset generation MVP, it waits for the next lap.
- **Fast Feedback**: Use the local dev server and Netlify previews to catch visual and logic snags early.

### 2. Code Quality & Performance

- **Type Safety**: TypeScript is non-negotiable. Use it to catch bugs before they reach the browser.
- **Lean Dependencies**: Only add packages that are absolutely necessary. Keep the bundle light for fast loading.
- **Mobile-First Design**: Design for the smallest screen first to ensure accessibility and performance across all devices.
- **Vertical Rhythm**: Maintain the 24px (1.5rem) grid system for visual harmony and consistent UI.

### 3. "Vibe Coding" Workflow

- **Flow State Architecture**: Keep components focused and modular. If a component feels "messy," refactor it before adding more logic.
- **Meaningful Commits**: Use descriptive commit messages. Each commit tells a story of a feature or a fix.
- **Documentation as Code**: Keep the README and other artifacts up to date as the "single source of truth" for the project's brain.

---
*Manufactured by PostHuman Group.*

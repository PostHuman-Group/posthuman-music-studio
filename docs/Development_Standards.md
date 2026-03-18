# Development Standards & Best Practices

I maintain high standards using Agile principles to keep the build lean, performant, and focused.

## 1. Agile & Lean MVP Focus

- **Iterative Grains**: Build in small, functional increments. Every commit should move the needle.
- **Ruthless Prioritization**: If it doesn't serve the core 24/7 stream or asset generation MVP, it waits for the next lap.
- **Fast Feedback**: Use the local dev server and Netlify previews to catch visual and logic snags early.

## 2. Code Quality & Performance

- **Type Safety**: TypeScript is non-negotiable. Use it to catch bugs before they reach the browser.
- **Lean Dependencies**: Only add packages that are absolutely necessary. Keep the bundle light for fast loading.
- **Mobile-First Design**: Design for the smallest screen first to ensure accessibility and performance across all devices.
- **Vertical Rhythm**: Maintain the 24px (1.5rem) grid system for visual harmony and consistent UI.

## 3. "Vibe Coding" Workflow

- **Flow State Architecture**: Keep components focused and modular. If a component feels "messy," refactor it before adding more logic.
- **Meaningful Commits**: Use descriptive commit messages. Each commit tells a story of a feature or a fix.
- **Documentation as Code**: Keep the README and other artifacts up to date as the "single source of truth" for the project's brain.

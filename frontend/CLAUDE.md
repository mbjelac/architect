# Frontend

Renders 3D scenes using shapes defined in the architect module. Uses shared rendering code from `shared/`.

- p5.js app served with Vite
- Entry point: `index.html` + `src/sketch.ts`
- Run dev server: `npm run dev` (port 5174)
- Run visual tests: `npx playwright test`
- Update snapshots: `npx playwright test --update-snapshots`
- Run unit tests: `npm run test:unit`

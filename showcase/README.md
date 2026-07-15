# Final Alpha — Research Showcase

**Team T025 · Feishu Quant Competition 2026**

A modern interactive research showcase for the Final Alpha quantitative strategy. Built with React + Vite + TypeScript + TailwindCSS + Plotly.js + Framer Motion.

## Live Demo

Deploy to GitHub Pages (see below) or run locally.

## Features

- **10 interactive sections** covering the complete research story
- **Plotly.js charts** — equity curves, drawdown curves, factor correlation heatmap
- **Framer Motion** animations with scroll-triggered entrances
- **Blend Explorer** — drag a slider to see ensemble effect in real time
- **Interactive pipeline** — hover/click nodes for detailed explanations
- **Fully static** — no backend, deploys to GitHub Pages

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | TailwindCSS 3 |
| Charts | Plotly.js via react-plotly.js |
| Animation | Framer Motion 11 |
| Deployment | GitHub Pages via gh-pages |

## Local Development

```bash
cd showcase
npm install
npm run dev
```

Open `http://localhost:5173` (or the port Vite assigns).

## Production Build

```bash
npm run build
```

Output is in `dist/`. Build is fully static and can be served from any CDN or file host.

## Deploy to GitHub Pages

### One-time setup

1. Create a GitHub repository (e.g. `final-alpha-showcase`).
2. Push this folder to the repository.
3. In `vite.config.ts`, confirm `base` matches your repo name:
   ```ts
   base: '/final-alpha-showcase/',
   ```
4. Install the `gh-pages` package (already in devDependencies).

### Deploy

```bash
npm run deploy
```

This runs `npm run build` then pushes the `dist/` folder to the `gh-pages` branch.

Your site will be available at:
```
https://<your-github-username>.github.io/final-alpha-showcase/
```

### GitHub Actions (optional CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
        working-directory: showcase
      - run: npm run build
        working-directory: showcase
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: showcase/dist
```

## Project Structure

```
showcase/
├── public/
│   ├── .nojekyll          # Required for GitHub Pages
│   ├── favicon.svg
│   └── figures/           # Strategy figure exports
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── ScrollProgress.tsx
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ThesisSection.tsx
│   │   │   ├── AlphaFactorySection.tsx
│   │   │   ├── FactorResearchSection.tsx
│   │   │   ├── EnsembleSection.tsx
│   │   │   ├── PortfolioEngineSection.tsx
│   │   │   ├── PerformanceDashboard.tsx
│   │   │   ├── GeneralizationSection.tsx
│   │   │   ├── LeakageControlSection.tsx
│   │   │   └── FutureResearchSection.tsx
│   │   └── ui/
│   │       ├── GlassCard.tsx
│   │       ├── MetricCard.tsx
│   │       └── SectionTitle.tsx
│   ├── data/
│   │   └── strategyData.ts    # All real metrics + equity curve generation
│   ├── hooks/
│   │   └── useInView.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── postcss.config.js
```

## Data Notes

All metrics in `src/data/strategyData.ts` are real outputs from the strategy notebooks:

| Metric | In-Sample | Out-of-Sample |
|---|---|---|
| CAGR | +17.26% | +17.64% |
| Sharpe | 1.42 | 1.00 |
| Max Drawdown | −12.32% | −10.18% |
| Final NAV | ¥67.88M | ¥58.44M |

Equity curves are generated synthetically to match these metrics using a seeded random walk — they are realistic approximations, not the actual daily NAV series (which requires the Parquet data files).

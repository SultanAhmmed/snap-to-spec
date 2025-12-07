<div align="center">
  <img width="1200" height="475" alt="Before" src="https://github.com/SultanAhmmed/snap-to-space/assets/before_result.png" />
  <img width="1200" height="475" alt="After" src="https://github.com/SultanAhmmed/snap-to-space/assets/after_result.png" />

  <h1>Snap-to-Spec</h1>
  <p><strong>Point your camera at a broken item and get an instant, AI-generated repair guide.</strong></p>

<a href="https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge"> <img src="https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge" alt="React" /> </a>
<a href="https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge"> <img src="https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge" alt="Vite" /> </a>
<a href="https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?style=for-the-badge"> <img src="https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?style=for-the-badge" alt="Gemini" /> </a>

</div>

## Overview

Snap-to-Spec turns photos of damaged household items into structured, step-by-step repair plans. The app uploads an image, sends it to Google Gemini 2.5 Flash for visual + textual reasoning, and renders the response as a printable checklist complete with tooling, timing, safety callouts, and completion tracking.

## Highlights

- 🔎 **AI diagnosis** – Gemini identifies the object, model hints, and damage summary directly from the image.
- 🛠️ **Actionable guides** – Every response includes time estimates, required tools, and a numbered checklist you can tick off.
- ⚠️ **Contextual safety** – Danger notices (electricity, sharp edges, etc.) are elevated to the top of the report.
- 🖨️ **Offline friendly** – One click triggers `window.print()` so you can export to PDF for the workshop.
- ♻️ **Zero-config resets** – Start a new scan instantly without refreshing the page.

## Tech Stack

- React 19 + TypeScript (component-driven UI, hooks for state)
- Vite 6 (fast dev server + build tooling)
- Google Gemini SDK (`@google/genai`) for multimodal reasoning
- Lucide icons for consistent vector graphics

## Data Flow

1. **Upload/drag & drop** via `components/UploadZone.tsx` converts the image to base64.
2. **Gemini call** in `services/geminiService.ts` sends the inline image + prompt, enforcing a strict JSON schema.
3. **App state** (`App.tsx`) stores loading/error/data via `AnalysisState`.
4. **Repair view** (`components/RepairGuide.tsx`) renders badges, safety blocks, and a checklist with completion tracking + PDF export.

## Project Structure

```
snap-to-spec/
├── App.tsx
├── components/
│   ├── Icons.tsx
│   ├── RepairGuide.tsx
│   └── UploadZone.tsx
├── services/
│   └── geminiService.ts
├── types.ts
├── index.tsx
├── vite.config.ts
└── package.json
```

## Getting Started

### 1. Prerequisites

- Node.js 20+ (LTS recommended)
- A Google AI Studio API key with access to Gemini 2.5 Flash

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` (or `.env`) file in the project root:

```
GEMINI_API_KEY=your-google-gemini-key
```

> `vite.config.ts` automatically exposes this value to the browser bundle via `process.env.API_KEY`, so keep the file out of version control.

### 4. Run the dev server

```bash
npm run dev
```

The app boots on `http://localhost:3000` by default. Use the UI to upload an image (JPG/PNG/WEBP up to 20 MB) and wait for the AI response.

### 5. Production build

```bash
npm run build
npm run preview
```

Deploy the `dist/` output to any static host (Vercel, Netlify, Azure Static Web Apps, etc.). Ensure the `GEMINI_API_KEY` environment variable is configured in the hosting platform so Vite can inject it at build time.

## Available Scripts

| Command           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Start Vite in development mode with hot module reload. |
| `npm run build`   | Produce an optimized production bundle.                |
| `npm run preview` | Serve the built bundle locally for final verification. |

## Customization Ideas

- Swap `model: "gemini-2.5-flash"` for another Gemini tier (e.g., Flash Lite) to balance latency vs. cost.
- Extend the JSON schema to capture replacement parts, QR links, or BOM data.
- Persist completed steps to localStorage so checkmarks survive refreshes.
- Pipe PDF export through a real generator (PDFKit, jsPDF) for richer offline docs.

## Troubleshooting

- **403/401 errors** – Verify the API key is valid, not restricted, and exposed as `GEMINI_API_KEY` before running `npm run dev` or `npm run build`.
- **Empty AI response** – The SDK throws if `response.text` is falsy; the UI surfaces a generic error. Inspect the console for Gemini quota or schema violations.
- **Styling artifacts** – Ensure your Tailwind/PostCSS setup runs during build if you customize the default styles; Vite ships unopinionated CSS so you can swap any utility framework in.

## License

This project inherits the license of the parent repository. Add one if you plan to release publicly.

# Mister Charts - Complete Recreation Guide

> A complete guide to recreate this React + TypeScript chart editor from scratch with zero bugs.

---

## Phase 1: Project Setup

### 1.1 Initialize Vite Project
```bash
npm create vite@latest mister-charts-react -- --template react-ts
cd mister-charts-react
```

### 1.2 Install All Dependencies
```bash
# Runtime dependencies
npm install react-router-dom lucide-react gif.js

# Dev dependencies (testing + deployment)
npm install -D @vitejs/plugin-react @testing-library/jest-dom @testing-library/react @testing-library/user-event @vitest/coverage-v8 vitest jsdom gh-pages
```

### 1.3 Configure package.json scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 1.4 Create vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mister-charts-react/', // IMPORTANT: Your GitHub repo name
})
```

### 1.5 Create vitest.config.ts
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['src/test/**', '**/*.test.{ts,tsx}', '**/*.d.ts'],
    },
  },
})
```

### 1.6 Create src/test/setup.ts
```typescript
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock canvas - CRITICAL for tests
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: [] })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
  arcTo: vi.fn(),
})) as unknown as typeof HTMLCanvasElement.prototype.getContext

HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock')
```

### 1.7 Update index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mister Charts</title>
    <!-- Google Fonts for chart styling -->
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk&family=Roboto&family=Open+Sans&family=Lato&family=Nunito&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 1.8 Copy Assets to public/
```
public/
├── gif.worker.js          # From gif.js package (required for GIF export)
└── img/
    └── chart/
        ├── bars.svg
        ├── circles.svg
        ├── donut.svg
        └── rectangles.svg
```

**CRITICAL:** The `gif.worker.js` file must be in the public folder for GIF export to work.

---

## Phase 2: Type Definitions

### 2.1 Create src/types/chart.types.ts
```typescript
export interface Term {
  label: string
  value: number
  color: string
}

export type ChartType = 'bars' | 'circles' | 'rectangles' | 'donut'
export type ValueType = 'value' | 'percent'

export interface ChartStyle {
  font: string
  fontSize: string
  backgroundColor: string
}

export interface Chart {
  title: string
  type: ChartType
  terms: Term[]
  style: ChartStyle
  valueType: ValueType
}

export interface SavedChart extends Chart {
  id: string
  thumbnail: string
  savedAt: string  // ISO string, not number
}

export interface ChartTypeInfo {
  type: ChartType
  name: string
  icon: string
}
```

### 2.2 Create src/types/gif.js.d.ts (TypeScript declaration for gif.js)
```typescript
declare module 'gif.js' {
  interface GIFOptions {
    workers?: number
    quality?: number
    width?: number
    height?: number
    workerScript?: string
    background?: string
    repeat?: number
    transparent?: string | null
    dither?: boolean | string
    debug?: boolean
  }

  interface AddFrameOptions {
    delay?: number
    copy?: boolean
    dispose?: number
  }

  class GIF {
    constructor(options?: GIFOptions)
    addFrame(
      element: HTMLCanvasElement | HTMLImageElement | ImageData,
      options?: AddFrameOptions
    ): void
    on(event: 'finished', callback: (blob: Blob) => void): void
    on(event: 'progress', callback: (progress: number) => void): void
    on(event: 'start' | 'abort', callback: () => void): void
    render(): void
    abort(): void
  }

  export default GIF
}
```

---

## Phase 3: Service Layer

### 3.1 Create src/services/util.service.ts
```typescript
const gChartColors = ['#8CB4FF', '#688FD9', '#6180BC', '#5B719A', '#52617E']
const gFonts = ['Arial', 'Space Grotesk', 'Roboto', 'Open Sans', 'Lato']

export function getNextChartColor(idx: number): string {
  return gChartColors[idx % gChartColors.length]
}

export function getChartColors(): string[] {
  return gChartColors
}

export function getFonts(): string[] {
  return gFonts
}

export function makeId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
```

### 3.2 Create src/services/gallery.service.ts
```typescript
import type { Chart, SavedChart } from '../types/chart.types'

const STORAGE_KEY = 'chartDB'

export function getSavedCharts(): SavedChart[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveChart(chartData: Chart, thumbnail: string): SavedChart {
  const charts = getSavedCharts()

  const newChart: SavedChart = {
    id: 'chart_' + Date.now(),
    title: chartData.title,
    type: chartData.type,
    style: { ...chartData.style },
    valueType: chartData.valueType,
    terms: chartData.terms.map((t) => ({ ...t })),
    thumbnail,
    savedAt: new Date().toISOString(),
  }

  charts.unshift(newChart)  // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(charts))

  return newChart
}

export function deleteChart(id: string): void {
  const charts = getSavedCharts()
  const filtered = charts.filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function getChartById(id: string): SavedChart | undefined {
  const charts = getSavedCharts()
  return charts.find((c) => c.id === id)
}
```

### 3.3 Create src/services/chart.service.ts
This is the largest file - contains chart types, default chart, and ALL rendering functions.

```typescript
import type { Chart, ChartTypeInfo, Term } from '../types/chart.types'
import { getNextChartColor } from './util.service'

const gChartTypes: ChartTypeInfo[] = [
  { type: 'circles', name: 'Circles', icon: 'circle-dot' },
  { type: 'donut', name: 'Donut', icon: 'circle-dashed' },
  { type: 'rectangles', name: 'Rectangles', icon: 'rectangle-horizontal' },
  { type: 'bars', name: 'Bars', icon: 'chart-column' },
]

export function getChartTypes(): ChartTypeInfo[] {
  return gChartTypes
}

export function createTerm(idx: number): Term {
  return {
    label: '',
    value: 1,
    color: getNextChartColor(idx),
  }
}

export function getDefaultChart(): Chart {
  return {
    type: 'circles',
    title: 'Elections Results',
    style: {
      font: 'Arial',
      fontSize: '45px',
      backgroundColor: 'transparent',
    },
    valueType: 'value',
    terms: [createTerm(0), createTerm(1)],
  }
}

// CRITICAL: Easing function for smooth animations
export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// Main render function - dispatches to specific chart type
export function renderChart(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  progress: number = 1
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  renderChartTitle(ctx, chart)

  switch (chart.type) {
    case 'bars':
      renderBarsChart(ctx, chart, progress)
      break
    case 'circles':
      renderCirclesChart(ctx, chart, progress)
      break
    case 'rectangles':
      renderRectanglesChart(ctx, chart, progress)
      break
    case 'donut':
      renderDonutChart(ctx, chart, progress)
      break
  }

  renderChartLegend(ctx, chart, progress)
}

// Helper: Staggered progress for sequential animations
function getStaggeredProgress(
  progress: number,
  idx: number,
  count: number,
  staggerAmount: number = 0.3
): number {
  if (count <= 1) return progress
  const delay = (idx / (count - 1)) * staggerAmount
  return Math.max(0, Math.min(1, (progress - delay) / (1 - staggerAmount)))
}

// ... (Include all rendering functions: renderBarsChart, renderCirclesChart, 
//      renderRectanglesChart, renderDonutChart, renderChartTitle, renderChartLegend,
//      drawRoundedBar, drawRoundedRect, hexToRgba, wrapText, etc.)
```

**KEY RENDERING DETAILS:**
- Use `getStaggeredProgress()` for sequential term animations
- Legend fades in at 70% progress: `const legendProgress = Math.max(0, (progress - 0.7) / 0.3)`
- Always clear canvas and fill white background first
- Title at top (y=40), legend at bottom (y=height-80)

---

## Phase 4: Custom Hooks

### 4.1 Create src/hooks/useChart.ts
```typescript
import { useState, useCallback } from 'react'
import type { Chart, Term, ChartType, ValueType } from '../types/chart.types'
import { getDefaultChart, createTerm } from '../services/chart.service'

export function useChart(initialChart?: Chart) {
  const [chart, setChart] = useState<Chart>(initialChart || getDefaultChart())

  const updateTitle = useCallback((title: string) => {
    setChart((prev) => ({ ...prev, title }))
  }, [])

  const updateType = useCallback((type: ChartType) => {
    setChart((prev) => ({ ...prev, type }))
  }, [])

  const updateTerm = useCallback((idx: number, key: keyof Term, value: string | number) => {
    setChart((prev) => ({
      ...prev,
      terms: prev.terms.map((term, i) =>
        i === idx ? { ...term, [key]: value } : term
      ),
    }))
  }, [])

  const addTerm = useCallback(() => {
    setChart((prev) => {
      if (prev.terms.length >= 5) return prev  // Max 5 terms
      return {
        ...prev,
        terms: [...prev.terms, createTerm(prev.terms.length)],
      }
    })
  }, [])

  const removeTerm = useCallback((idx: number) => {
    setChart((prev) => {
      if (prev.terms.length <= 2) return prev  // Min 2 terms
      return {
        ...prev,
        terms: prev.terms.filter((_, i) => i !== idx),
      }
    })
  }, [])

  const setValueType = useCallback((valueType: ValueType) => {
    setChart((prev) => ({ ...prev, valueType }))
  }, [])

  const setFont = useCallback((font: string) => {
    setChart((prev) => ({
      ...prev,
      style: { ...prev.style, font },
    }))
  }, [])

  const loadChart = useCallback((newChart: Chart) => {
    setChart(newChart)
  }, [])

  const resetChart = useCallback(() => {
    setChart(getDefaultChart())
  }, [])

  return {
    chart, updateTitle, updateType, updateTerm,
    addTerm, removeTerm, setValueType, setFont,
    loadChart, resetChart,
  }
}
```

### 4.2 Create src/hooks/useAnimation.ts
```typescript
import { useRef, useCallback } from 'react'
import { easeOut } from '../services/chart.service'

export function useAnimation(duration: number = 2000) {
  const animationRef = useRef<number | null>(null)

  const animate = useCallback(
    (onFrame: (progress: number) => void, onComplete?: () => void) => {
      // Cancel any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      const startTime = performance.now()  // Use performance.now() for accuracy

      const tick = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const rawProgress = Math.min(elapsed / duration, 1)
        const progress = easeOut(rawProgress)  // Apply easing

        onFrame(progress)

        if (rawProgress < 1) {
          animationRef.current = requestAnimationFrame(tick)
        } else {
          animationRef.current = null
          onComplete?.()
        }
      }

      animationRef.current = requestAnimationFrame(tick)
    },
    [duration]
  )

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])

  return { animate, stop }
}
```

---

## Phase 5: Entry Points

### 5.1 Create src/main.tsx
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'  // CRITICAL: Use HashRouter for GitHub Pages!
import { App } from './App'
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
```

**CRITICAL:** Use `HashRouter` not `BrowserRouter` for GitHub Pages deployment. URLs will be `/#/editor` instead of `/editor`.

### 5.2 Create src/App.tsx
```tsx
import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { HomePage } from './components/HomePage/HomePage'
import { Editor } from './components/Editor/Editor'
import { Gallery } from './components/Gallery/Gallery'
import { UserMsg } from './components/common/UserMsg'

export function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
      <UserMsg />
    </>
  )
}
```

---

## Phase 6: Components

### 6.1 File Structure
```
src/components/
├── common/
│   └── UserMsg.tsx          # Toast notifications
├── Header/
│   └── Header.tsx           # Navigation
├── HomePage/
│   └── HomePage.tsx         # Landing page
├── Editor/
│   ├── Editor.tsx           # Main container (state management)
│   ├── ChartTypeSelector.tsx
│   ├── TermsEditor.tsx
│   ├── TermRow.tsx
│   ├── ColorPicker.tsx
│   ├── ChartCanvas.tsx      # forwardRef canvas wrapper
│   ├── ChartActions.tsx     # Preview/Download/Save buttons
│   └── DownloadModal.tsx
└── Gallery/
    ├── Gallery.tsx
    └── GalleryCard.tsx
```

### 6.2 UserMsg.tsx (Event-based toast system)
```tsx
import { useEffect, useState, useCallback } from 'react'

// Global listener pattern - no context needed
const listeners: Set<(msg: string) => void> = new Set()

export function showUserMsg(msg: string) {
  listeners.forEach((listener) => listener(msg))
}

export function UserMsg() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const handleMessage = useCallback((msg: string) => {
    setMessage(msg)
    setVisible(true)
    setTimeout(() => setVisible(false), 2000)
  }, [])

  useEffect(() => {
    listeners.add(handleMessage)
    return () => { listeners.delete(handleMessage) }
  }, [handleMessage])

  return (
    <div className={`user-msg ${visible ? 'visible' : ''}`}>
      {message}
    </div>
  )
}
```

### 6.3 ChartCanvas.tsx (forwardRef pattern)
```tsx
import { forwardRef } from 'react'

export const ChartCanvas = forwardRef<HTMLCanvasElement>((_, ref) => {
  return (
    <div className="canvas-wrapper">
      <canvas ref={ref} width={600} height={500} />
    </div>
  )
})

ChartCanvas.displayName = 'ChartCanvas'  // Required for React DevTools
```

### 6.4 ChartTypeSelector.tsx
```tsx
import type { ChartType } from '../../types/chart.types'
import { getChartTypes } from '../../services/chart.service'

interface Props {
  currentType: ChartType
  onSelect: (type: ChartType) => void
}

export function ChartTypeSelector({ currentType, onSelect }: Props) {
  const chartTypes = getChartTypes()

  return (
    <section className="chart-types-container">
      {chartTypes.map((chart) => (
        <div
          key={chart.type}
          className={`chart-type ${currentType === chart.type ? 'active' : ''}`}
          onClick={() => onSelect(chart.type)}
        >
          {/* CRITICAL: Use relative path (no leading /) for GitHub Pages */}
          <img src={`img/chart/${chart.type}.svg`} alt={`${chart.name} icon`} />
          <h5>{chart.name}</h5>
        </div>
      ))}
    </section>
  )
}
```

### 6.5 Editor.tsx (Main component - complex state)
Key patterns:
- Use `useParams` to get chart ID for editing
- Canvas resizes to container width
- Render on every chart/progress change
- GIF generation uses dynamic import and relative worker path

```tsx
// GIF export - CRITICAL: Use relative path for worker
const gif = new GIF({
  workers: 2,
  quality: 10,
  width: canvas.width,
  height: canvas.height,
  workerScript: 'gif.worker.js',  // NO leading slash!
  background: '#ffffff',
})
```

---

## Phase 7: GitHub Pages Deployment

### 7.1 Create .github/workflows/deploy.yml
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 7.2 Enable GitHub Pages
1. Go to repo Settings → Pages
2. Source: "GitHub Actions"

---

## Common Pitfalls & Solutions

| Problem | Solution |
|---------|----------|
| Images/assets not loading on GH Pages | Use relative paths (`img/...`) not absolute (`/img/...`) |
| Routes broken on GH Pages | Use `HashRouter` instead of `BrowserRouter` |
| GIF export fails | Ensure `gif.worker.js` is in `public/` with relative path |
| Tests fail with canvas errors | Mock canvas in test setup |
| `vi` not found in setup.ts | Add `import { vi } from 'vitest'` |
| TypeScript errors on unused params | Prefix with underscore: `(_cb)` |
| Build fails on deploy | Run `npm run build` locally first to catch errors |

---

## Testing Checklist

- [ ] All 4 chart types render correctly
- [ ] Animation plays smoothly on preview
- [ ] PNG download works
- [ ] GIF download completes (check worker path!)
- [ ] Save to gallery creates thumbnail
- [ ] Load from gallery restores all chart data
- [ ] Delete from gallery works
- [ ] Color picker updates term colors
- [ ] Value/percent toggle switches display mode
- [ ] Min 2 / Max 5 terms enforced
- [ ] Works on GitHub Pages (HashRouter + relative paths)

---

## Final Notes

1. **Canvas rendering** - Keep complex drawing logic in service, not component
2. **State management** - `useChart` hook centralizes all chart mutations
3. **Animation** - Use `performance.now()` + `easeOut()` for smooth animations
4. **GIF generation** - Dynamic import of gif.js, render frames in loop
5. **Testing** - Mock canvas/localStorage in setup, not each test

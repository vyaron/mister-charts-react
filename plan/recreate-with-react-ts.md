# Plan 13: Recreate with React & TypeScript

## Overview
Migrate Mister Charts from vanilla JS to React + TypeScript while preserving all functionality.

## Phase 1: Project Setup

### 1.1 Initialize Vite Project
```bash
npm create vite@latest mister-charts-react -- --template react-ts
cd mister-charts-react
npm install
```

### 1.2 Install Dependencies
```bash
npm install react-router-dom lucide-react gif.js
npm install -D @types/gif.js
```

### 1.3 Copy Assets
- Copy `css/` folder (reuse existing styles)
- Copy `js/lib/gif.worker.js`

---

## Phase 2: Type Definitions

### 2.1 Create `src/types/chart.types.ts`
```typescript
export interface Term {
  id: string
  txt: string
  val: number
  color: string
}

export type ChartType = 'bars' | 'circles' | 'rectangles' | 'donut'
export type ValueMode = 'value' | 'percent'

export interface ChartStyle {
  font: string
  valueMode: ValueMode
}

export interface Chart {
  title: string
  type: ChartType
  terms: Term[]
  style: ChartStyle
}

export interface SavedChart extends Chart {
  id: string
  thumbnail: string
  savedAt: number
}
```

---

## Phase 3: Services (Keep Logic, Add Types)

### 3.1 `src/services/util.service.ts`
- `makeId(): string`
- `getFonts(): string[]`
- `getColors(): string[]`

### 3.2 `src/services/chart.service.ts`
- `getDefaultChart(): Chart`
- `getChartTypes(): ChartTypeInfo[]`
- Rendering functions (keep canvas logic as-is)

### 3.3 `src/services/gallery.service.ts`
- `getSavedCharts(): SavedChart[]`
- `saveChart(chart: Chart, thumbnail: string): void`
- `deleteChart(id: string): void`
- `getChartById(id: string): SavedChart | undefined`

---

## Phase 4: Custom Hooks

### 4.1 `src/hooks/useChart.ts`
```typescript
import { useState } from 'react'
import { Chart, Term, ChartType, ValueMode } from '../types/chart.types'
import { getDefaultChart } from '../services/chart.service'

export function useChart() {
  const [chart, setChart] = useState<Chart>(getDefaultChart())

  const updateTitle = (title: string) => setChart(prev => ({ ...prev, title }))
  const updateType = (type: ChartType) => setChart(prev => ({ ...prev, type }))
  const updateTerm = (id: string, updates: Partial<Term>) => { ... }
  const addTerm = () => { ... }
  const removeTerm = (id: string) => { ... }
  const setValueMode = (mode: ValueMode) => { ... }
  const setFont = (font: string) => { ... }
  const loadChart = (newChart: Chart) => setChart(newChart)

  return { chart, updateTitle, updateType, updateTerm, addTerm, removeTerm, setValueMode, setFont, loadChart }
}
```

### 4.2 `src/hooks/useAnimation.ts`
```typescript
import { useRef, useCallback } from 'react'

export function useAnimation(duration: number = 2000) {
  const animationRef = useRef<number | null>(null)

  const animate = useCallback((onFrame: (progress: number) => void, onComplete?: () => void) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      onFrame(progress)
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(tick)
      } else {
        onComplete?.()
      }
    }
    tick()
  }, [duration])

  const stop = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
  }, [])

  return { animate, stop }
}
```

---

## Phase 5: Component Structure

```
src/
├── components/
│   ├── Header/
│   │   └── Header.tsx
│   ├── HomePage/
│   │   └── HomePage.tsx
│   ├── Editor/
│   │   ├── Editor.tsx           # Main editor container
│   │   ├── ChartTypeSelector.tsx
│   │   ├── TermsEditor.tsx
│   │   ├── TermRow.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── ChartCanvas.tsx      # Canvas + rendering
│   │   ├── ChartActions.tsx     # Preview, Download, Save buttons
│   │   └── DownloadModal.tsx
│   ├── Gallery/
│   │   ├── Gallery.tsx
│   │   └── GalleryCard.tsx
│   └── common/
│       └── UserMsg.tsx
├── hooks/
│   ├── useChart.ts
│   └── useAnimation.ts
├── services/
│   ├── chart.service.ts
│   ├── gallery.service.ts
│   └── util.service.ts
├── types/
│   └── chart.types.ts
├── App.tsx
└── main.tsx
```

---

## Phase 6: Component Details

### 6.1 App.tsx
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { HomePage } from './components/HomePage/HomePage'
import { Editor } from './components/Editor/Editor'
import { Gallery } from './components/Gallery/Gallery'

export function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
```

### 6.2 Editor.tsx
```tsx
import { useChart } from '../../hooks/useChart'
import { useAnimation } from '../../hooks/useAnimation'
import { ChartTypeSelector } from './ChartTypeSelector'
import { TermsEditor } from './TermsEditor'
import { ChartCanvas } from './ChartCanvas'
import { ChartActions } from './ChartActions'

export function Editor() {
  const { chart, ...chartActions } = useChart()
  const { animate, stop } = useAnimation()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load chart from URL param if editing from gallery
  // Render chart on canvas
  // Handle preview, download, save

  return (
    <section className="page editor-page active">
      <div className="flex">
        <div className="panel chart-editor">
          <input ... />
          <ChartTypeSelector type={chart.type} onSelect={chartActions.updateType} />
          <TermsEditor terms={chart.terms} onUpdate={...} />
          ...
        </div>
        <div className="chart-preview">
          <ChartCanvas ref={canvasRef} chart={chart} />
          <ChartActions onPreview={...} onDownload={...} onSave={...} />
        </div>
      </div>
    </section>
  )
}
```

### 6.3 ChartCanvas.tsx
```tsx
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Chart } from '../../types/chart.types'
import { renderBarsChart, renderCirclesChart, ... } from '../../services/chart.service'

interface Props {
  chart: Chart
  progress?: number
}

export const ChartCanvas = forwardRef<HTMLCanvasElement, Props>(({ chart, progress = 1 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useImperativeHandle(ref, () => canvasRef.current!)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')!
    // Clear and render based on chart.type
    switch (chart.type) {
      case 'bars': renderBarsChart(ctx, chart, progress); break
      case 'circles': renderCirclesChart(ctx, chart, progress); break
      // ...
    }
  }, [chart, progress])

  return <canvas ref={canvasRef} width={600} height={500} />
})
```

---

## Phase 7: Migration Checklist

### Services
- [ ] util.service.ts - Copy & add types
- [ ] chart.service.ts - Copy render functions, add types
- [ ] gallery.service.ts - Copy & add types

### Components
- [ ] Header
- [ ] HomePage
- [ ] Editor (main)
- [ ] ChartTypeSelector
- [ ] TermsEditor + TermRow
- [ ] ColorPicker
- [ ] ChartCanvas
- [ ] ChartActions
- [ ] DownloadModal
- [ ] Gallery
- [ ] GalleryCard
- [ ] UserMsg (toast)

### Features
- [ ] Chart rendering (all 4 types)
- [ ] Staggered animation
- [ ] Preview animation loop
- [ ] GIF export
- [ ] PNG export
- [ ] Save to gallery
- [ ] Load from gallery (edit)
- [ ] Delete from gallery
- [ ] Color picker
- [ ] Font selector
- [ ] Value/percent toggle

### Styling
- [ ] Copy CSS files to src/styles/
- [ ] Update imports in main.tsx

---

## Phase 8: Testing & Polish

1. Test all chart types render correctly
2. Test animations play smoothly
3. Test GIF export works (check worker path)
4. Test gallery CRUD operations
5. Test responsive layout
6. Add error boundaries
7. Add loading states

---

## Notes

- Keep canvas rendering logic mostly unchanged (it works well)
- The main benefit of React: cleaner state management and component composition
- Consider Zustand if state gets complex across components
- CSS can be reused as-is or converted to CSS Modules for scoping

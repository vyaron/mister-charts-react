import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useChart } from '../../hooks/useChart'
import { useAnimation } from '../../hooks/useAnimation'
import { ChartTypeSelector } from './ChartTypeSelector'
import { TermsEditor } from './TermsEditor'
import { ChartCanvas } from './ChartCanvas'
import { ChartActions } from './ChartActions'
import { DownloadModal } from './DownloadModal'
import { getChartById } from '../../services/gallery.service'
import { saveChart } from '../../services/gallery.service'
import { getFonts } from '../../services/util.service'
import { renderChart, easeOut } from '../../services/chart.service'
import { showUserMsg } from '../common/UserMsg'

export function Editor() {
  const { id } = useParams<{ id: string }>()
  const { chart, updateTitle, updateType, updateTerm, addTerm, removeTerm, setValueType, setFont, loadChart } = useChart()
  const { animate } = useAnimation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateProgress, setGenerateProgress] = useState(0)

  // Load chart from gallery if editing
  useEffect(() => {
    if (id) {
      const savedChart = getChartById(id)
      if (savedChart) {
        loadChart({
          title: savedChart.title,
          type: savedChart.type,
          style: savedChart.style,
          valueType: savedChart.valueType,
          terms: savedChart.terms,
        })
      }
    }
  }, [id, loadChart])

  // Render chart whenever it changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = 500
    }

    renderChart(ctx, chart, progress)
  }, [chart, progress])

  const handlePreview = useCallback(() => {
    animate((p) => setProgress(p))
  }, [animate])

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    setProgress(1)
    setTimeout(() => {
      const thumbnail = canvas.toDataURL('image/png')
      saveChart(chart, thumbnail)
      showUserMsg('Chart saved to gallery!')
    }, 50)
  }, [chart])

  const handleDownloadPNG = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    setProgress(1)
    setTimeout(() => {
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `${chart.title || 'chart'}.png`
      a.click()
      setShowModal(false)
    }, 50)
  }, [chart.title])

  const handleDownloadGIF = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsGenerating(true)
    setGenerateProgress(0)

    // Dynamic import of gif.js
    const GIF = (await import('gif.js')).default

    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvas.width,
      height: canvas.height,
      workerScript: 'gif.worker.js',
      background: '#ffffff',
    })

    const totalFrames = 60
    const frameDelay = 33
    const ctx = canvas.getContext('2d')!

    // Generate frames
    for (let i = 0; i <= totalFrames; i++) {
      const p = easeOut(i / totalFrames)
      renderChart(ctx, chart, p)
      gif.addFrame(canvas, { copy: true, delay: frameDelay })
      setGenerateProgress((i / totalFrames) * 80)
    }

    // Hold final frame
    for (let i = 0; i < 15; i++) {
      gif.addFrame(canvas, { copy: true, delay: frameDelay })
    }

    gif.on('progress', (p: number) => {
      setGenerateProgress(80 + p * 20)
    })

    gif.on('finished', (blob: Blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${chart.title || 'chart'}.gif`
      a.click()
      URL.revokeObjectURL(url)
      setIsGenerating(false)
      setShowModal(false)
    })

    gif.render()
  }, [chart])

  const fonts = getFonts()

  return (
    <section className="editor-page">
      <h3>Editor</h3>
      <div className="flex">
        <div className="panel chart-editor">
          <input
            type="text"
            placeholder="Chart Title"
            className="chart-title-input"
            value={chart.title}
            onChange={(e) => updateTitle(e.target.value)}
          />

          <TermsEditor
            terms={chart.terms}
            onUpdateTerm={updateTerm}
            onAddTerm={addTerm}
            onRemoveTerm={removeTerm}
          />

          <div className="terms-actions">
            <button
              className="add-term-btn"
              onClick={addTerm}
              disabled={chart.terms.length >= 5}
            >
              Add variable <span className="icon">+</span>
            </button>
            <div className="value-toggle">
              <button
                className={`toggle-option ${chart.valueType === 'percent' ? 'active' : ''}`}
                onClick={() => setValueType('percent')}
              >
                %
              </button>
              <button
                className={`toggle-option ${chart.valueType === 'value' ? 'active' : ''}`}
                onClick={() => setValueType('value')}
              >
                123
              </button>
            </div>
          </div>

          <div className="field font-field">
            <label>Font</label>
            <select
              className="font-select"
              value={chart.style.font}
              onChange={(e) => setFont(e.target.value)}
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="panel chart-preview">
          <div className="chart-preview-layout">
            <ChartCanvas ref={canvasRef} />
            <ChartActions
              onPreview={handlePreview}
              onSave={handleSave}
              onDownload={() => setShowModal(true)}
            />
          </div>
          <ChartTypeSelector
            currentType={chart.type}
            onSelect={(type) => {
              updateType(type)
              handlePreview()
            }}
          />
        </div>
      </div>

      {showModal && (
        <DownloadModal
          isGenerating={isGenerating}
          progress={generateProgress}
          onDownloadGIF={handleDownloadGIF}
          onDownloadPNG={handleDownloadPNG}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  )
}

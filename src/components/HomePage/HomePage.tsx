import { useNavigate } from 'react-router-dom'
import { Plus, BarChart3, Play, Download } from 'lucide-react'

export function HomePage() {
  const navigate = useNavigate()

  return (
    <section className="home-page">
      <div className="home-hero">
        <h2>Create Beautiful Animated Charts</h2>
        <p>
          Turn your data into eye-catching animated GIFs in seconds. Perfect for
          social media, presentations, and more.
        </p>
        <button className="home-cta" onClick={() => navigate('/editor')}>
          <Plus />
          Create Chart
        </button>
      </div>
      <div className="home-features">
        <div className="home-feature">
          <BarChart3 />
          <h4>Multiple Chart Types</h4>
          <p>Choose from bars, circles, rectangles, and donut charts</p>
        </div>
        <div className="home-feature">
          <Play />
          <h4>Smooth Animations</h4>
          <p>Beautiful animated transitions that bring your data to life</p>
        </div>
        <div className="home-feature">
          <Download />
          <h4>Export as GIF</h4>
          <p>Download your animated charts as GIF or PNG images</p>
        </div>
      </div>
    </section>
  )
}

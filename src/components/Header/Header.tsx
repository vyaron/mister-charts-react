import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="main-header">
      <h1>Mister Charts</h1>
      <nav>
        <Link to="/" className="btn">Home</Link>
        <Link to="/editor" className="btn">Editor</Link>
        <Link to="/gallery" className="btn">Gallery</Link>
      </nav>
    </header>
  )
}

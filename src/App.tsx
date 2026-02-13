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

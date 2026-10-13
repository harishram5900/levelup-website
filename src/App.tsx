import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Matching from './pages/Matching'
import Questionnaire from './pages/Questionnaire'
import Results from './pages/Results'
import Saved from './pages/Saved'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const focused = pathname === '/start' || pathname === '/matching'
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/start" element={<Questionnaire />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/results" element={<Results />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      {!focused && <Footer />}
    </div>
  )
}

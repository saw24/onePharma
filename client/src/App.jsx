import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import PointOfSaleDetailPage from './pages/PointOfSaleDetailPage'
import AdminPage from './pages/AdminPage'

function App() {
  const [navbarOpen, setNavbarOpen] = useState(false)

  return (
    <>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            onePharma
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`navbar-collapse ${navbarOpen ? 'show' : ''}`}
            style={{ display: navbarOpen ? 'block' : 'none' }}
            onClick={() => setNavbarOpen(false)}
          >
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Recherche</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="min-vh-100 bg-light">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pos/:id" element={<PointOfSaleDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
// App.jsx
import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import PharmacieListePage from './pages/PharmacieListePage'
function App() {
  const [navbarOpen, setNavbarOpen] = useState(false)

  return (
    <>
      {/* Header et Navigation fusionnés */}
      <header className="text-white text-center py-4" style={{ backgroundColor: '#1E88E5'}}> {/* Header avec la couleur bleue */}
        <h1 className="mb-0"> {/* Titre principal du header */}
          <span className="icon">💊</span> {/* Icône ajoutée */}
          OnePharma Niger
        </h1>
        <p className="lead mb-0"> {/* Description du header */}
          Trouvez vos médicaments et produits pharmaceutiques rapidement, partout au Niger.
        </p>
      </header>

      {/* Navigation (collée au header) */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1E88E5'}}> {/* bg-primary pour correspondre au header */}
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/"> {/* Le logo reste peut-être ici aussi, ou est dans le header */}
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
                <li className="nav-item">
                  <Link className="nav-link" to="/pharmacies">Pharmacies</Link> 
                </li>
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="min-vh-100 bg-light"> {/* bg-light rétabli pour le contenu principal */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pharmacies" element={<PharmacieListePage />} /> {/* Nouvelle route pour la liste des pharmacies */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>

      {/* Footer (facultatif, vous pouvez aussi le déplacer ici si souhaité) */}
      <footer className="text-center py-3 small text-muted text-white" style={{ backgroundColor: '#1E88E5', color: '#fff'}}>
        © 2025 OnePharma Niger – Votre santé à portée de main
      </footer>
    </>
  )
}

export default App
// App.jsx
import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import PharmacieListePage from './pages/PharmacieListePage'

function App() {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Simulation de connexion - à remplacer par votre logique d'authentification
    if (username === "saw24" && password === "saw24") {
      setIsAuthenticated(true)
      setShowLoginModal(false)
      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminMenuOpen(false)
  }

  return (
    <>
      {/* Header et Navigation fusionnés */}
      <header className="text-white text-center py-4" style={{ backgroundColor: '#1E88E5'}}> 
        <h1 className="mb-0">
          <span className="icon">💊</span>
          OnePharma Niger
        </h1>
        <p className="lead mb-0">
          Trouvez vos médicaments et produits pharmaceutiques rapidement, partout au Niger.
        </p>
      </header>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1565C0'}}> 
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
          >
            <ul className="navbar-nav ms-auto">
              {/* Menu Admin - Affiché uniquement si connecté */}
              {isAuthenticated ? (
                <li className="nav-item dropdown position-relative">
                  <button
                    className="nav-link btn btn-link text-white d-flex align-items-center gap-2"
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    style={{ 
                      textDecoration: 'none',
                      background: 'none',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 15c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    Admin
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      style={{ 
                        transform: adminMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  
                  {/* Menu déroulant moderne */}
                  {adminMenuOpen && (
                    <div 
                      className="position-absolute mt-1 rounded-3 shadow-lg overflow-hidden"
                      style={{
                        top: '100%',
                        right: 0,
                        minWidth: '220px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        zIndex: 1000,
                        animation: 'slideDown 0.2s ease'
                      }}
                    >
                      <Link 
                        to="/" 
                        className="d-flex align-items-center gap-3 px-4 py-3 text-decoration-none"
                        style={{
                          color: '#424242',
                          transition: 'all 0.2s ease',
                          borderBottom: '1px solid #f5f5f5'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#E3F2FD'
                          e.currentTarget.style.paddingLeft = '1.25rem'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.paddingLeft = '1rem'
                        }}
                        onClick={() => {
                          setAdminMenuOpen(false)
                          setNavbarOpen(false)
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7"/>
                          <rect x="14" y="3" width="7" height="7"/>
                          <rect x="14" y="14" width="7" height="7"/>
                          <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        <span className="fw-medium">Accueil</span>
                      </Link>
                      
                      <Link 
                        to="/pharmacies" 
                        className="d-flex align-items-center gap-3 px-4 py-3 text-decoration-none"
                        style={{
                          color: '#424242',
                          transition: 'all 0.2s ease',
                          borderBottom: '1px solid #f5f5f5'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#E3F2FD'
                          e.currentTarget.style.paddingLeft = '1.25rem'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.paddingLeft = '1rem'
                        }}
                        onClick={() => {
                          setAdminMenuOpen(false)
                          setNavbarOpen(false)
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        <span className="fw-medium">Pharmacies</span>
                      </Link>

                      {/* Bouton de déconnexion */}
                      <button 
                        onClick={handleLogout}
                        className="d-flex align-items-center gap-3 px-4 py-3 text-decoration-none w-100 border-0"
                        style={{
                          color: '#d32f2f',
                          transition: 'all 0.2s ease',
                          backgroundColor: 'transparent',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffebee'
                          e.currentTarget.style.paddingLeft = '1.25rem'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.paddingLeft = '1rem'
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span className="fw-medium">Déconnexion</span>
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                /* Bouton de connexion - Affiché si non connecté */
                <li className="nav-item">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="btn btn-light d-flex align-items-center gap-2 mx-2"
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '8px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Connexion
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal de connexion */}
      {showLoginModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setShowLoginModal(false)}
        >
          <div 
            className="bg-white rounded-4 shadow-lg p-4"
            style={{
              maxWidth: '420px',
              width: '90%',
              animation: 'slideUp 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête du modal */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0 fw-bold" style={{ color: '#1E88E5' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Connexion Admin
              </h3>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="btn btn-link text-dark p-0"
                style={{ fontSize: '1.5rem', textDecoration: 'none' }}
              >
                ×
              </button>
            </div>

            {/* Formulaire de connexion */}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-medium">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Entrez votre nom d'utilisateur"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-medium">
                  Mot de passe
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fw-medium"
                style={{
                  backgroundColor: '#1E88E5',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1565C0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E88E5'}
              >
                Se connecter
              </button>
            </form>

            <p className="text-center text-muted small mt-3 mb-0">
              Accès réservé aux administrateurs
            </p>
          </div>
        </div>
      )}

      {/* Styles pour les animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Contenu principal */}
      <div className="min-vh-100 bg-light">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pharmacies" element={<PharmacieListePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 small text-white" style={{ backgroundColor: '#1E88E5'}}>
        © 2025 OnePharma Niger – Votre santé à portée de main
      </footer>
    </>
  )
}

export default App
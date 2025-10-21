import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Card, Badge, Spinner, Button } from 'react-bootstrap'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function PointOfSaleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pos, setPos] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer les résultats depuis sessionStorage
    const savedResults = sessionStorage.getItem('searchResults')
    if (!savedResults) {
      navigate('/')
      return
    }

    // Trouver le point de vente correspondant
    const results = JSON.parse(savedResults)
    const foundPos = results.find(p => p.id === id)
    
    if (!foundPos) {
      navigate('/')
      return
    }

    setPos(foundPos)
    setLoading(false)
  }, [id, navigate])

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container py-5">
          <div className="text-center py-5">
            <Spinner 
              animation="border" 
              role="status"
              style={{ 
                width: '48px', 
                height: '48px',
                color: '#1E88E5',
                borderWidth: '3px'
              }}
            />
            <p className="text-muted mt-3 mb-0">Chargement des détails...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!pos) {
    return (
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container py-5">
          <Card className="border-0 shadow-sm" style={{ borderRadius: '12px', maxWidth: '600px', margin: '0 auto' }}>
            <Card.Body className="p-5 text-center">
              <div 
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#ffebee',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '36px'
                }}
              >
                ⚠️
              </div>
              <h4 className="mb-3">Point de vente non trouvé</h4>
              <p className="text-muted mb-4">Le point de vente demandé n'existe pas.</p>
              <Button
                variant="primary"
                onClick={() => navigate('/')}
                style={{
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontWeight: '600'
                }}
              >
                Retour à l'accueil
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4">
        {/* Bouton retour */}
        <Button
          variant="light"
          onClick={() => navigate(-1)}
          className="mb-4"
          style={{
            borderRadius: '8px',
            padding: '10px 20px',
            fontWeight: '600',
            border: '2px solid #e9ecef',
            transition: 'all 0.2s ease'
          }}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ verticalAlign: 'middle', marginRight: '8px' }}
          >
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Retour aux résultats
        </Button>

        {/* En-tête du point de vente */}
        <Card 
          className="border-0 shadow-sm mb-4"
          style={{
            background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
            borderRadius: '16px'
          }}
        >
          <Card.Body className="p-4">
            <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <div 
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}
                >
                  🏥
                </div>
                <div>
                  <h2 className="text-white mb-2 fw-bold">{pos.name}</h2>
                  <div className="d-flex gap-2 flex-wrap">
                    <Badge bg="light" text="primary" className="d-flex align-items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                      </svg>
                      {pos.matchingProducts.length} produit{pos.matchingProducts.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              </div>
              <div 
                className="text-end"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 20px'
                }}
              >
                <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>Total</div>
                <div className="text-white fw-bold" style={{ fontSize: '24px' }}>{pos.totalAmount.toLocaleString()} FCFA</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <div className="row">
          {/* Colonne informations de contact */}
          <div className="col-lg-4 mb-4">
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-4">
                <h5 className="mb-4 fw-bold" style={{ color: '#1E88E5' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Contact
                </h5>

                {/* Téléphone */}
                <div className="mb-3">
                  <div className="d-flex align-items-center gap-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                    <div 
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#E3F2FD',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#6c757d', fontWeight: '500' }}>Téléphone</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#212529' }}>{pos.phone}</div>
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <div className="d-flex align-items-start gap-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                    <div 
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#E3F2FD',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#6c757d', fontWeight: '500' }}>Adresse</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#212529', lineHeight: '1.4' }}>{pos.address}</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Colonne produits disponibles */}
          <div className="col-lg-8 mb-4">
            <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <Card.Body className="p-4">
                <h5 className="mb-4 fw-bold" style={{ color: '#1E88E5' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                    <path d="M20 7h-9a2 2 0 0 1-2-2V2"/>
                    <path d="M9 2v5a2 2 0 0 0 2 2h9"/>
                    <path d="M3 7.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/>
                  </svg>
                  Produits disponibles ({pos.matchingProducts.length})
                </h5>

                <div className="products-list">
                  {pos.matchingProducts.map((product, index) => (
                    <div 
                      key={index}
                      className="mb-3"
                      style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '2px solid #e9ecef',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#1E88E5';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 136, 229, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e9ecef';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <div 
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: '#E3F2FD',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px'
                              }}
                            >
                              💊
                            </div>
                            <strong style={{ fontSize: '16px', color: '#212529' }}>{product.name}</strong>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <Badge 
                              bg={product.availableQuantity > 10 ? 'success' : product.availableQuantity > 5 ? 'warning' : 'danger'}
                              style={{ fontSize: '12px', padding: '4px 8px' }}
                            >
                              Stock: {product.availableQuantity} unités
                            </Badge>
                          </div>
                        </div>
                        <div className="text-end">
                          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1E88E5' }}>
                            {product.price.toLocaleString()} FCFA
                          </div>
                          <div style={{ fontSize: '13px', color: '#6c757d' }}>
                            par unité
                          </div>
                          <div 
                            className="mt-2 pt-2"
                            style={{
                              borderTop: '1px solid #dee2e6',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#495057'
                            }}
                          >
                            Total: {product.total.toLocaleString()} FCFA
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total général */}
                <div 
                  className="mt-4 p-4"
                  style={{
                    backgroundColor: '#E3F2FD',
                    borderRadius: '12px',
                    border: '2px solid #1E88E5'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div style={{ fontSize: '14px', color: '#1565C0', fontWeight: '500' }}>Montant total</div>
                      <div style={{ fontSize: '12px', color: '#1565C0' }}>
                        Pour {pos.matchingProducts.length} produit{pos.matchingProducts.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-end">
                      <div style={{ fontSize: '32px', fontWeight: '700', color: '#1E88E5' }}>
                        {pos.totalAmount.toLocaleString()} 
                        <span style={{ fontSize: '18px', fontWeight: '600', marginLeft: '4px' }}>FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Carte de localisation */}
        {pos.lat && pos.lng && (
          <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <Card.Body className="p-4">
              <h5 className="mb-4 fw-bold" style={{ color: '#1E88E5' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Localisation sur la carte
              </h5>
              <div 
                style={{ 
                  height: '400px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #e9ecef',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <MapContainer
                  center={[pos.lat, pos.lng]}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[pos.lat, pos.lng]}>
                    <Popup>
                      <strong>{pos.name}</strong><br />
                      {pos.address}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  )
}
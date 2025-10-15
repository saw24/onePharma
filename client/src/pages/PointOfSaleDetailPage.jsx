import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
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
  }, [id, navigate])

  if (!pos) return <div className="container py-5 text-center">Chargement...</div>

  return (
    <div className="container py-4">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline-secondary back-button"
      >
        ← Retour aux résultats
      </button>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{pos.name}</h2>
          <p><strong>📍 Adresse :</strong> {pos.address}</p>
          <p><strong>📞 Téléphone :</strong> {pos.phone}</p>

          {/* Liste des produits */}
          <div className="mt-4">
            <h3 className="h5 mb-3">Produits disponibles</h3>
            {pos.matchingProducts.map((product, index) => (
              <div key={index} className="card mb-2">
                <div className="card-body py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{product.name}</strong>
                      <br />
                      <small className="text-muted">
                        Stock disponible: {product.availableQuantity} unités
                      </small>
                    </div>
                    <div className="text-end">
                      <div className="text-primary fw-bold">
                        {product.price} FCFA / unité
                      </div>
                      <small className="text-muted">
                        Total: {product.total} FCFA
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong>Total :</strong>
                <strong className="h5 mb-0 text-primary">
                  {pos.totalAmount} FCFA
                </strong>
              </div>
            </div>
          </div>

          {/* Carte */}
          {pos.lat && pos.lng && (
            <div className="mt-4" style={{ height: '300px', width: '100%' }}>
              <MapContainer
                center={[pos.lat, pos.lng]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[pos.lat, pos.lng]}>
                  <Popup>{pos.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
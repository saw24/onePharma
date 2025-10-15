import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix icône Leaflet
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
    const fetchPOS = async () => {
      try {
        const res = await axios.get(`/api/points-of-sale/${id}`)
        setPos(res.data)
      } catch (err) {
        console.error('Erreur lors du chargement du point de vente:', err)

      let message = 'Impossible de charger les informations du point de vente.'

      // Gestion spécifique des erreurs Axios
      if (err.response) {
        // Le serveur a répondu avec un code d'erreur (4xx, 5xx)
        if (err.response.status === 404) {
          message = 'Point de vente introuvable.'
        } else if (err.response.status >= 500) {
          message = 'Erreur serveur. Veuillez réessayer plus tard.'
        }
      } else if (err.request) {
        // La requête a été envoyée, mais pas de réponse (ex: backend éteint)
        message = 'Aucune réponse du serveur. Vérifiez votre connexion.'
      } else {
        // Erreur lors de la configuration de la requête
        message = 'Erreur de configuration de la requête.'
      }
        alert(message)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchPOS()
  }, [id, navigate])

  if (loading) return <div className="container py-5 text-center">Chargement...</div>
  if (!pos) return null

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

          {pos.lat && pos.lng && (
            <div className="mt-3" style={{ height: '300px', width: '100%' }}>
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
// src/components/PharmacyModal.jsx
import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; // Importez L pour gérer les icônes
import { createPharmacy, updatePharmacy } from '../utils/pharmacies'; // Assurez-vous que le chemin est correct

// Importer les images avec 'import' pour que le bundler les inclue correctement
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Correction de l'icône Leaflet (problème courant avec webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x, // Utilisez l'import
  iconUrl: markerIcon,         // Utilisez l'import
  shadowUrl: markerShadow,     // Utilisez l'import
});

// Composant pour gérer les clics sur la carte
function LocationPicker({ onLocationSelected, initialPosition }) {
  const map = useMapEvents({
    click: (e) => {
      onLocationSelected(e.latlng); // Appelle la fonction parente avec les coordonnées
    },
  });

  // Centrer la carte sur la position initiale si disponible
  useEffect(() => {
    if (initialPosition && initialPosition.lat && initialPosition.lng) {
      map.setView(initialPosition, map.getZoom()); // Utilise la position initiale
    } else {
      // Centrer sur une position par défaut (ex: Niger)
      map.setView([16.9750, 8.0875], 6); // Coordonnées approximatives du Niger
    }
  }, [initialPosition, map]);

  // Ajouter un marqueur sur la position initiale si disponible
  if (initialPosition && initialPosition.lat && initialPosition.lng) {
    return <Marker position={initialPosition} />;
  }
  return null;
}

const PharmacyModal = ({ show, handleClose, pharmacy, onSave, isEditing }) => {
  const [formData, setFormData] = useState({
    nom_pv: '',
    tel_pv: '',
    adre_pv: '',
    latitude: '',
    longitude: '',
    est_en_garde: false, // Valeur par défaut
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // État pour la position de la carte
  const [mapPosition, setMapPosition] = useState(null);

  useEffect(() => {
    if (isEditing && pharmacy) {
      const lat = parseFloat(pharmacy.latitude);
      const lng = parseFloat(pharmacy.longitude);
      const initialPos = !isNaN(lat) && !isNaN(lng) ? { lat, lng } : null;

      setFormData({
        nom_pv: pharmacy.nom_pv || '',
        tel_pv: pharmacy.tel_pv || '',
        adre_pv: pharmacy.adre_pv || '',
        latitude: lat || '', // Afficher le nombre ou une chaîne vide
        longitude: lng || '',
        est_en_garde: Boolean(pharmacy.est_en_garde),
      });
      // Initialiser la position de la carte avec les coordonnées existantes
      setMapPosition(initialPos);
    } else if (!isEditing) {
      // Réinitialiser le formulaire pour une nouvelle entrée
      setFormData({
        nom_pv: '',
        tel_pv: '',
        adre_pv: '',
        latitude: '',
        longitude: '',
        est_en_garde: false,
      });
      // Positionner la carte sur une vue par défaut pour une nouvelle entrée
      setMapPosition(null); // Cela déclenchera la vue par défaut dans LocationPicker
    }
    setErrors({}); // Réinitialiser les erreurs
  }, [show, isEditing, pharmacy]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Optionnel : Si l'utilisateur tape des coordonnées, mettez à jour la carte
    if ((name === 'latitude' || name === 'longitude') && !isNaN(parseFloat(value))) {
      setMapPosition(prev => ({
        ...prev,
        [name === 'latitude' ? 'lat' : 'lng']: parseFloat(value)
      }));
    }
  };

  // Fonction appelée quand l'utilisateur clique sur la carte
  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6), // Arrondir pour une meilleure lisibilité
      longitude: lng.toFixed(6),
    }));
    setMapPosition(latlng); // Mettre à jour la position affichée sur la carte
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nom_pv.trim()) newErrors.nom_pv = 'Le nom est requis.';
    if (!formData.tel_pv.trim()) newErrors.tel_pv = 'Le téléphone est requis.';
    if (!formData.adre_pv.trim()) newErrors.adre_pv = 'L\'adresse est requise.';
    if (!formData.latitude || isNaN(formData.latitude)) newErrors.latitude = 'Latitude invalide.';
    if (!formData.longitude || isNaN(formData.longitude)) newErrors.longitude = 'Longitude invalide.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await updatePharmacy(pharmacy.code_pv, formData);
      } else {
        await createPharmacy(formData);
      }
      onSave(); // Indique à la page parente que les données ont changé
      handleClose();
    } catch (error) {
      // Gérer l'erreur (afficher un message d'erreur dans le modal ou via un toast)
      console.error('Erreur lors de la sauvegarde:', error);
      // Exemple : setErrors({ api: 'Une erreur est survenue lors de la sauvegarde.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg"> {/* Agrandir le modal pour la carte */}
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Modifier' : 'Ajouter'} une pharmacie</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="nom_pv">
            <Form.Label>Nom *</Form.Label>
            <Form.Control
              type="text"
              name="nom_pv"
              value={formData.nom_pv}
              onChange={handleChange}
              isInvalid={!!errors.nom_pv}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nom_pv}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="tel_pv">
            <Form.Label>Téléphone *</Form.Label>
            <Form.Control
              type="text"
              name="tel_pv"
              value={formData.tel_pv}
              onChange={handleChange}
              isInvalid={!!errors.tel_pv}
            />
            <Form.Control.Feedback type="invalid">
              {errors.tel_pv}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="adre_pv">
            <Form.Label>Adresse *</Form.Label>
            <Form.Control
              type="text"
              name="adre_pv"
              value={formData.adre_pv}
              onChange={handleChange}
              isInvalid={!!errors.adre_pv}
            />
            <Form.Control.Feedback type="invalid">
              {errors.adre_pv}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="latitude">
            <Form.Label>Latitude *</Form.Label>
            <Form.Control
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              isInvalid={!!errors.latitude}
              placeholder="Cliquez sur la carte ou entrez la latitude"
            />
            <Form.Control.Feedback type="invalid">
              {errors.latitude}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="longitude">
            <Form.Label>Longitude *</Form.Label>
            <Form.Control
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              isInvalid={!!errors.longitude}
              placeholder="Cliquez sur la carte ou entrez la longitude"
            />
            <Form.Control.Feedback type="invalid">
              {errors.longitude}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="est_en_garde">
            <Form.Check
              type="switch"
              name="est_en_garde"
              label="En garde"
              checked={formData.est_en_garde}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Conteneur pour la carte */}
          <div style={{ height: '300px', width: '100%', marginBottom: '15px' }}>
            <MapContainer
              center={mapPosition || [16.9750, 8.0875]} // Centrer sur la position ou Niger
              zoom={13} // Zoom approprié
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onLocationSelected={handleMapClick} initialPosition={mapPosition} />
            </MapContainer>
          </div>

          {errors.api && (
            <div className="alert alert-danger">{errors.api}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : (isEditing ? 'Sauvegarder' : 'Ajouter')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PharmacyModal;
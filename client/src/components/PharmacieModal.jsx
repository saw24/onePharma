// src/components/PharmacyModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { createPharmacy, updatePharmacy } from '../utils/pharmacies';

// Importer les images avec 'import' pour que le bundler les inclue correctement
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Correction de l'icône Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Composant pour gérer les clics sur la carte
function LocationPicker({ onLocationSelected, initialPosition }) {
  const map = useMapEvents({
    click: (e) => {
      onLocationSelected(e.latlng);
    },
  });

  useEffect(() => {
    if (initialPosition && initialPosition.lat && initialPosition.lng) {
      map.setView(initialPosition, map.getZoom());
    } else {
      map.setView([16.9750, 8.0875], 6);
    }
  }, [initialPosition, map]);

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
    est_en_garde: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
        latitude: lat || '',
        longitude: lng || '',
        est_en_garde: Boolean(pharmacy.est_en_garde),
      });
      setMapPosition(initialPos);
    } else if (!isEditing) {
      setFormData({
        nom_pv: '',
        tel_pv: '',
        adre_pv: '',
        latitude: '',
        longitude: '',
        est_en_garde: false,
      });
      setMapPosition(null);
    }
    setErrors({});
  }, [show, isEditing, pharmacy]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if ((name === 'latitude' || name === 'longitude') && !isNaN(parseFloat(value))) {
      setMapPosition(prev => ({
        ...prev,
        [name === 'latitude' ? 'lat' : 'lng']: parseFloat(value)
      }));
    }
  };

  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
    setMapPosition(latlng);
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
      onSave();
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ api: error.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      size="lg"
      style={{ borderRadius: '16px' }}
    >
      <Modal.Header 
        closeButton 
        style={{
          backgroundColor: '#f8f9fa',
          borderBottom: '2px solid #e9ecef',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '20px 24px'
        }}
      >
        <Modal.Title className="d-flex align-items-center gap-2" style={{ color: '#1E88E5', fontWeight: '700' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#E3F2FD',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}
          >
            {isEditing ? '✏️' : '➕'}
          </div>
          {isEditing ? 'Modifier' : 'Ajouter'} une pharmacie
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ padding: '24px' }}>
          {/* Message d'erreur API */}
          {errors.api && (
            <Alert 
              variant="danger" 
              dismissible
              onClose={() => setErrors(prev => ({ ...prev, api: undefined }))}
              className="mb-4"
              style={{
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#ffebee'
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{errors.api}</span>
              </div>
            </Alert>
          )}

          {/* Section Informations générales */}
          <div 
            className="mb-4 p-3"
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}
          >
            <h6 className="mb-3" style={{ color: '#495057', fontWeight: '600' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Informations générales
            </h6>

            <Form.Group className="mb-3" controlId="nom_pv">
              <Form.Label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                Nom de la pharmacie <span style={{ color: '#dc3545' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="nom_pv"
                value={formData.nom_pv}
                onChange={handleChange}
                isInvalid={!!errors.nom_pv}
                placeholder="Ex: Pharmacie Centrale"
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  padding: '12px 16px',
                  fontSize: '15px'
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nom_pv}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="tel_pv">
              <Form.Label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                Téléphone <span style={{ color: '#dc3545' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="tel_pv"
                value={formData.tel_pv}
                onChange={handleChange}
                isInvalid={!!errors.tel_pv}
                placeholder="Ex: +227 20 XX XX XX"
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  padding: '12px 16px',
                  fontSize: '15px'
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.tel_pv}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="adre_pv">
              <Form.Label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                Adresse <span style={{ color: '#dc3545' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="adre_pv"
                value={formData.adre_pv}
                onChange={handleChange}
                isInvalid={!!errors.adre_pv}
                placeholder="Ex: Avenue de la République, Niamey"
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  padding: '12px 16px',
                  fontSize: '15px'
                }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.adre_pv}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-0" controlId="est_en_garde">
              <div 
                className="d-flex align-items-center justify-content-between p-3"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '2px solid #e9ecef'
                }}
              >
                <div>
                  <Form.Label className="mb-0" style={{ fontWeight: '500', color: '#495057', cursor: 'pointer' }}>
                    Pharmacie de garde
                  </Form.Label>
                  <div style={{ fontSize: '13px', color: '#6c757d' }}>
                    Cette pharmacie assure un service de garde
                  </div>
                </div>
                <Form.Check
                  type="switch"
                  name="est_en_garde"
                  checked={formData.est_en_garde}
                  onChange={handleChange}
                  style={{ transform: 'scale(1.3)' }}
                />
              </div>
            </Form.Group>
          </div>

          {/* Section Localisation */}
          <div 
            className="mb-4 p-3"
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}
          >
            <h6 className="mb-3" style={{ color: '#495057', fontWeight: '600' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Localisation GPS
            </h6>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="latitude">
                  <Form.Label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                    Latitude <span style={{ color: '#dc3545' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    isInvalid={!!errors.latitude}
                    placeholder="Ex: 13.5127"
                    style={{
                      borderRadius: '8px',
                      border: '2px solid #e9ecef',
                      padding: '12px 16px',
                      fontSize: '15px'
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.latitude}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="longitude">
                  <Form.Label style={{ fontWeight: '500', color: '#495057', fontSize: '14px' }}>
                    Longitude <span style={{ color: '#dc3545' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    isInvalid={!!errors.longitude}
                    placeholder="Ex: 2.1128"
                    style={{
                      borderRadius: '8px',
                      border: '2px solid #e9ecef',
                      padding: '12px 16px',
                      fontSize: '15px'
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.longitude}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <div 
              className="alert alert-info mb-3"
              style={{
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#E3F2FD',
                color: '#1565C0',
                fontSize: '13px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Cliquez sur la carte pour sélectionner l'emplacement de la pharmacie
            </div>

            {/* Carte interactive */}
            <div 
              style={{ 
                height: '350px', 
                width: '100%', 
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #e9ecef',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <MapContainer
                center={mapPosition || [16.9750, 8.0875]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onLocationSelected={handleMapClick} initialPosition={mapPosition} />
              </MapContainer>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer 
          style={{
            backgroundColor: '#f8f9fa',
            borderTop: '2px solid #e9ecef',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            padding: '20px 24px'
          }}
        >
          <Button
            variant="light"
            onClick={handleClose}
            disabled={loading}
            style={{
              borderRadius: '8px',
              padding: '10px 24px',
              fontWeight: '600',
              border: '2px solid #e9ecef',
              transition: 'all 0.2s ease'
            }}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            style={{
              borderRadius: '8px',
              padding: '10px 24px',
              fontWeight: '600',
              backgroundColor: '#1E88E5',
              border: 'none',
              minWidth: '140px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1565C0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E88E5'}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Enregistrement...
              </>
            ) : (
              <>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                  style={{ verticalAlign: 'middle', marginRight: '6px' }}
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                {isEditing ? 'Sauvegarder' : 'Ajouter'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PharmacyModal;
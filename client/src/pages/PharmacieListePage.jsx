// src/pages/PharmacieListePage.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Form } from 'react-bootstrap';
import PharmacieModal from '../components/PharmacieModal';      
import PharmacieListe from '../components/PharmacieListe';
import { fetchPharmacies, deletePharmacy } from '../utils/pharmacies'; // ou '../api/pharmacies'

const PharmacieListePage = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPharmacy, setCurrentPharmacy] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // États pour la pagination et la recherche
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const fetchPharmaciesData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPharmacies(page, limit, searchQuery);
      setPharmacies(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1); // Supposons une structure de réponse avec pagination
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des pharmacies.');
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmaciesData();
  }, [page, limit, searchQuery]); // Recharger quand la page, la limite ou la recherche change

  const handleShowModal = (pharmacy = null) => {
    setCurrentPharmacy(pharmacy);
    setIsEditing(!!pharmacy);
    setShowModal(true);
  };

  const handleSave = () => {
    setShowModal(false);
    fetchPharmaciesData(); // Recharger la liste après une opération
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette pharmacie ?')) {
      try {
        await deletePharmacy(id);
        fetchPharmaciesData(); // Recharger la liste après suppression
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la suppression.');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    // Le useEffect se chargera de rappeler fetchPharmaciesData
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">Gestion des Pharmacies</h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Rechercher par nom, adresse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <Button variant="primary" onClick={() => handleShowModal()}>
            Ajouter une pharmacie
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <PharmacieListe
            pharmacies={pharmacies}
            loading={loading}
            onEdit={handleShowModal}
            onDelete={handleDelete}
          />
        </Col>
      </Row>

      {/* Pagination basique (à améliorer) */}
      <Row className="mt-3">
        <Col className="d-flex justify-content-between">
          <Button
            variant="outline-primary"
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page <= 1}
          >
            Précédent
          </Button>
          <span>Page {page} sur {totalPages}</span>
          <Button
            variant="outline-primary"
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
          >
            Suivant
          </Button>
        </Col>
      </Row>

      <PharmacieModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        pharmacy={currentPharmacy}
        isEditing={isEditing}
        onSave={handleSave}
      />
    </Container>
  );
};

export default PharmacieListePage;
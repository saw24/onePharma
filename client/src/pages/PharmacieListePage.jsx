// src/pages/PharmacieListePage.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Form, Card, Spinner, Badge } from 'react-bootstrap';
import PharmacieModal from '../components/PharmacieModal';      
import PharmacieListe from '../components/PharmacieListe';
import { fetchPharmacies, deletePharmacy } from '../utils/pharmacies';

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
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des pharmacies.');
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmaciesData();
  }, [page, limit, searchQuery]);

  const handleShowModal = (pharmacy = null) => {
    setCurrentPharmacy(pharmacy);
    setIsEditing(!!pharmacy);
    setShowModal(true);
  };

  const handleSave = () => {
    setShowModal(false);
    fetchPharmaciesData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette pharmacie ?')) {
      try {
        await deletePharmacy(id);
        fetchPharmaciesData();
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la suppression.');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container fluid className="py-4">
        {/* En-tête moderne avec gradient */}
        <Card 
          className="border-0 shadow-sm mb-4"
          style={{
            background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
            borderRadius: '16px'
          }}
        >
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={8}>
                <div className="d-flex align-items-center gap-3">
                  <div 
                    style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px'
                    }}
                  >
                    🏥
                  </div>
                  <div>
                    <h2 className="text-white mb-1 fw-bold">Gestion des Pharmacies</h2>
                    <p className="text-white-50 mb-0">
                      <Badge bg="light" text="primary" className="me-2">
                        {pharmacies.length} pharmacie{pharmacies.length > 1 ? 's' : ''}
                      </Badge>
                      Gérez votre réseau de pharmacies
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="text-md-end mt-3 mt-md-0">
                <Button
                  onClick={() => handleShowModal()}
                  style={{
                    backgroundColor: 'white',
                    color: '#1E88E5',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                    style={{ verticalAlign: 'middle', marginRight: '8px' }}
                  >
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Ajouter une pharmacie
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Message d'erreur moderne */}
        {error && (
          <Alert 
            variant="danger" 
            dismissible 
            onClose={() => setError('')}
            className="border-0 shadow-sm"
            style={{ borderRadius: '12px' }}
          >
            <div className="d-flex align-items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          </Alert>
        )}

        {/* Barre de recherche moderne */}
        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
          <Card.Body className="p-3">
            <Form onSubmit={handleSearch}>
              <Row className="align-items-center">
                <Col md={10}>
                  <div style={{ position: 'relative' }}>
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#999" 
                      strokeWidth="2"
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none'
                      }}
                    >
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <Form.Control
                      type="text"
                      placeholder="Rechercher par nom, adresse, ville..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        paddingLeft: '48px',
                        paddingRight: '16px',
                        height: '48px',
                        border: '2px solid #e9ecef',
                        borderRadius: '10px',
                        fontSize: '15px',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#1E88E5';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30, 136, 229, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e9ecef';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </Col>
                <Col md={2} className="mt-2 mt-md-0">
                  <Button
                    type="submit"
                    style={{
                      width: '100%',
                      height: '48px',
                      backgroundColor: '#1E88E5',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1565C0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E88E5'}
                  >
                    Rechercher
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Contenu principal avec loader moderne */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <Card.Body className="p-4">
            {loading ? (
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
                <p className="text-muted mt-3 mb-0">Chargement des pharmacies...</p>
              </div>
            ) : pharmacies.length === 0 ? (
              <div className="text-center py-5">
                <div 
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '36px'
                  }}
                >
                  🔍
                </div>
                <h5 className="mb-2">Aucune pharmacie trouvée</h5>
                <p className="text-muted mb-4">
                  {searchQuery 
                    ? 'Aucun résultat ne correspond à votre recherche.' 
                    : 'Commencez par ajouter votre première pharmacie.'
                  }
                </p>
                {!searchQuery && (
                  <Button
                    variant="primary"
                    onClick={() => handleShowModal()}
                    style={{ borderRadius: '10px', padding: '10px 24px' }}
                  >
                    Ajouter une pharmacie
                  </Button>
                )}
              </div>
            ) : (
              <PharmacieListe
                pharmacies={pharmacies}
                loading={loading}
                onEdit={handleShowModal}
                onDelete={handleDelete}
              />
            )}
          </Card.Body>
        </Card>

        {/* Pagination moderne */}
        {!loading && pharmacies.length > 0 && (
          <Card className="border-0 shadow-sm mt-4" style={{ borderRadius: '12px' }}>
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col md={4}>
                  <Button
                    variant="outline-primary"
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page <= 1}
                    style={{
                      borderRadius: '10px',
                      padding: '10px 20px',
                      fontWeight: '600',
                      border: '2px solid',
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
                      style={{ verticalAlign: 'middle', marginRight: '6px' }}
                    >
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Précédent
                  </Button>
                </Col>
                <Col md={4} className="text-center">
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#495057' }}>
                    Page <span style={{ color: '#1E88E5', fontSize: '18px' }}>{page}</span> sur {totalPages}
                  </div>
                </Col>
                <Col md={4} className="text-md-end">
                  <Button
                    variant="outline-primary"
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages}
                    style={{
                      borderRadius: '10px',
                      padding: '10px 20px',
                      fontWeight: '600',
                      border: '2px solid',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Suivant
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      style={{ verticalAlign: 'middle', marginLeft: '6px' }}
                    >
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        <PharmacieModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          pharmacy={currentPharmacy}
          isEditing={isEditing}
          onSave={handleSave}
        />
      </Container>
    </div>
  );
};

export default PharmacieListePage;
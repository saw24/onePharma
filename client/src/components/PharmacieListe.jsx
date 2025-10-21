// src/components/PharmacieListe.jsx
import { Table, Button, Spinner } from 'react-bootstrap';

const PharmacieListe = ({ pharmacies, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Chargement des pharmacies...</p>
      </div>
    );
  }

  if (!pharmacies || pharmacies.length === 0) {
    return <p className="text-center">Aucune pharmacie trouvée.</p>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Code</th>
          <th>Nom</th>
          <th>Téléphone</th>
          <th>Adresse</th>
          <th>Coordonnées</th>          
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {pharmacies.map((pharmacy) => (
          <tr key={pharmacy.code_pv}>
            <td>{pharmacy.code_pv}</td>
            <td>{pharmacy.nom_pv}</td>
            <td>{pharmacy.tel_pv}</td>
            <td>{pharmacy.adre_pv}</td>
            <td>{pharmacy.latitude}, {pharmacy.longitude}</td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(pharmacy)}
              >
                Modifier
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(pharmacy.code_pv)}
              >
                Supprimer
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PharmacieListe;
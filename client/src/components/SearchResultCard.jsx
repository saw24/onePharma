import { useState } from 'react';
import { Link } from 'react-router-dom';
import EditableProductList from './EditableProductList';

export default function SearchResultCard({ pos, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={`card h-100 shadow-sm ${pos.est_en_garde ? 'border-success border-3 bg-success bg-opacity-10' : ''}`}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className={`card-title mb-0 ${pos.est_en_garde ? 'text-success' : ''}`}>
              {pos.name}
            </h5>
          <button 
            className={`btn btn-sm ${isEditing ? 'btn-success' : 'btn-outline-primary'}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Terminer' : 'Modifier'}
          </button>
        </div>
        
        <p className="text-muted small mb-2">
          ✅ {pos.matchingProducts.length} produit(s) disponible(s)
        </p>

        {isEditing ? (
          <EditableProductList 
            products={pos.matchingProducts}
            onUpdate={(updatedProducts) => onUpdate(pos.id, updatedProducts)}
          />
        ) : (
          <Link to={`/pos/${pos.id}`} className="text-decoration-none">
            <div className="mt-auto">
              {pos.matchingProducts.map((item, idx) => (
                <div key={idx} className="mb-2">
                  <div className="d-flex justify-content-between small">
                    <strong>{item.name}</strong>
                    <span className="text-primary fw-bold">
                      {item.total ? item.total.toFixed(0) : '0.00'} Fcfa
                    </span>
                  </div>
                  <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.85rem' }}>
                    <span>
                      {item.quantityUsed || item.quantity || 0} × {(item.price || 0).toFixed(0)} Fcfa
                      {item.quantityUsed && item.requestedQuantity && item.quantityUsed < item.requestedQuantity && (
                        <span className="text-warning ms-1">
                          (demandé: {item.requestedQuantity})
                        </span>
                      )}
                    </span>
                    <span>{item.availableQuantity || item.quantity || 0} en stock</span>
                  </div>
                </div>
              ))}
            </div>
          </Link>
        )}

        <div className="border-top pt-2 mt-2">
          <div className="d-flex justify-content-between align-items-center">
            <strong>Total :</strong>
            <div className="text-end">
              <strong className="h5 mb-0 text-primary d-block">
                {pos.totalAmount} FCFA
              </strong>
              <div className="text-muted small fst-italic" style={{ fontSize: '0.6rem' }}>
                {pos.date_maj_stock ? (
                  new Date(pos.date_maj_stock).toLocaleString('fr-FR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  }).replace(',', '')
                ) : 'Date non disponible'}
                <span className="me-2">⚠️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

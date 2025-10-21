export default function ProductInput({ product, index, onFieldChange, onRemove, showRemove }) {
  return (
    <div className="product-input-card"> {/* Utilise la classe CSS définie dans home.css */}
      <div className="card-header">
        <div className="d-flex align-items-center">
          <div className="me-2" style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: '#1E88E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {index + 1}
          </div>
          <span style={{ color: '#1E88E5', fontWeight: '500' }}>Produit</span>
        </div>
        {showRemove && (
          <button
            type="button"
            className="btn-remove-product"
            onClick={() => onRemove(index)}
          >
            ✕
          </button>
        )}
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor={`productName-${index}`} className="form-label" style={{ color: '#666666', fontWeight: '500', fontSize: '0.85rem' }}>
            <span style={{ verticalAlign: 'middle' }}>💊</span> Nom du médicament
          </label>
          <input
            type="text"
            id={`productName-${index}`}
            className="form-control form-control-onepharma" // Utilise la classe CSS définie dans home.css
            placeholder="Ex: Paracétamol 500mg"
            value={product.name}
            onChange={(e) => onFieldChange(index, 'name', e.target.value)}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" style={{ color: '#666666', fontWeight: '500', fontSize: '0.85rem' }}>
            <span style={{ verticalAlign: 'middle' }}>🛒</span> Quantité
          </label>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => onFieldChange(index, 'quantity', Math.max(1, product.quantity - 1))}
              disabled={product.quantity <= 1}
              style={{ padding: '8px 12px', borderRadius: '8px', borderColor: '#DDDDDD', color: '#EF5350' }}
            >
              −
            </button>
            <input
              type="number"
              className="form-control form-control-onepharma mx-2" // Utilise la classe CSS définie dans home.css
              value={product.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                onFieldChange(index, 'quantity', Math.max(1, val));
              }}
              min="1"
              style={{ maxWidth: '80px', textAlign: 'center' }}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => onFieldChange(index, 'quantity', product.quantity + 1)}
              style={{ padding: '8px 12px', borderRadius: '8px', borderColor: '#DDDDDD', color: '#1E88E5' }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
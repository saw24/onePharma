export default function ProductInput({ product, index, onFieldChange, onRemove, showRemove }) {
  return (
    <div className="row mb-2 align-items-end">
      <div className="col-12 col-md-7 mb-2 mb-md-0">
        <label className="form-label">Produit</label>
        <input
          type="text"
          className="form-control"
          value={product.name}
          onChange={(e) => onFieldChange(index, 'name', e.target.value)}
          placeholder="Nom du produit"
        />
      </div>
      <div className="col-6 col-md-3 mb-2 mb-md-0">
        <label className="form-label">Qté</label>
        <input
          type="number"
          min="1"
          className="form-control"
          value={product.quantity}
          onChange={(e) => onFieldChange(index, 'quantity', e.target.value)}
        />
      </div>
      {showRemove && (
        <div className="col-6 col-md-2 d-flex align-items-end">
          <button
            type="button"
            className="btn btn-outline-danger w-100"
            onClick={() => onRemove(index)}
          >
            Suppr.
          </button>
        </div>
      )}
    </div>
  )
}
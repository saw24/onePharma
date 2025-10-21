import { useState } from 'react';

export default function EditableProductList({ products, onUpdate }) {
  const [editedProducts, setEditedProducts] = useState(products);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedProducts = editedProducts.map((product, idx) => {
      if (idx === index) {
        const quantity = Math.max(1, parseInt(newQuantity) || 0);
        const newTotal = quantity * product.price;
        return {
          ...product,
          quantityUsed: quantity,
          total: newTotal
        };
      }
      return product;
    });

    setEditedProducts(updatedProducts);
    onUpdate(updatedProducts); // Met à jour le parent avec les nouvelles données
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = editedProducts.filter((_, idx) => idx !== index);
    setEditedProducts(updatedProducts);
    onUpdate(updatedProducts); // Met à jour le parent avec les nouvelles données
  };

  return (
    <div className="mt-3">
      {editedProducts.map((product, index) => (
        <div key={index} className="one-pharma-editable-product-card mb-2 p-2 rounded">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1">
              <div className="fw-semibold text-dark">{product.name}</div>
              <div className="d-flex align-items-center gap-2 mt-1">
                <input
                  type="number"
                  className="form-control form-control-sm one-pharma-quantity-input"
                  style={{ width: '70px' }}
                  value={product.quantityUsed}
                  min="1"
                  max={product.availableQuantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
                <small className="text-muted">
                  / {product.availableQuantity} dispo
                </small>
              </div>
            </div>
            <div className="text-end">
              <div className="text-primary fw-bold">
                {product.total} FCFA
              </div>
              <button
                className="btn btn-sm btn-outline-danger mt-1"
                onClick={() => handleRemoveProduct(index)}
              >
                Suppr
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
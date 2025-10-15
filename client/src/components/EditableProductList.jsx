import { useState } from 'react';

export default function EditableProductList({ products, onUpdate }) {
  const [editedProducts, setEditedProducts] = useState(products);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedProducts = editedProducts.map((product, idx) => {
      if (idx === index) {
        const quantity = Math.max(1, parseInt(newQuantity) || 0);
        return {
          ...product,
          quantityUsed: quantity,
          total: quantity * product.price
        };
      }
      return product;
    });
    
    setEditedProducts(updatedProducts);
    onUpdate(updatedProducts);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = editedProducts.filter((_, idx) => idx !== index);
    setEditedProducts(updatedProducts);
    onUpdate(updatedProducts);
  };

  return (
    <div className="mt-4">
      {editedProducts.map((product, index) => (
        <div key={index} className="card mb-2">
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1">
                <strong>{product.name}</strong>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    style={{ width: '80px' }}
                    value={product.quantityUsed}
                    min="1"
                    max={product.availableQuantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                  />
                  <small className="text-muted">
                    / {product.availableQuantity} disponibles
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
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
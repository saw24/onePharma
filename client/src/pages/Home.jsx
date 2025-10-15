import { useState, useEffect } from 'react'
import api from '../utils/api'
import ProductInput from '../components/ProductInput'
import SearchResultCard from '../components/SearchResultCard'


// ===========================================================

export default function Home() {
  // 🔹 Restaurer les données depuis sessionStorage au chargement
  const [products, setProducts] = useState(() => {
    const saved = sessionStorage.getItem('searchProducts')
    return saved ? JSON.parse(saved) : [{ name: '', quantity: 1 }]
  })
  
  const [results, setResults] = useState(() => {
    const saved = sessionStorage.getItem('searchResults')
    return saved ? JSON.parse(saved) : []
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // 🔹 Sauvegarder automatiquement dans sessionStorage
  useEffect(() => {
    sessionStorage.setItem('searchProducts', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    sessionStorage.setItem('searchResults', JSON.stringify(results))
  }, [results])

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: 1 }])
  }

  const updateProduct = (index, field, value) => {
    const newProducts = [...products]
    newProducts[index][field] = field === 'quantity' ? Number(value) : value
    setProducts(newProducts)
  }

  const removeProduct = (index) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index))
    }
  }

  
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (products.some(p => !p.name.trim())) {
      setError('Tous les produits doivent avoir un nom.')
      return
    }
    setLoading(true)
    setError('')
    
    try {
      // Correction du format de la requête
      const requestPayload = {
        produits: products.map(p => ({
          nom_produit: p.name.trim(),
          quantite: parseInt(p.quantity)
        }))
      }

      console.log('Sending request:', requestPayload) // Debug log
      
      const response = await api.post('/rechercher-produits', requestPayload)
      

      // Adapter la réponse au format attendu par SearchResultCard
      const adaptedResults = response.data.points_vente.map(pv => ({
        id: pv.code_pv,
        name: pv.nom_pv,
        address: pv.adre_pv,
        phone: pv.tel_pv,
        lat: pv.latitude,
        lng: pv.longitude,
        date_maj_stock : pv.date_maj_stock,
        est_en_garde : pv.est_en_garde,
        matchingProducts: pv.produits.map(prod => ({
          name: prod.des_prdt,
          requestedQuantity: prod.quantite_demandee,
          availableQuantity: prod.stock_dispo,
          quantityUsed: prod.quantite_demandee,
          price: prod.prix_unitaire,
          total: prod.montant_produit
        })),
        totalAmount: pv.total_pv
      }))

      setResults(adaptedResults)
      //Affichons le contenue de la reponse
      console.log("Reponse: ", JSON.stringify(response.data))

    } catch (err) {
      console.error('Erreur détaillée:', err.response?.data)
      setError(err.response?.data?.message || 'Erreur lors de la recherche. Vérifiez le format des données.')
    } finally {
      setLoading(false)
    }
  }


const handleUpdateResult = (posId, updatedProducts) => {
  setResults(prevResults => 
    prevResults.map(pos => {
      if (pos.id === posId) {
        // Recalculer le total
        const newTotal = updatedProducts.reduce((sum, p) => sum + p.total, 0);
        return {
          ...pos,
          matchingProducts: updatedProducts,
          totalAmount: newTotal
        };
      }
      return pos;
    })
  );
}

  // 🔹 Fonction pour vider la recherche
  const handleClearSearch = () => {
    setProducts([{ name: '', quantity: 1 }])
    setResults([])
    sessionStorage.removeItem('searchProducts')
    sessionStorage.removeItem('searchResults')
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 h2">Rechercher des produits</h1>

      <div className="card p-4 mb-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            {products.map((product, index) => (
              <ProductInput
                key={index}
                product={product}
                index={index}
                onFieldChange={updateProduct}
                onRemove={removeProduct}
                showRemove={products.length > 1}
              />
            ))}
          </div>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addProduct}
            >
              + Ajouter un produit
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
            {results.length > 0 && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleClearSearch}
              >
                Nouvelle recherche
              </button>
            )}
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
        </form>
      </div>

      {results.length > 0 && (
        <>
          <h2 className="mb-3">Résultats ({results.length} points de vente)</h2>
          <div className="row g-4">
            {results.map((pos) => (
              <div className="col-12 col-md-6 col-lg-4" key={pos.id}>
                <SearchResultCard pos={pos}
                onUpdate={handleUpdateResult}
                 />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Section d'aide pour tester */}
        <div className="mt-5 p-3 bg-light rounded">
            <h5>💊 Exemples de médicaments à tester :</h5>
            <ul className="mb-0">
                <li><code>Paracetamol</code> </li>
                <li><code>Ibuprofene</code> </li>
                <li><code>Amoxicilline</code> </li>
                <li><code>Omeprazole</code> </li>
                <li><code>Artemether</code> </li>
            </ul>
        </div>  
    </div>
  )
}
import { useState, useEffect } from 'react'
import api from '../utils/api'
import ProductInput from '../components/ProductInput'
import SearchResultCard from '../components/SearchResultCard'
import '../assets/home.css' // Importez votre fichier CSS personnalisé


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

  // 🔹 Fonction pour vider la recherche (et revenir à la page de recherche avec une liste vide)
  const handleClearSearch = () => {
    setProducts([{ name: '', quantity: 1 }]) // Réinitialise la liste à un champ vide
    setResults([])
    sessionStorage.removeItem('searchProducts') // Supprime les anciens produits sauvegardés
    sessionStorage.removeItem('searchResults')
  }

  // 🔹 Fonction pour revenir à la page de recherche avec les produits actuels
  const handleGoBackToForm = () => {
    // Ne vide pas `products`, ne vide que `results`
    setResults([]); // Cela déclenchera le rendu du bloc du formulaire
    // `products` reste inchangé, donc le formulaire affichera les produits précédents
    // `searchResults` est supprimé du sessionStorage, mais `searchProducts` reste
    sessionStorage.removeItem('searchResults');
  }


  // Si des résultats existent, afficher uniquement les résultats et les boutons "Retour" et "Nouvelle recherche"
  if (results.length > 0) {
    return (
      <div className="container-onepharma">
        <div className="d-flex justify-content-between align-items-center mb-3 px-3">
          <h1 className="title-onepharma mb-0"> {/* Utilisez la classe personnalisée */}
            <span className="icon">📊</span> {/* Icône pour les résultats */}
            Résultats ({results.length} point{results.length > 1 ? 's' : ''} de vente)
          </h1>
          <div className="d-flex gap-2"> {/* Conteneur pour les deux boutons */}
            <button
              type="button"
              className="btn btn-onepharma-outline" // Utilisez une classe secondaire pour le bouton Retour
              onClick={handleGoBackToForm} // Appelle la nouvelle fonction
            >
              Retour
            </button>
            <button
              type="button"
              className="btn btn-onepharma-danger" // Utilisez la classe personnalisée
              onClick={handleClearSearch} // Conserve la fonctionnalité de nettoyage complet
            >
              Nouvelle recherche
            </button>
          </div>
        </div>

        <div className="results-grid-onepharma"> {/* Utilisez la classe personnalisée */}
          {results.map((pos) => (
            <SearchResultCard
              key={pos.id}
              pos={pos}
              onUpdate={handleUpdateResult}
            />
          ))}
        </div>

        {/* La section d'aide n'est pas affichée ici */}
      </div>
    );
  }

  // Sinon, afficher le formulaire de recherche
  return (
    <div className="container-onepharma"> {/* Utilisez la classe personnalisée */}
      <h1 className="title-onepharma"> {/* Utilisez la classe personnalisée */}
        <span className="icon">🔍</span> {/* Remplacez par un vrai icône SVG ou Font Awesome si vous préférez */}
        Rechercher des produits
      </h1>

      <div className="form-card-onepharma"> {/* Utilisez la classe personnalisée */}
        <form onSubmit={handleSubmit}>
          <div className="mb-0"> {/* Supprimez mb-3, géré par le style de la carte */}
            {products.map((product, index) => (
              <div key={index} className="product-input-card"> {/* Carte pour chaque produit */}
                <div className="card-header">
                  <div className="d-flex align-items-center">
                    <div className="me-2" style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: '#1E88E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                      {index + 1}
                    </div>
                    <span style={{ color: '#1E88E5', fontWeight: '500' }}>Produit</span>
                  </div>
                  {products.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-product"
                      onClick={() => removeProduct(index)}
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
                      className="form-control form-control-onepharma" // Utilisez la classe personnalisée
                      placeholder="Ex: Paracétamol 500mg"
                      value={product.name}
                      onChange={(e) => updateProduct(index, 'name', e.target.value)}
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
                        onClick={() => updateProduct(index, 'quantity', Math.max(1, product.quantity - 1))}
                        disabled={product.quantity <= 1}
                        style={{ padding: '8px 12px', borderRadius: '8px', borderColor: '#DDDDDD', color: '#EF5350' }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        className="form-control form-control-onepharma mx-2" // Utilisez la classe personnalisée
                        value={product.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          updateProduct(index, 'quantity', Math.max(1, val));
                        }}
                        min="1"
                        style={{ maxWidth: '80px', textAlign: 'center' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => updateProduct(index, 'quantity', product.quantity + 1)}
                        style={{ padding: '8px 12px', borderRadius: '8px', borderColor: '#DDDDDD', color: '#1E88E5' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              className="btn btn-onepharma-outline" // Utilisez la classe personnalisée
              onClick={addProduct}
            >
              <span>+</span> Ajouter un produit
            </button>
            <button
              type="submit"
              className="btn btn-onepharma-primary" // Utilisez la classe personnalisée
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Recherche...
                </>
              ) : (
                'Rechercher'
              )}
            </button>
            {/* Le bouton "Nouvelle recherche" est maintenant affiché dans le bloc des résultats */}
          </div>
          {error && <div className="alert alert-onepharma-danger mt-3">{error}</div>} {/* Utilisez la classe personnalisée */}
        </form>
      </div>

      {/* Section d'aide pour tester - Affichée uniquement sur la page de recherche */}
      <div className="help-section-onepharma"> {/* Utilisez la classe personnalisée */}
        <h5>💊 Exemples de médicaments à tester :</h5>
        <ul className="mb-0">
          <li><code>Paracetamol</code></li>
          <li><code>Ibuprofene</code></li>
          <li><code>Amoxicilline</code></li>
          <li><code>Omeprazole</code></li>
          <li><code>Artemether</code></li>
        </ul>
      </div>
    </div>
  )
}
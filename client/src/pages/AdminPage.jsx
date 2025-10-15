// AdminPage.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminPage() {
  const [stats, setStats] = useState([])

  useEffect(() => {
    axios.get('/api/admin/stats').then(res => setStats(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="container py-4">
      <h1 className="mb-4">Administration</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Gestion des points de vente</h5>
          <p className="text-muted">→ À implémenter : formulaire CRUD</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Statistiques</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Point de vente</th>
                  <th>Visites</th>
                  <th>Clics</th>
                  <th>Réponses pertinentes</th>
                </tr>
              </thead>
              <tbody>
                {stats.length === 0 ? (
                  <tr><td colSpan="4" className="text-center">Aucune donnée</td></tr>
                ) : (
                  stats.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.visits}</td>
                      <td>{s.clicks}</td>
                      <td>{s.relevantResponses}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
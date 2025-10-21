// src/utils/api.js ou src/api/pharmacies.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL; // Assurez-vous que votre proxy dans vite.config.js pointe vers http://localhost:3000 (ou votre port backend)

const apiPharmacies = axios.create({
  baseURL: `${API_BASE_URL}/points-vente`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPharmacies = async (page = 1, limit = 20, searchQuery = '') => {
  try {
    const params = { page, limit };
    if (searchQuery) {
      params.q = searchQuery;
    }
    const response = await apiPharmacies.get('/', { params });
    return response.data; // Attendu : { success: boolean, data: [...], pagination: { page, limit, total, totalPages } }
  } catch (error) {
    console.error('Erreur lors de la récupération des pharmacies:', error);
    throw error;
  }
};

export const createPharmacy = async (pharmacyData) => {
  try {
    const response = await apiPharmacies.post('/', pharmacyData);
    return response.data; // Attendu : { success: boolean, data: {...} }
  } catch (error) {
    console.error('Erreur lors de la création de la pharmacie:', error);
    throw error;
  }
};

export const updatePharmacy = async (code_pv, pharmacyData) => {
  try {
    const response = await apiPharmacies.put(`/${code_pv}`, pharmacyData);
    return response.data; // Attendu : { success: boolean, data: {...} }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la pharmacie:', error);
    throw error;
  }
};

export const deletePharmacy = async (code_pv) => {
  try {
    const response = await apiPharmacies.delete(`/${code_pv}`);
    return response.data; // Attendu : { success: boolean }
  } catch (error) {
    console.error('Erreur lors de la suppression de la pharmacie:', error);
    throw error;
  }
};

export default apiPharmacies;
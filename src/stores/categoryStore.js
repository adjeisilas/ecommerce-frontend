// src/stores/categoryStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-backend-fqtt.onrender.com/api';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/categories`);
        this.categories = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch categories';
      } finally {
        this.loading = false;
      }
    },

    async createCategory(formData) {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authStore.token}`,
          },
        };
        const response = await axios.post(`${API_URL}/categories`, formData, config);
        this.categories.push(response.data);
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create category';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(categoryId) {
  this.error = null;
  try {
    const authStore = useAuthStore();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    };

    await axios.delete(`${API_URL}/categories/${categoryId}`, config);
    
    // Instantly remove it from the UI
    this.categories = this.categories.filter((cat) => cat._id !== categoryId);
    return true;
  } catch (err) {
    console.error("Delete Category Error:", err);
    this.error = err.response?.data?.message || 'Failed to delete category';
    return false;
  }
}
  }
});
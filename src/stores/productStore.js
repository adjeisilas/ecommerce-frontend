// src/stores/productStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'https://ecommerce-backend-fqtt.onrender.com/api/products';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(API_URL);
        this.products = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch products';
      } finally {
        this.loading = false;
      }
    },
    
    async addProduct(formData) {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.post(API_URL, formData, config);
        this.products.push(response.data);
        this.loading = false;
        return true;
      } catch (err) {
        this.loading = false;
        this.error = err.response?.data?.message || 'Failed to add product';
        return false;
      }
    }
  }
});
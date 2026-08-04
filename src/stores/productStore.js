import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
        const response = await axios.get(`${API_URL}/products`);
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
    const authStore = useAuthStore();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authStore.token}`, // CRUCIAL: Must include Bearer token
      },
    };
    const response = await axios.post(`${API_URL}/products`, formData, config);
    this.products.push(response.data);
    return true;
  } catch (err) {
    this.error = err.response?.data?.message || 'Failed to create product';
    return false;
  } finally {
    this.loading = false;
  }
},

async deleteProduct(productId) {
  this.error = null;
  try {
    const authStore = useAuthStore();
    const config = {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    };

    // Send DELETE request to backend
    await axios.delete(`${API_URL}/products/${productId}`, config);
    
    // Remove the product from the local state array immediately
    this.products = this.products.filter((product) => product._id !== productId);
    
    return true;
  } catch (err) {
    console.error("Delete Error:", err);
    this.error = err.response?.data?.message || 'Failed to delete product';
    return false;
  }
}
    
  }
});
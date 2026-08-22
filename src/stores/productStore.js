import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedCategory: null,
    nextCursor: null,
    hasNextPage: false,
  }),
  
  actions: {
    async fetchProducts(isLoadMore = false) {
  this.loading = true;
  this.error = null;
  try {
    if (!isLoadMore) {
      this.nextCursor = null;
      this.products = [];
    }

    const params = new URLSearchParams({ limit: 10 });
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      params.append('search', this.searchQuery.trim());
    }
    if (this.selectedCategory) {
      params.append('category', this.selectedCategory);
    }
    if (isLoadMore && this.nextCursor) {
      params.append('cursor', this.nextCursor);
    }

    const response = await axios.get(`${API_URL}/products?${params.toString()}`);
    
    // Safely extract products array or default to empty array []
    const fetchedProducts = response.data.products || [];
    const nextCursor = response.data.nextCursor || null;
    const hasNextPage = !!response.data.hasNextPage;

    if (isLoadMore) {
      this.products.push(...fetchedProducts);
    } else {
      this.products = fetchedProducts;
    }

    this.nextCursor = nextCursor;
    this.hasNextPage = hasNextPage;
  } catch (err) {
    this.error = err.response?.data?.message || 'Failed to fetch products';
    this.products = []; // Prevent undefined on error
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
            Authorization: `Bearer ${authStore.token}`,
          },
        };
        const response = await axios.post(`${API_URL}/products`, formData, config);
        this.products.unshift(response.data);
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

        await axios.delete(`${API_URL}/products/${productId}`, config);
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
import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [], 
    loading: false,
    error: null,
  }),
  
  actions: {
    async createOrder(orderData) {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await axios.post(`${API_URL}/orders`, orderData, config);
        this.loading = false;
        return response.data;
      } catch (err) {
        this.loading = false;
        this.error = err.response?.data?.message || 'Failed to place order';
        return null;
      }
    },

    async fetchMyOrders() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await axios.get(`${API_URL}/orders/myorders`, config);
        this.orders = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch orders';
      } finally {
        this.loading = false;
      }
    }
  }
});
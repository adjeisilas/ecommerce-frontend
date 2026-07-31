// src/stores/authStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

// Your Express backend URL
const API_URL = 'http://localhost:5000/api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    error: null,
  }),
  actions: {
    async register(userData) {
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        this.user = response.data;
        this.token = response.data.token;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed';
        return false;
      }
    },
    async login(credentials) {
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/signin`, credentials);
        this.user = response.data;
        this.token = response.data.token;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Invalid email or password';
        return false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    // Add this inside the actions: {} object in src/stores/authStore.js

    async loginWithGoogle(googleToken) {
      this.loading = true;
      this.error = null;
      try {
        // Send the Google token to our new backend route
        const response = await axios.post('http://localhost:5000/api/auth/google', {
          token: googleToken
        });
        
        this.user = response.data;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Google authentication failed';
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});
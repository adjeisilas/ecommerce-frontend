import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("cart")) || [],
    loading: false,
    error: null,
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((total, item) => total + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
  },

  actions: {
    addToCart(product) {
      const existingItem = this.items.find((item) => item._id === product._id);

      if (existingItem) {
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity += 1;
        } else {
          console.log("Cannot add more. Product is out of stock.");
          return;
        }
      } else {
        if (product.stock > 0) {
          this.items.push({
            ...product,
            quantity: 1,
          });
        } else {
          console.log("Product is out of stock.");
          return;
        }
      }

      this.saveCart();
    },

    removeFromCart(productId) {
      this.items = this.items.filter((item) => item._id !== productId);
      this.saveCart();
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find((item) => item._id === productId);

      if (item && quantity > 0) {
        item.quantity = Math.min(quantity, item.stock);
        this.saveCart();
      } else if (quantity === 0) {
        this.removeFromCart(productId);
      }
    },

    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },

    clearCart() {
      this.items = [];
      this.saveCart();
    },

    async checkout() {
      if (this.items.length === 0) return false;

      this.loading = true;
      this.error = null;

      try {
        const authStore = useAuthStore();

        // Format cart payload for Paystack initialization
        const orderItems = this.items.map((item) => ({
          _id: item._id || item.id,
          qty: Number(item.quantity || item.qty || 1),
          name: item.name,
          price: item.price,
        }));

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`,
          },
        };

        // 1. Initialize Paystack transaction on backend
        const response = await axios.post(
          `${API_URL}/payments/initialize`,
          {
            orderItems,
            email: authStore.user?.email,
            // Automatically grabs your current domain (e.g., http://localhost:5173/)
            callbackUrl: `${window.location.origin}/`, 
          },
          config
        );

        // 2. Clear local storage & cart state
        this.clearCart();

        // 3. Redirect user to Paystack's secure payment page
        if (response.data?.authorization_url) {
          window.location.href = response.data.authorization_url;
          return true;
        } else {
          throw new Error("No authorization URL received from server.");
        }
      } catch (err) {
        console.error("Paystack Checkout Error:", err);
        this.error =
          err.response?.data?.message || "Payment initialization failed. Please try again.";
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
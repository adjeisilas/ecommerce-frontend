import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || [],
  }),
  
  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    // Calculate total price
    totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
  },
  
  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      this.saveCart();
    },
    
    removeFromCart(productId) {
      this.items = this.items.filter(item => item._id !== productId);
      this.saveCart();
    },
    
    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item._id === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
        this.saveCart();
      } else if (quantity === 0) {
        this.removeFromCart(productId);
      }
    },
    
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    clearCart() {
      this.items = [];
      this.saveCart();
    }
  }
});
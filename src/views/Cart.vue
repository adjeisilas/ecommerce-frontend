<template>
  <div class="min-h-screen bg-gray-50 font-sans p-8">
    <div class="mx-auto max-w-4xl bg-white p-8 rounded-2xl shadow-sm">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Your Cart</h1>
        <router-link to="/" class="text-sm font-medium text-blue-600 hover:underline">← Continue Shopping</router-link>
      </div>

      <div v-if="cartStore.items.length === 0" class="text-center py-12 text-gray-500">
        Your cart is empty.
      </div>

      <div v-else>
        <div class="divide-y divide-gray-100">
          <div v-for="item in cartStore.items" :key="item._id" class="py-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <img :src="item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`" :alt="item.name" class="h-20 w-20 rounded-lg object-cover bg-gray-50" />
              <div>
                <h3 class="font-bold text-gray-800">{{ item.name }}</h3>
                <p class="text-sm text-gray-500">GH₵{{ item.price.toFixed(2) }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-6">
              <div class="flex items-center rounded-lg border border-gray-200">
                <button @click="cartStore.updateQuantity(item._id, item.quantity - 1)" class="px-3 py-1 hover:bg-gray-50">-</button>
                <span class="px-3 py-1 text-sm font-medium border-x border-gray-200">{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item._id, item.quantity + 1)" class="px-3 py-1 hover:bg-gray-50">+</button>
              </div>
              
              <p class="font-bold w-20 text-right">GH₵{{ (item.price * item.quantity).toFixed(2) }}</p>
              
              <button @click="cartStore.removeFromCart(item._id)" class="text-red-400 hover:text-red-600">🗑️</button>
            </div>
          </div>
        </div>

        <div class="mt-8 border-t border-gray-100 pt-8 flex justify-end">
          <div class="w-72">
            <div class="flex justify-between text-lg font-bold mb-6">
              <span>Total:</span>
              <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
            <router-link to="/checkout" class="block w-full text-center rounded-full bg-black py-4 text-sm font-bold text-white transition hover:bg-gray-800">
              Proceed to Checkout
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore';
const cartStore = useCartStore();
</script>
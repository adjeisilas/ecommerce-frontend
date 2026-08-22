<template>
  <header class="border-b bg-white px-4 sm:px-8 py-3 font-sans sticky top-0 z-50">
    <div class="hidden sm:flex justify-between text-xs text-gray-500 mb-2">
      <span></span>
      <div class="flex gap-6">
        <a href="#" class="hover:text-black">About ADSTORE</a>
        <a href="#" class="hover:text-black">Help & Support</a>
        <router-link to="/signin" v-if="!authStore.user" class="hover:text-black font-semibold text-black">Sign Up / Sign In</router-link>
        <template v-else>
          <router-link to="/profile" class="hover:text-black font-semibold text-black">Hi, {{ authStore.user.firstName }}</router-link>
          <router-link v-if="authStore.user.role === 'admin'" to="/admin" class="text-blue-600 font-semibold hover:underline">Admin Dashboard</router-link>
          <button @click="logout" class="text-red-500 hover:underline">Logout</button>
        </template>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4 py-2">
      <router-link to="/" class="flex items-center gap-2 font-bold text-xl sm:text-2xl">
        <span class="text-2xl sm:text-3xl">🍃</span> ADSTORE
      </router-link>

      <div class="hidden md:flex flex-1 max-w-2xl items-center rounded-full border border-gray-300 px-4 py-2 bg-gray-50 focus-within:border-black transition">
        <select class="bg-transparent text-sm text-gray-600 outline-none pr-3 border-r border-gray-300 cursor-pointer">
          <option>All Category</option>
        </select>
        <input 
          type="text" 
          :value="productStore.searchQuery" 
          @input="handleSearch"
          placeholder="Search products..." 
          class="w-full bg-transparent px-4 text-sm outline-none"
        />
        <button class="text-gray-500 hover:text-black transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-3">
        <router-link to="/cart" class="relative rounded-full bg-gray-100 p-2.5 sm:p-3 transition hover:bg-gray-200">
          🛒
          <span class="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-black text-[10px] sm:text-[11px] font-bold text-white">
            {{ cartStore.totalItems }}
          </span>
        </router-link>

        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" v-if="!mobileMenuOpen" d="M4 6h16M4 12h16M4 18h16" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" v-else d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Search Bar -->
    <div class="mt-2 flex md:hidden items-center rounded-full border border-gray-300 px-3 py-1.5 bg-gray-50">
      <input 
        type="text" 
        :value="productStore.searchQuery" 
        @input="handleSearch" 
        placeholder="Search product..." 
        class="w-full bg-transparent text-xs outline-none" 
      />
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <div v-if="mobileMenuOpen" class="md:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3 text-sm pb-2">
      <router-link to="/signin" v-if="!authStore.user" @click="mobileMenuOpen = false" class="font-semibold text-black">Sign Up / Sign In</router-link>
      <template v-else>
        <router-link to="/profile" @click="mobileMenuOpen = false" class="font-semibold text-black">Hi, {{ authStore.user.firstName }}</router-link>
        <router-link v-if="authStore.user.role === 'admin'" to="/admin" @click="mobileMenuOpen = false" class="text-blue-600 font-semibold">Admin Dashboard</router-link>
        <button @click="logout(); mobileMenuOpen = false" class="text-left text-red-500 font-semibold">Logout</button>
      </template>
      <a href="#" class="text-gray-500">About ADSTORE</a>
      <a href="#" class="text-gray-500">Help & Support</a>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useProductStore } from '../stores/productStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const cartStore = useCartStore();
const productStore = useProductStore();
const router = useRouter();

const mobileMenuOpen = ref(false);
let searchTimer = null;

const handleSearch = (event) => {
  productStore.searchQuery = event.target.value;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    productStore.fetchProducts();
  }, 400);
};

const logout = () => {
  authStore.logout();
  router.push('/signin');
};
</script>
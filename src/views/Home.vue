<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
    <Navbar />

    <section class="mx-auto max-w-7xl px-4 sm:px-8 py-6">
      <div class="relative overflow-hidden rounded-3xl bg-[#f4f0ec] px-6 sm:px-12 py-10 sm:py-12 flex items-center justify-between shadow-sm">
        <div class="max-w-lg z-10">
          <span class="inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-700 mb-4 shadow-sm">#Big Fashion Sale</span>
          <h1 class="mb-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#3b3632]">Limited Time Offer!<br />Up to <span class="text-red-600">50% OFF!</span></h1>
          <p class="mb-6 text-sm text-gray-600 font-medium">Redefine Your Everyday Style with sustainable, premium daily essentials.</p>
          <button class="rounded-full bg-[#3b3632] px-8 py-3 text-sm font-semibold text-white transition hover:bg-black shadow-md">
            Shop Collection
          </button>
        </div>

        <div class="hidden md:flex gap-4 items-center z-10">
          <div class="h-52 w-36 bg-white rounded-2xl shadow-xl p-2 rotate-[-6deg] overflow-hidden transition hover:rotate-0">
            <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80" alt="Style Trend" class="h-full w-full object-cover rounded-xl" />
          </div>
          <div class="h-60 w-40 bg-white rounded-2xl shadow-2xl p-2 rotate-[4deg] overflow-hidden transition hover:rotate-0">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80" alt="Trendy Footwear" class="h-full w-full object-cover rounded-xl" />
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 sm:px-8 py-6">
      <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-4 text-center">
        <div v-for="cat in categories" :key="cat.name" class="flex flex-col items-center group cursor-pointer">
          <div class="h-16 w-16 rounded-full bg-white border border-gray-200 overflow-hidden flex items-center justify-center shadow-sm transition group-hover:border-black group-hover:shadow-md">
            <img :src="cat.image" :alt="cat.name" class="h-full w-full object-cover group-hover:scale-110 transition duration-300" />
          </div>
          <span class="mt-2 text-xs font-semibold text-gray-700 group-hover:text-black">{{ cat.name }}</span>
        </div>
      </div>
    </section>

    

    <section class="mx-auto max-w-7xl px-4 sm:px-8 py-8 mb-16">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 class="text-2xl font-bold">Todays For You!</h2>
        <div class="flex gap-2 bg-white p-1 rounded-full border border-gray-200 shadow-sm overflow-x-auto">
          <button v-for="tab in ['Best Seller', 'Keep Stylish', 'Special Discount', 'Official Store']" :key="tab" class="px-4 py-1.5 text-xs font-semibold rounded-full transition hover:bg-black hover:text-white whitespace-nowrap">
            {{ tab }}
          </button>
        </div>
      </div>

      <section class="mx-auto max-w-7xl px-4 sm:px-8 py-8">
      

      <div v-if="productStore.loading" class="text-center py-12 text-gray-500">Loading products...</div>
      
      <div v-else-if="productStore.error" class="text-center py-12 text-red-500">{{ productStore.error }}</div>

      <div v-else-if="productStore.products.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div v-for="product in productStore.products" :key="product._id" class="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="relative mb-4 flex h-48 items-center justify-center overflow-hidden">
         
              <img :src="getImageUrl(product.image)" :alt="product.name" class="h-full w-full object-cover rounded-xl transition group-hover:scale-105" />
            
            </div>
            <h3 class="font-semibold text-gray-800 text-sm line-clamp-1">{{ product.name }}</h3>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="font-bold text-gray-900">GH₵{{ product.price?.toFixed(2) }}</span>
              <span class="text-xs text-gray-400 line-through">GH₵{{ (product.price * 1.3).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
            <span class="text-[10px] text-gray-400">Stock: {{ product.stock }}</span>
            <button @click="cartStore.addToCart(product)" class="rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-gray-800">
              Add +
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
        No products found. Add products from the Admin dashboard to see them here!
      </div>
    </section>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';

const productStore = useProductStore();
const cartStore = useCartStore();

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
  return `${baseUrl}${imagePath}`;
};

const hours = ref('08');
const minutes = ref('17');
const seconds = ref('56');
let countdownInterval = null;

const categories = [
  { name: 'T-Shirt', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80' },
  { name: 'Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&auto=format&fit=crop&q=80' },
  { name: 'Shirt', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=150&auto=format&fit=crop&q=80' },
  { name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&auto=format&fit=crop&q=80' },
  { name: 'Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=150&auto=format&fit=crop&q=80' },
  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80' },
  { name: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80' },
  { name: 'Cap', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=150&auto=format&fit=crop&q=80' },
  { name: 'All Category', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=80' },
];

onMounted(() => {
  productStore.fetchProducts();

  let totalSeconds = 8 * 3600 + 17 * 60 + 56;

  countdownInterval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      hours.value = String(h).padStart(2, '0');
      minutes.value = String(m).padStart(2, '0');
      seconds.value = String(s).padStart(2, '0');
    }
  }, 1000);
});

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});
</script>
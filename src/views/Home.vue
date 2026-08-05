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

    <div class="flex items-center justify-center space-x-6 overflow-x-auto py-4 px-4">
      <div 
        v-for="cat in categoryStore.categories" 
        :key="cat._id" 
        @click="toggleCategory(cat.name)"
        class="flex flex-col items-center cursor-pointer min-w-20"
      >
        <div 
          :class="[
            'w-16 h-16 rounded-full overflow-hidden border-2 shadow-sm hover:scale-105 transition-transform',
            selectedCategory === cat.name ? 'border-[#3b3632] border-4' : 'border-gray-200'
          ]"
        >
          <img 
            :src="cat.image" 
            :alt="cat.name" 
            class="w-full h-full object-cover"
          />
        </div>
        <span 
          :class="[
            'mt-2 text-xs font-medium text-center',
            selectedCategory === cat.name ? 'text-black font-extrabold' : 'text-gray-700'
          ]"
        >
          {{ cat.name }}
        </span>
      </div>
    </div>

    <section class="mx-auto max-w-7xl px-4 sm:px-8 py-8 mb-16">
      
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 class="text-2xl font-bold">
          <span v-if="productStore.searchQuery">Search Results for "{{ productStore.searchQuery }}"</span>
          <span v-else>Today's For You!</span>
        </h2>
        
        <div v-if="!productStore.searchQuery" class="flex gap-2 bg-white p-1 rounded-full border border-gray-200 shadow-sm overflow-x-auto">
          <button v-for="tab in ['Best Seller', 'Keep Stylish', 'Special Discount', 'Official Store']" :key="tab" class="px-4 py-1.5 text-xs font-semibold rounded-full transition hover:bg-black hover:text-white whitespace-nowrap">
            {{ tab }}
          </button>
        </div>
        <button v-if="productStore.searchQuery" @click="productStore.searchQuery = ''" class="text-sm text-red-500 hover:underline">
          Clear Search
        </button>
      </div>

      <div v-if="productStore.loading" class="text-center py-12 text-gray-500">Loading products...</div>
      <div v-else-if="productStore.error" class="text-center py-12 text-red-500">{{ productStore.error }}</div>

      <div v-else-if="displayCategories.length > 0">
        
        <div v-for="category in displayCategories" :key="category.name" class="mb-12">
          
          <!-- Category Header -->
          <h2 class="text-2xl font-bold text-[#3b3632] mb-6 flex items-center gap-3">
            {{ category.name }}
            <span class="text-xs font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
              {{ category.products.length }} items
            </span>
          </h2>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            
            <div 
              v-for="product in category.products" 
              :key="product._id" 
              class="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md flex flex-col justify-between"
            >
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
                <button 
                  @click="handleAddToCart(product)" 
                  class="rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                  :disabled="product.stock <= 0"
                >
                  {{ product.stock > 0 ? 'Add +' : 'Out of Stock' }}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
        No products found. Adjust your search or add items from the Admin dashboard!
      </div>
      
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { useCategoryStore } from '../stores/categoryStore';

const productStore = useProductStore();
const cartStore = useCartStore();
const categoryStore = useCategoryStore();

const selectedCategory = ref(null);

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
  return `${baseUrl}${imagePath}`;
};

// --- DATA FETCHING ---
onMounted(() => {
  categoryStore.fetchCategories();
  productStore.fetchProducts();
});

// --- FILTERING & REORDERING LOGIC ---
const toggleCategory = (categoryName) => {
  selectedCategory.value = selectedCategory.value === categoryName ? null : categoryName;
};

const displayCategories = computed(() => {
  let grouped = categoryStore.categories.map(cat => {
    let catProducts = productStore.products.filter(p => p.category === cat.name);

    if (productStore.searchQuery && productStore.searchQuery.trim() !== '') {
      const query = productStore.searchQuery.toLowerCase();
      catProducts = catProducts.filter(p => p.name.toLowerCase().includes(query));
    }

    return {
      name: cat.name,
      products: catProducts
    };
  });

  grouped = grouped.filter(cat => cat.products.length > 0);

  if (selectedCategory.value) {
    grouped.sort((a, b) => {
      if (a.name === selectedCategory.value) return -1;
      if (b.name === selectedCategory.value) return 1;
      return 0;
    });
  }

  return grouped;
});

const handleAddToCart = (product) => {
  if (product.stock > 0) {
    cartStore.addToCart(product);
    alert(`${product.name} added to cart!`);
  } else {
    alert('Sorry, this product is out of stock.');
  }
};

// --- COUNTDOWN LOGIC ---
const hours = ref('08');
const minutes = ref('17');
const seconds = ref('56');
let countdownInterval = null;

onMounted(() => {
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
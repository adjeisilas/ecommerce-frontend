<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <header class="flex items-center justify-between border-b bg-white px-8 py-4">
      <div class="flex items-center gap-2 font-bold text-xl">
        <span class="text-2xl">🍃</span> Ecomora
      </div>
      
      <nav class="flex gap-8 text-sm font-medium text-gray-500">
        <a href="#" class="flex items-center gap-2 hover:text-black">Dashboard</a>
        <a href="#" class="flex items-center gap-2 border-b-2 border-black pb-1 text-black">Products</a>
      </nav>

      <div class="flex items-center gap-3">
        <button @click="logout" class="text-sm font-medium text-red-500 hover:underline mr-4">Logout</button>
        <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">A</div>
        <span class="text-sm font-medium">Admin User</span>
      </div>
    </header>

    <main class="mx-auto max-w-7xl p-8">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-3xl font-semibold">Products</h1>
        <button @click="showAddModal = true" class="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium transition hover:bg-gray-50">
          + Add New Product
        </button>
      </div>

      <div v-if="productStore.loading" class="text-center py-10 text-gray-500">Loading products...</div>
      <div v-if="productStore.error" class="text-center py-10 text-red-500">{{ productStore.error }}</div>

      <div v-if="!productStore.loading && productStore.products.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div v-for="product in productStore.products" :key="product._id" class="group relative cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div class="mb-4 flex h-40 items-center justify-center rounded-xl bg-gray-50 p-4 overflow-hidden">
            
            <!-- FIXED IMAGE TAG -->
            <img :src="getImageUrl(product.image)" :alt="product.name" class="max-h-full object-cover rounded-lg" />
          
          </div>
          <h3 class="truncate font-semibold text-gray-800">{{ product.name }}</h3>
          <p class="text-sm font-medium text-gray-500">GH₵{{ product.price.toFixed(2) }}</p>
          <div class="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span>Stock: {{ product.stock }}</span>
            <span>Sold: {{ product.sold || 0 }}</span>
          </div>
<button 
  @click="handleDelete(product._id)" 
  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
>
  Delete
</button>
        </div>
      </div>
      
      <div v-else-if="!productStore.loading && productStore.products.length === 0" class="text-center py-10 text-gray-500">
        No products found. Add one to get started!
      </div>
    </main>

    <!-- Modal Form -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 class="mb-6 text-2xl font-bold">Add New Product</h2>
        
        <form @submit.prevent="handleAddProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="newProduct.name" type="text" required class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none" />
          </div>
          
          <div class="flex gap-4">
            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-700">Price (GH₵)</label>
              <input v-model="newProduct.price" type="number" step="0.01" required class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none" />
            </div>
            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-700">Stock</label>
              <input v-model="newProduct.stock" type="number" required class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Product Image</label>
            <input @change="handleFileChange" type="file" accept="image/*" required class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <input v-model="newProduct.category" type="text" required class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none" />
          </div>

          <p v-if="productStore.error" class="text-sm text-red-500">{{ productStore.error }}</p>

          <div class="mt-6 flex justify-end gap-3">
            <button type="button" @click="showAddModal = false" class="rounded-lg border px-5 py-2 font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" class="rounded-lg bg-black px-5 py-2 font-medium text-white hover:bg-gray-800" :disabled="productStore.loading">
              {{ productStore.loading ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/productStore';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const productStore = useProductStore();
const authStore = useAuthStore();

const showAddModal = ref(false);
const imageFile = ref(null); 

const newProduct = reactive({
  name: '',
  price: '',
  stock: '',
  category: ''
});

// HELPER FUNCTION FOR IMAGE URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
  return `${baseUrl}${imagePath}`;
};

onMounted(() => {
  productStore.fetchProducts();
});

const handleFileChange = (e) => {
  imageFile.value = e.target.files[0];
};

const handleAddProduct = async () => {
  const formData = new FormData();
  formData.append('name', newProduct.name);
  formData.append('price', newProduct.price);
  formData.append('stock', newProduct.stock);
  formData.append('category', newProduct.category);
  
  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  const success = await productStore.addProduct(formData);
  
  if (success) {
    showAddModal.value = false;
    newProduct.name = '';
    newProduct.price = '';
    newProduct.stock = '';
    newProduct.category = '';
    imageFile.value = null; 
  }
};

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    const success = await productStore.deleteProduct(id);
    if (success) {
      alert('Product deleted!');
    } else {
      alert(productStore.error);
    }
  }
};

const logout = () => {
  authStore.logout();
  router.push('/signin');
};
</script>
<template>
  <div class="flex h-screen bg-slate-50 font-sans">
    
    <!-- SIDEBAR -->
    <aside class="w-64 bg-[#0a1161] text-white flex flex-col shadow-xl z-20">
      <div class="p-6">
        <h2 class="text-2xl font-bold tracking-wide">E-Commerce Admin</h2>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-2">
        <button 
          @click="activeTab = 'products'" 
          :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors', 
                   activeTab === 'products' ? 'bg-white/10 font-semibold' : 'text-gray-300 hover:bg-white/5']"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          Products
        </button>

        <button 
          @click="activeTab = 'categories'" 
          :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors', 
                   activeTab === 'categories' ? 'bg-white/10 font-semibold' : 'text-gray-300 hover:bg-white/5']"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Categories
        </button>
      </nav>

      <div class="p-4 mt-auto">
        <button 
          @click="handleLogout" 
          class="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-100 hover:bg-white/5 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Log Out
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Top Header Area (Optional, mimics the image search/date bar) -->
      <header class="bg-white h-16 border-b flex items-center justify-between px-8 shadow-sm shrink-0">
        <div class="text-sm text-gray-500 font-medium">Dashboard / {{ activeTab === 'products' ? 'Products' : 'Categories' }}</div>
      </header>

      <!-- Scrollable Content -->
      <div class="p-8 overflow-y-auto flex-1">
        
        <!-- ================= CATEGORIES VIEW ================= -->
        <div v-if="activeTab === 'categories'" class="max-w-6xl mx-auto space-y-6">
          <div class="flex justify-between items-end">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Product Categories</h1>
              <p class="text-gray-500 mt-1">Group your products for better organization.</p>
            </div>
            <button @click="showCategoryModal = true" class="bg-[#1a237e] hover:bg-indigo-900 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Add Category
            </button>
          </div>

          <!-- Categories Table -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead class="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th class="p-4 text-sm font-semibold text-gray-600">Image</th>
                  <th class="p-4 text-sm font-semibold text-gray-600">Category Name</th>
                  <th class="p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="cat in categoryStore.categories" :key="cat._id" class="hover:bg-gray-50 transition-colors">
                  <td class="p-4">
                    <img :src="cat.image" :alt="cat.name" class="w-12 h-12 rounded-full object-cover border shadow-sm">
                  </td>
                  <td class="p-4 font-medium text-gray-900">{{ cat.name }}</td>
                  <td class="p-4">
                    <button @click="handleDeleteCategory(cat._id)" class="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                  </td>
                </tr>
                <tr v-if="categoryStore.categories.length === 0">
                  <td colspan="3" class="p-8 text-center text-gray-500">No categories found. Click "Add Category" to create one.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ================= PRODUCTS VIEW ================= -->
        <div v-if="activeTab === 'products'" class="max-w-6xl mx-auto space-y-6">
          <div class="flex justify-between items-end">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Products</h1>
              <p class="text-gray-500 mt-1">Manage your inventory and pricing.</p>
            </div>
            <button @click="showProductModal = true" class="bg-[#1a237e] hover:bg-indigo-900 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Add Product
            </button>
          </div>

          <!-- Products Table -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead class="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th class="p-4 text-sm font-semibold text-gray-600">Product</th>
                  <th class="p-4 text-sm font-semibold text-gray-600">Category</th>
                  <th class="p-4 text-sm font-semibold text-gray-600">Price</th>
                  <th class="p-4 text-sm font-semibold text-gray-600">Stock</th>
                  <th class="p-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="product in productStore.products" :key="product._id" class="hover:bg-gray-50 transition-colors">
                  <td class="p-4 flex items-center gap-3">
                    <img :src="product.image" class="w-10 h-10 rounded-md object-cover border">
                    <span class="font-medium text-gray-900">{{ product.name }}</span>
                  </td>
                  <td class="p-4 text-gray-600">{{ product.category }}</td>
                  <td class="p-4 text-gray-900 font-medium">GHC {{ product.price.toFixed(2) }}</td>
                  <td class="p-4 text-gray-600">{{ product.stock }}</td>
                  <td class="p-4">
                    <button @click="productStore.deleteProduct(product._id)" class="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                  </td>
                </tr>
                <tr v-if="productStore.products.length === 0">
                  <td colspan="5" class="p-8 text-center text-gray-500">No products found. Click "Add Product" to create one.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>

    <!-- ================= MODALS ================= -->
    
    <!-- Add Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="p-5 border-b flex justify-between items-center">
          <h3 class="text-lg font-bold">Add Category</h3>
          <button @click="showCategoryModal = false" class="text-gray-400 hover:text-gray-700">&times;</button>
        </div>
        <form @submit.prevent="handleCategorySubmit" class="p-5 space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Category Name</label>
            <input v-model="categoryName" type="text" required class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Image</label>
            <input type="file" @change="handleCategoryFileChange" accept="image/*" required class="w-full border p-2 rounded-lg text-sm"/>
          </div>
          <div class="pt-2 flex justify-end gap-3">
            <button type="button" @click="showCategoryModal = false" class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" :disabled="categoryStore.loading" class="px-4 py-2 bg-[#1a237e] text-white rounded-lg disabled:opacity-50">
              {{ categoryStore.loading ? 'Saving...' : 'Save Category' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div class="p-5 border-b flex justify-between items-center">
          <h3 class="text-lg font-bold">Add Product</h3>
          <button @click="showProductModal = false" class="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <form @submit.prevent="handleProductSubmit" class="p-5 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Name</label>
              <input v-model="productForm.name" type="text" required class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Category</label>
              <select v-model="productForm.category" required class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option value="" disabled>Select category...</option>
                <option v-for="cat in categoryStore.categories" :key="cat._id" :value="cat.name">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Price (GHC)</label>
              <input v-model.number="productForm.price" type="number" step="0.01" required class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-700">Stock</label>
              <input v-model.number="productForm.stock" type="number" required class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
            </div>
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea v-model="productForm.description" rows="2" class="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700">Product Image</label>
            <input type="file" @change="handleProductFileChange" accept="image/*" required class="w-full border p-2 rounded-lg text-sm"/>
          </div>
          <div class="pt-4 flex justify-end gap-3 border-t">
            <button type="button" @click="showProductModal = false" class="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" :disabled="productStore.loading" class="px-4 py-2 bg-[#1a237e] text-white rounded-lg disabled:opacity-50">
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
import { useCategoryStore } from '../stores/categoryStore';
import { useProductStore } from '../stores/productStore';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const categoryStore = useCategoryStore();
const productStore = useProductStore();
const authStore = useAuthStore();

// UI State
const activeTab = ref('products'); // Default tab
const showCategoryModal = ref(false);
const showProductModal = ref(false);

// Form State
const categoryName = ref('');
const categoryImageFile = ref(null);
const productForm = reactive({ name: '', price: null, stock: null, category: '', description: '' });
const productImageFile = ref(null);

onMounted(() => {
  categoryStore.fetchCategories();
  productStore.fetchProducts(); // Assuming you have this action to populate the table
});

// Handlers
const handleLogout = () => {
  authStore.logout();
  router.push('/signin');
};

const handleCategoryFileChange = (e) => { categoryImageFile.value = e.target.files[0]; };
const handleProductFileChange = (e) => { productImageFile.value = e.target.files[0]; };

const handleCategorySubmit = async () => {
  if (!categoryImageFile.value) return;
  const formData = new FormData();
  formData.append('name', categoryName.value);
  formData.append('image', categoryImageFile.value);

  const success = await categoryStore.createCategory(formData);
  if (success) {
    categoryName.value = '';
    categoryImageFile.value = null;
    showCategoryModal.value = false; // Close modal on success
  } else {
    alert(categoryStore.error);
  }
};

const handleDeleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    const success = await categoryStore.deleteCategory(id);
    if (!success) {
      alert(categoryStore.error);
    }
  }
};

const handleProductSubmit = async () => {
  if (!productImageFile.value) return;
  const formData = new FormData();
  formData.append('name', productForm.name);
  formData.append('price', productForm.price);
  formData.append('stock', productForm.stock);
  formData.append('category', productForm.category);
  formData.append('description', productForm.description);
  formData.append('image', productImageFile.value);

  const success = await productStore.addProduct(formData);
  if (success) {
    Object.assign(productForm, { name: '', price: null, stock: null, category: '', description: '' });
    productImageFile.value = null;
    showProductModal.value = false; // Close modal on success
  } else {
    alert(productStore.error);
  }
};
</script>
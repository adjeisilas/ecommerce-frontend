<template>
  <div class="min-h-screen bg-gray-50 font-sans p-8">
    <div class="mx-auto max-w-5xl">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-800">My Dashboard</h1>
        <router-link to="/" class="text-sm font-medium text-blue-600 hover:underline">← Back to Shop</router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="md:col-span-1">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
              {{ authStore.user?.firstName.charAt(0) }}
            </div>
            <h2 class="text-xl font-bold text-center text-gray-800">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</h2>
            <p class="text-sm text-gray-500 text-center mb-6">{{ authStore.user?.email }}</p>
            
            <button @click="logout" class="w-full rounded-full border border-red-200 bg-red-50 text-red-600 py-2.5 text-sm font-semibold transition hover:bg-red-100">
              Logout
            </button>
          </div>
        </div>

        <div class="md:col-span-3">
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold mb-6">Order History</h2>
            
            <div v-if="orderStore.loading" class="text-gray-500 py-4">Loading your orders...</div>
            <div v-else-if="orderStore.error" class="text-red-500 py-4">{{ orderStore.error }}</div>
            
            <div v-else-if="orderStore.orders.length === 0" class="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
              You haven't placed any orders yet.
            </div>

            <div v-else class="space-y-6">
              <div v-for="order in orderStore.orders" :key="order._id" class="border border-gray-100 rounded-xl p-6 transition hover:shadow-md">
                <div class="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order ID</p>
                    <p class="font-mono text-sm font-medium">{{ order._id }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Date</p>
                    <p class="text-sm font-medium">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</p>
                    <p class="text-sm font-bold">GH₵{{ order.totalPrice.toFixed(2) }}</p>
                  </div>
                  <div>
                    <span :class="order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'" class="px-3 py-1 rounded-full text-xs font-bold">
                      {{ order.isDelivered ? 'Delivered' : 'Processing' }}
                    </span>
                  </div>
                </div>

               
                <div class="flex gap-4 overflow-x-auto pb-2">
                  <div v-for="item in order.orderItems" :key="item._id" class="flex items-center gap-3 min-w-[200px]">
                    <img :src="item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`" class="h-12 w-12 rounded bg-gray-50 object-cover" />
                    <div>
                      <p class="text-sm font-semibold truncate w-32">{{ item.name }}</p>
                      <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useOrderStore } from '../stores/orderStore';

const router = useRouter();
const authStore = useAuthStore();
const orderStore = useOrderStore();

onMounted(() => {
  if (!authStore.user) {
    router.push('/signin');
  } else {
    orderStore.fetchMyOrders();
  }
});

const logout = () => {
  authStore.logout();
  router.push('/signin');
};
</script>
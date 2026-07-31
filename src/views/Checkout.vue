<!-- src/views/Checkout.vue -->
<template>
  <div class="min-h-screen bg-gray-50 font-sans p-8">
    <div class="mx-auto max-w-6xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Shipping Form -->
        <div class="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
          <h2 class="text-xl font-bold mb-6">Shipping Address</h2>
          
          <form @submit.prevent="handlePlaceOrder" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700">Street Address</label>
              <input v-model="shipping.address" type="text" required class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none" />
            </div>
            
            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700">City</label>
                <input v-model="shipping.city" type="text" required class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Postal Code</label>
                <input v-model="shipping.postalCode" type="text" required class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Country</label>
              <input v-model="shipping.country" type="text" required class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none" />
            </div>

            <p v-if="orderStore.error" class="text-sm text-red-500">{{ orderStore.error }}</p>

            <button type="submit" class="w-full mt-6 rounded-full bg-black py-4 text-sm font-bold text-white transition hover:bg-gray-800" :disabled="orderStore.loading">
              {{ orderStore.loading ? 'Processing...' : 'Place Order' }}
            </button>
          </form>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="bg-white p-8 rounded-2xl shadow-sm h-fit">
          <h2 class="text-xl font-bold mb-6">Order Summary</h2>
          
          <div class="space-y-4 mb-6 divide-y divide-gray-100">
            <div v-for="item in cartStore.items" :key="item._id" class="flex justify-between items-center py-2">
              <div class="flex items-center gap-3">
                <span class="text-sm font-medium text-gray-600">{{ item.quantity }}x</span>
                <span class="text-sm font-semibold truncate w-32">{{ item.name }}</span>
              </div>
              <span class="text-sm font-medium text-gray-800">GH₵{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>GH₵{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const shipping = reactive({
  address: '',
  city: '',
  postalCode: '',
  country: ''
});

// Protect the route: if user isn't logged in, send them to sign in
onMounted(() => {
  if (!authStore.user) {
    router.push('/signin');
  }
  if (cartStore.items.length === 0) {
    router.push('/');
  }
});

const handlePlaceOrder = async () => {
  // Format the data exactly how our Express model expects it
  const orderData = {
    orderItems: cartStore.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      product: item._id // Link to the original product ID
    })),
    shippingAddress: shipping,
    paymentMethod: 'Card', // Hardcoded for now
    totalPrice: cartStore.totalPrice
  };

  const savedOrder = await orderStore.createOrder(orderData);

  if (savedOrder) {
    alert('Order placed successfully! 🚀');
    cartStore.clearCart(); // Empty the cart
    router.push('/'); // Send them back to the home page
  }
};
</script>
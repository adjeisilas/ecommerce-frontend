<template>
  <div class="min-h-screen bg-gray-50 font-sans p-8">
    <div class="mx-auto max-w-6xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
          <h2 class="text-xl font-bold mb-6">Shipping Address</h2>

          <!-- Use @submit.prevent on the form to handle submission -->
          <form @submit.prevent="handlePlaceOrder" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Street Address</label
              >
              <input
                v-model="shipping.address"
                type="text"
                required
                class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >City</label
                >
                <input
                  v-model="shipping.city"
                  type="text"
                  required
                  class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Postal Code</label
                >
                <input
                  v-model="shipping.postalCode"
                  type="text"
                  required
                  class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Country</label
              >
              <input
                v-model="shipping.country"
                type="text"
                required
                class="mt-1 w-full rounded-lg border px-4 py-2 focus:border-black focus:outline-none"
              />
            </div>

            <!-- Display cartStore error instead of orderStore -->
            <p v-if="cartStore.error" class="text-sm text-red-500">
              {{ cartStore.error }}
            </p>

            <!-- Changed to type="submit" and removed @click to prevent double-firing -->
            <button
              type="submit"
              :disabled="isProcessing || cartStore.loading"
              class="w-full bg-black text-white py-3 rounded-lg font-bold disabled:opacity-50 transition-colors"
            >
              <span v-if="isProcessing || cartStore.loading"
                >Processing Secure Payment...</span
              >
              <span v-else>Proceed to Payment</span>
            </button>
          </form>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-sm h-fit">
          <h2 class="text-xl font-bold mb-6">Order Summary</h2>

          <div class="space-y-4 mb-6 divide-y divide-gray-100">
            <div
              v-for="item in cartStore.items"
              :key="item._id"
              class="flex justify-between items-center py-2"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm font-medium text-gray-600"
                  >{{ item.quantity }}x</span
                >
                <span class="text-sm font-semibold truncate w-32">{{
                  item.name
                }}</span>
              </div>
              <span class="text-sm font-medium text-gray-800"
                >GH₵{{ (item.price * item.quantity).toFixed(2) }}</span
              >
            </div>
          </div>

          <div
            class="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold"
          >
            <span>Total</span>
            <span>GH₵{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
// Removed useOrderStore as backend handles order creation via Paystack webhooks now

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

// Track local loading state for the button
const isProcessing = ref(false);

const shipping = reactive({
  address: "",
  city: "",
  postalCode: "",
  country: "",
});

onMounted(() => {
  if (!authStore.user) {
    router.push("/signin");
  } else if (cartStore.items.length === 0) {
    router.push("/");
  }
});

const handlePlaceOrder = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;

  try {
    // Calls the Paystack initialization we built in cartStore
    const success = await cartStore.checkout({ ...shipping });

    if (!success && cartStore.error) {
      alert(cartStore.error);
    }
    // Note: If successful, cartStore.checkout() automatically redirects the user
    // to Paystack's URL using window.location.href, so we don't need a router.push here.
  } catch (err) {
    console.error("Unexpected checkout error:", err);
  } finally {
    // Reset button in case the initialization failed or user cancelled
    isProcessing.value = false;
  }
};
</script>

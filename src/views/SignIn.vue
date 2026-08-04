<template>
  <div class="flex min-h-screen items-center justify-center bg-[#5c4d43] p-6">
    <div class="flex w-full max-w-5xl overflow-hidden rounded-[2rem] bg-[#fbf9f4] shadow-2xl">
      
      <div class="relative hidden w-1/2 p-4 md:block">
        <div class="h-full w-full overflow-hidden rounded-2xl bg-gray-200 relative">
          <img 
            src="/images/SignIn Image.jpg" 
            alt="Sign In Image" 
            class="h-full w-full object-cover"
          />
          <div class="absolute top-6 left-6 flex items-center gap-2 text-white font-bold text-xl">
            <span class="text-orange-500 text-2xl">🛋️</span> ADSTORE
          </div>
          <div class="absolute bottom-6 left-6 right-6 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <p class="text-sm text-white/90">"Shop with confidence through a fast, secure, and seamless experience. Discover great deals and enjoy a smooth checkout every time."</p>
            <div class="mt-4 text-white">
              <p class="font-bold">Floyd Miles</p>
              <p class="text-xs text-white/70">Home Decor Stylist</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex w-full flex-col justify-center p-12 md:w-1/2">
        <div class="mx-auto w-full max-w-md">
          <h2 class="mb-2 text-3xl font-bold text-gray-900">Sign In</h2>
          <p class="mb-8 text-sm text-gray-500">Please fill your details to access your account</p>

          <form @submit.prevent="handleSignIn" class="space-y-5">
            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Email <span class="text-red-500">*</span></label>
              <input v-model="formData.email" type="email" required placeholder="Enter Email Address" class="w-full rounded-full border border-gray-300 px-5 py-3 text-sm focus:border-gray-500 focus:outline-none" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-semibold text-gray-700">Password <span class="text-red-500">*</span></label>
              <div class="relative">
                <input v-model="formData.password" type="password" required placeholder="Enter Password" class="w-full rounded-full border border-gray-300 px-5 py-3 text-sm focus:border-gray-500 focus:outline-none" />
              </div>
            </div>

            <p v-if="authStore.error" class="text-sm text-red-500">{{ authStore.error }}</p>

            <button type="submit" class="w-full rounded-full bg-[#3b3632] py-3.5 text-sm font-semibold text-white transition hover:bg-black">
              Sign In
            </button>
          </form>

          <div class="my-6 flex items-center text-sm text-gray-400">
            <div class="h-px flex-grow bg-gray-300"></div>
            <span class="px-4">Or Sign in with</span>
            <div class="h-px flex-grow bg-gray-300"></div>
          </div>

        <div class="flex justify-center mb-6">
          <GoogleLogin :callback="handleGoogleLogin" />
        </div>


          <p class="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <router-link to="/signup" class="font-semibold text-orange-500 hover:underline">Sign Up</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  email: '',
  password: ''
});

const handleSignIn = async () => {
  const success = await authStore.login(formData);
  if (success) {
    if (authStore.user?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/'); 
    }
  }
};

const handleGoogleLogin = async (response) => {
  const success = await authStore.loginWithGoogle(response.credential);
  if (success) {
    router.push('/');
  }
};
</script>
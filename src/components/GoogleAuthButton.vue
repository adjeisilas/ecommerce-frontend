<template>
  <div ref="buttonContainer"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  callback: {
    type: Function,
    required: true,
  },
});

const buttonContainer = ref(null);
let googleScriptPromise = null;

const getGoogleAuthState = () => {
  if (!window.__googleAuthState) {
    window.__googleAuthState = {
      initialized: false,
      callback: null,
    };
  }

  return window.__googleAuthState;
};

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-google-gis="true"]');
      if (existingScript) {
        existingScript.addEventListener('load', resolve, { once: true });
        existingScript.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.dataset.googleGis = 'true';
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
};

const renderGoogleButton = async () => {
  await loadGoogleScript();

  if (!window.google?.accounts?.id || !buttonContainer.value) {
    return;
  }

  const googleAuthState = getGoogleAuthState();
  googleAuthState.callback = props.callback;

  if (!googleAuthState.initialized) {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => {
        const currentState = getGoogleAuthState();
        currentState.callback?.(response);
      },
    });
    googleAuthState.initialized = true;
  }

  buttonContainer.value.innerHTML = '';
  window.google.accounts.id.renderButton(buttonContainer.value, {
    theme: 'outline',
    size: 'large',
    shape: 'pill',
    text: 'signin_with',
  });
};

onMounted(() => {
  renderGoogleButton();
});
</script>
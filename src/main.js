import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // We will create this next
import './style.css' // Make sure Tailwind is imported
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vue3GoogleLogin, {
  // We need a real Client ID here for it to work. 
  // I will show you how to get one, but for now, you can leave it empty or add yours if you have it!
  clientId: '57973559174-n23vkjbqctv84qf94r8d6m0vrkv6u1i8.apps.googleusercontent.com'
})

app.mount('#app')
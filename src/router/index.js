import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Cart from '../views/Cart.vue';
import Checkout from '../views/Checkout.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/signin', name: 'SignIn', component: () => import('../views/SignIn.vue') },
  { path: '/signup', name: 'SignUp', component: () => import('../views/SignUp.vue') },
  { path: '/admin', name: 'Admin', component: () => import('../views/Admin.vue') },
  { path: '/cart', name: 'Cart', component: () => import('../views/Cart.vue') },
  
  {
  path: '/cart',
  name: 'Cart',
  component: Cart
},
{
  path: '/checkout',
  name: 'Checkout',
  component: Checkout
},
{
  path: '/profile',
  name: 'Profile',
  component: Profile
},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
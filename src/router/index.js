import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import Statistics from '@/views/Statistics.vue'
import Tasks from '@/views/Tasks.vue'
import Reminders from '@/views/Reminders.vue'
import Settings from '@/views/Settings.vue'

import { useSessionStore } from '@/stores/sessionUser'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: Statistics,
      meta: { requiresAuth: true },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks,
      meta: { requiresAuth: true },
    },
    {
      path: '/reminders',
      name: 'reminders',
      component: Reminders,
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const session = useSessionStore()

  if ((to.path === '/login' || to.path === '/register') && session.isLoggedIn) {
    return next('/dashboard')
  }

  if (to.meta.requiresAuth && !session.isLoggedIn) {
    return next('/login')
  }

  if (session.isLoggedIn && to.path === '/') {
    return next('/dashboard')
  }

  next()
})

export default router

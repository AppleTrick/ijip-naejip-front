import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/home/LandingView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home/HomeView.vue')
    },
    {
      path: '/map',
      name: 'market',
      component: () => import('../views/market/MarketView.vue')
    },
    {
      path: '/price/:id',
      name: 'price-detail',
      component: () => import('../views/market/PriceDetailView.vue')
    },
    {
      path: '/comparison',
      name: 'comparison',
      component: () => import('../views/market/ComparisonView.vue')
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: () => import('../views/market/AnalysisView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/auth/SignUpView.vue')
    },
    {
      path: '/find-password',
      name: 'find-password',
      component: () => import('../views/auth/FindPasswordView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/settings/SettingsView.vue')
    },
    {
      path: '/settings/profile',
      name: 'profile-edit',
      component: () => import('../views/settings/ProfileEditView.vue')
    },
    {
      path: '/settings/house',
      name: 'house-management',
      component: () => import('../views/settings/HouseManagementView.vue')
    },
    {
      path: '/settings/notifications',
      name: 'notification-settings',
      component: () => import('../views/settings/NotificationSettingsView.vue')
    },
    {
      path: '/settings/password',
      name: 'password-change',
      component: () => import('../views/settings/PasswordChangeView.vue')
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

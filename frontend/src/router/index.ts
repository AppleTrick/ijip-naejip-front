import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import MarketView from '../views/MarketView.vue'
import AnalysisView from '../views/AnalysisView.vue'

const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/map',
      name: 'market',
      component: MarketView
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: AnalysisView
    },
    {
      path: '/comparison',
      name: 'comparison',
      component: () => import('../views/ComparisonView.vue')
    },
    {
      path: '/price/:id',
      name: 'price-detail',
      component: () => import('../views/PriceDetailView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/find-password',
      name: 'find-password',
      component: () => import('../views/FindPasswordView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/settings/profile',
      name: 'profile-edit',
      component: () => import('../views/ProfileEditView.vue')
    },
    {
      path: '/settings/house',
      name: 'house-management',
      component: () => import('../views/HouseManagementView.vue')
    },
    {
      path: '/settings/notifications',
      name: 'notification-settings',
      component: () => import('../views/NotificationSettingsView.vue')
    },
    {
      path: '/settings/password',
      name: 'password-change',
      component: () => import('../views/PasswordChangeView.vue')
    },
    {
      path: '/mypage',
      redirect: '/settings'
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue')
    }
  ]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

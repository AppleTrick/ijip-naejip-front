import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/home/landing/LandingView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home/home/HomeView.vue')
    },
    {
      path: '/landing-v2',
      name: 'landing-v2',
      component: () => import('../views/home/landing/LandingViewV2.vue')
    },
    {
      path: '/map',
      name: 'market',
      component: () => import('../views/market/market-map/MarketView.vue')
    },
    {
      path: '/price/:id',
      name: 'price-detail',
      component: () => import('../views/market/price-detail/PriceDetailView.vue')
    },
    {
      path: '/comparison',
      name: 'comparison',
      component: () => import('../views/market/comparison/ComparisonView.vue')
    },

    {
      path: '/analysis',
      name: 'analysis',
      component: () => import('../views/market/analysis/AnalysisView.vue')
    },
    {
      path: '/survey',
      name: 'preference-survey',
      component: () => import('../views/survey/PreferenceSurveyView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/login/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/auth/signup/SignUpView.vue')
    },
    {
      path: '/signup/social',
      name: 'social-signup',
      component: () => import('../views/auth/signup/SignUpView.vue')
    },
    {
      path: '/oauth/callback',
      name: 'oauth-callback',
      component: () => import('../views/auth/oauth/OAuthCallback.vue')
    },
    {
      path: '/find-password',
      name: 'find-password',
      component: () => import('../views/auth/find-password/FindPasswordView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/settings/settings-home/SettingsView.vue')
    },
    {
      path: '/settings/profile',
      name: 'profile-edit',
      component: () => import('../views/settings/profile-edit/ProfileEditView.vue')
    },
    {
      path: '/settings/house',
      name: 'house-management',
      component: () => import('../views/settings/house-management/HouseManagementView.vue')
    },
    {
      path: '/settings/notifications',
      name: 'notification-settings',
      component: () => import('../views/settings/notification-settings/NotificationSettingsView.vue')
    },
    {
      path: '/settings/password',
      name: 'password-change',
      component: () => import('../views/settings/password-change/PasswordChangeView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

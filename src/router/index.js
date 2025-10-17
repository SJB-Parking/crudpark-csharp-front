import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/pages/Dashboard.vue';
import Subscriptions from '@/pages/Subscriptions.vue';
import Rates from '@/pages/Rates.vue';
import Operators from '@/pages/Operators.vue';
import Reports from '@/pages/Reports.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/mensualidades', name: 'Subscriptions', component: Subscriptions },
  { path: '/tarifas', name: 'Rates', component: Rates },
  { path: '/operadores', name: 'Operators', component: Operators },
  { path: '/reportes', name: 'Reports', component: Reports },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});

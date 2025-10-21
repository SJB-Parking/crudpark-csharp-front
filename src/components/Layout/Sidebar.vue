<template>
  <aside
    class="bg-gray-900 text-gray-100 w-64 min-h-screen flex flex-col shadow-xl"
  >
    <!-- Logo -->
    <div class="flex items-center gap-2 p-4 border-b border-gray-700">
      <img src="/src/assets/LogoCrudParkWBg.png" alt="Logo" class="object-contain"
        style="width: 80px; height: 80px;"  />
      <span class="text-base font-semibold">CrudPark</span>
    </div>


    <!-- Navigation -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li v-for="item in menu" :key="item.path">
          <RouterLink
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition"
            :class="{ 'bg-gray-800': $route.path === item.path }"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <footer class="p-4 text-xs text-gray-500 border-t border-gray-700">
      © {{ new Date().getFullYear() }} CrudPark
    </footer>
  </aside>
</template>

<script setup>
// Sidebar navigation for main layout
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  BarChart2,
} from 'lucide-vue-next'

const route = useRoute()

const menu = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Operadores', path: '/operadores', icon: Users },
  { label: 'Mensualidades', path: '/mensualidades', icon: CreditCard },
  { label: 'Tarifas', path: '/tarifas', icon: DollarSign },
  { label: 'Reportes', path: '/reportes', icon: BarChart2 },
]
</script>

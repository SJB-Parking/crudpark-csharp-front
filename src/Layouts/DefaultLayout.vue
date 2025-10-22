<template>
  <div class="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 overflow-hidden">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Navbar :title="pageTitle" />
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '../components/Layout/Sidebar.vue'
import Navbar from '../components/Layout/Navbar.vue'   

const route = useRoute()

const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/operadores': 'Operadores',
    '/mensualidades': 'Mensualidades',
    '/tarifas': 'Tarifas',
    '/reportes': 'Reportes'
  }
  return titles[route.path] || 'Panel de Control'
})
</script>

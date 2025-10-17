<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <Navbar :title="pageTitle" />
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
// Default layout wrapper
import Sidebar from '../components/Layout/Sidebar.vue'
import Navbar from '../components/Layout/Navbar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Dynamic page title based on route
const pageTitle = computed(() => {
  switch (route.name) {
    case 'Operators':
      return 'Gestión de Operadores'
    case 'Suscriptions':
      return 'Control de Mensualidades'
    case 'Rates':
      return 'Configuración de Tarifas'
    case 'Reports':
      return 'Reportes y Estadísticas'
    default:
      return 'Panel de Control'
  }
})
</script>

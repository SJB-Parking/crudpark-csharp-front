<template>
  <header
    class="bg-white/80 backdrop-blur-xl shadow-sm h-16 flex items-center justify-between px-8 border-b border-gray-200/50 relative"
  >
    <!-- Decorative gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-cyan-50/50 pointer-events-none"></div>

    <!-- Title Section -->
    <div class="relative flex items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="w-1 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
        <h2 class="text-xl font-bold text-gray-800">
          {{ title }}
        </h2>
      </div>
    </div>

    <!-- Actions Section -->
    <div class="relative flex items-center gap-3">
      <!-- Notifications -->
      <button
        class="relative p-2.5 hover:bg-gray-100/80 rounded-xl transition-all hover:scale-105 group"
        title="Notificaciones"
      >
        <Bell class="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
      </button>

      <!-- Settings -->
      <button
        class="p-2.5 hover:bg-gray-100/80 rounded-xl transition-all hover:scale-105 group"
        title="Configuración"
      >
        <Settings class="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:rotate-90 transition-all duration-300" />
      </button>

      <!-- Operator Badge -->
      <div class="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer group">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span class="text-sm font-semibold text-white">Operador activo:</span>
        </div>

        <div class="relative">
          <div class="absolute inset-0 bg-white rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div class="relative w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white/30 group-hover:scale-110 transition-transform">
            OP
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Bell, Settings } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: 'Panel de Control',
  },
})
</script>

<style scoped>
/* Animaciones adicionales si es necesario */
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>

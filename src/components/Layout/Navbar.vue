<template>
  <header
    class="bg-white shadow-sm h-16 flex items-center justify-between px-6 border-b border-gray-200"
  >
    <h2 class="text-lg font-semibold text-gray-700">
      {{ title }}
    </h2>

    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-600">Operador activo: </span>
      <div class="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-medium">
        OP <!-- Placeholder for operator name -->
      </div>
    </div>
  </header>
</template>

<script setup>
// Simple top navigation bar with contextual title
defineProps({
  title: {
    type: String,
    default: 'Panel de Control',
  },
})
</script>

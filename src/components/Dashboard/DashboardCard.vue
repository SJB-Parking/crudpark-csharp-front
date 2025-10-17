<template>
  <div class="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
    <div>
      <h3 class="text-sm text-gray-500 font-medium">{{ title }}</h3>
      <p class="text-3xl font-semibold mt-2 text-gray-800">{{ value }}</p>
    </div>
    <p v-if="subtitle" class="text-xs text-gray-400 mt-1">{{ subtitle }}</p>
  </div>
</template>

<script setup>
// Reusable dashboard metric card
defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
})
</script>

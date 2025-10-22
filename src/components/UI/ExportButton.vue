<template>
  <button
    @click="handleExport"
    :disabled="isExporting || disabled"
    :class="[
      'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      variant === 'primary'
        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white focus:ring-emerald-500 shadow-md hover:shadow-lg'
        : 'bg-white border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-700 focus:ring-emerald-500',
      (isExporting || disabled) && 'opacity-50 cursor-not-allowed'
    ]"
  >
    <Loader2 v-if="isExporting" class="w-4 h-4 animate-spin" />
    <Download v-else class="w-4 h-4" />
    <span>{{ isExporting ? 'Exportando...' : label }}</span>
  </button>
</template>

<script setup>
import { Download, Loader2 } from 'lucide-vue-next'

defineProps({
  label: {
    type: String,
    default: 'Exportar CSV'
  },
  isExporting: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary', // 'primary' | 'secondary'
    validator: (value) => ['primary', 'secondary'].includes(value)
  }
})

const emit = defineEmits(['export'])

const handleExport = () => {
  emit('export')
}
</script>

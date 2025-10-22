<template>
  <div
    class="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
    :class="cardClass"
  >
    <!-- Gradient Background Effect -->
    <div
      class="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
      :class="gradientClass"
    ></div>

    <!-- Icon -->
    <div
      class="relative mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110"
      :class="iconBgClass"
    >
      <component :is="icon" class="w-7 h-7 text-white" />
    </div>

    <!-- Content -->
    <div class="relative">
      <p class="text-sm font-medium text-gray-500 mb-1">{{ title }}</p>
      <p
        class="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent animate-fade-in"
        :class="valueGradientClass"
      >
        {{ value }}
      </p>
    </div>

    <!-- Decorative corner element -->
    <div
      class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 transition-all duration-300 group-hover:scale-150"
      :class="gradientClass"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Car,
  DollarSign,
  CreditCard,
  AlertCircle,
  XCircle
} from 'lucide-vue-next'

const props = defineProps({
  title: String,
  value: [String, Number],
  variant: {
    type: String,
    default: 'default'
  }
})

// Auto-detect variant based on title
const autoVariant = computed(() => {
  const titleLower = props.title.toLowerCase()
  if (titleLower.includes('vehículo')) return 'primary'
  if (titleLower.includes('ingreso')) return 'success'
  if (titleLower.includes('activa')) return 'info'
  if (titleLower.includes('próxima') || titleLower.includes('vencer')) return 'warning'
  if (titleLower.includes('vencida')) return 'danger'
  return 'default'
})

const currentVariant = computed(() => props.variant || autoVariant.value)

// Icon mapping
const icon = computed(() => {
  switch (currentVariant.value) {
    case 'primary': return Car
    case 'success': return DollarSign
    case 'info': return CreditCard
    case 'warning': return AlertCircle
    case 'danger': return XCircle
    default: return Car
  }
})

// Color classes based on variant
const cardClass = computed(() => {
  switch (currentVariant.value) {
    case 'primary': return 'border-l-4 border-blue-500'
    case 'success': return 'border-l-4 border-emerald-500'
    case 'info': return 'border-l-4 border-purple-500'
    case 'warning': return 'border-l-4 border-amber-500'
    case 'danger': return 'border-l-4 border-rose-500'
    default: return 'border-l-4 border-gray-500'
  }
})

const gradientClass = computed(() => {
  switch (currentVariant.value) {
    case 'primary': return 'bg-gradient-to-br from-blue-500 to-cyan-500'
    case 'success': return 'bg-gradient-to-br from-emerald-500 to-teal-500'
    case 'info': return 'bg-gradient-to-br from-purple-500 to-pink-500'
    case 'warning': return 'bg-gradient-to-br from-amber-500 to-orange-500'
    case 'danger': return 'bg-gradient-to-br from-rose-500 to-red-600'
    default: return 'bg-gradient-to-br from-gray-500 to-slate-500'
  }
})

const iconBgClass = computed(() => {
  switch (currentVariant.value) {
    case 'primary': return 'bg-gradient-to-br from-blue-500 to-cyan-600'
    case 'success': return 'bg-gradient-to-br from-emerald-500 to-teal-600'
    case 'info': return 'bg-gradient-to-br from-purple-500 to-pink-600'
    case 'warning': return 'bg-gradient-to-br from-amber-500 to-orange-600'
    case 'danger': return 'bg-gradient-to-br from-rose-500 to-red-600'
    default: return 'bg-gradient-to-br from-gray-500 to-slate-600'
  }
})

const valueGradientClass = computed(() => {
  switch (currentVariant.value) {
    case 'primary': return 'from-blue-600 to-cyan-600'
    case 'success': return 'from-emerald-600 to-teal-600'
    case 'info': return 'from-purple-600 to-pink-600'
    case 'warning': return 'from-amber-600 to-orange-600'
    case 'danger': return 'from-rose-600 to-red-600'
    default: return 'from-gray-600 to-slate-600'
  }
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>

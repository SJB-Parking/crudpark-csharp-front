<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="cancel"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-scale-in">
      <div class="flex items-center justify-center mb-4">
        <div
          class="rounded-full p-3"
          :class="iconBgClass"
        >
          <svg
            v-if="type === 'warning'"
            class="w-8 h-8"
            :class="iconColorClass"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <svg
            v-else-if="type === 'danger'"
            class="w-8 h-8"
            :class="iconColorClass"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            class="w-8 h-8"
            :class="iconColorClass"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <h3 class="text-xl font-semibold text-gray-900 text-center mb-2">
        {{ title }}
      </h3>

      <p class="text-gray-600 text-center mb-6">
        {{ message }}
      </p>

      <div class="flex gap-3 justify-end">
        <button
          @click="cancel"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="confirm"
          class="px-4 py-2 rounded-lg text-white font-medium transition-colors"
          :class="confirmButtonClass"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'info', // 'info', 'warning', 'danger'
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Confirmar',
  },
  cancelText: {
    type: String,
    default: 'Cancelar',
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const iconBgClass = computed(() => {
  const classes = {
    info: 'bg-blue-100',
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
  }
  return classes[props.type] || classes.info
})

const iconColorClass = computed(() => {
  const classes = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  }
  return classes[props.type] || classes.info
})

const confirmButtonClass = computed(() => {
  const classes = {
    info: 'bg-blue-600 hover:bg-blue-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    danger: 'bg-red-600 hover:bg-red-700',
  }
  return classes[props.type] || classes.info
})

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>
@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease;
}
</style>

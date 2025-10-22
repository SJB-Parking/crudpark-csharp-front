<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="handleCancel"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        @click.stop
      >
        <!-- Icon Header -->
        <div class="p-6 text-center border-b border-gray-200">
          <div
            :class="[
              'w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center',
              iconBgClass
            ]"
          >
            <component :is="iconComponent" :class="iconClass" class="w-8 h-8" />
          </div>
          <h2 class="text-xl font-bold text-gray-800 mb-2">
            {{ title }}
          </h2>
          <p class="text-gray-600">
            {{ message }}
          </p>
        </div>

        <!-- Actions -->
        <div class="p-6 flex gap-3">
          <button
            @click="handleCancel"
            class="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            :class="[
              'flex-1 px-4 py-2.5 rounded-xl font-medium transition-all',
              confirmButtonClass
            ]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { AlertCircle, CheckCircle, AlertTriangle, Info, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'warning', // 'warning', 'danger', 'success', 'info'
    validator: (value) => ['warning', 'danger', 'success', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const iconComponent = computed(() => {
  const icons = {
    warning: AlertTriangle,
    danger: Trash2,
    success: CheckCircle,
    info: Info
  }
  return icons[props.type]
})

const iconClass = computed(() => {
  const classes = {
    warning: 'text-amber-600',
    danger: 'text-red-600',
    success: 'text-emerald-600',
    info: 'text-blue-600'
  }
  return classes[props.type]
})

const iconBgClass = computed(() => {
  const classes = {
    warning: 'bg-amber-100',
    danger: 'bg-red-100',
    success: 'bg-emerald-100',
    info: 'bg-blue-100'
  }
  return classes[props.type]
})

const confirmButtonClass = computed(() => {
  const classes = {
    warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg',
    info: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
  }
  return classes[props.type]
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.modal-enter-active {
  transition: opacity 0.3s ease;
}

.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div {
  transform: scale(0.9) translateY(20px);
}
</style>

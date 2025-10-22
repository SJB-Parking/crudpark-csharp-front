<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto w-96 max-w-full"
        >
          <div
            :class="[
              'rounded-xl shadow-2xl border backdrop-blur-sm overflow-hidden',
              'transform transition-all duration-300',
              toastClasses[toast.type]
            ]"
          >
            <div class="flex items-start gap-3 p-4">
              <!-- Icon -->
              <div
                :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  iconBgClasses[toast.type]
                ]"
              >
                <component :is="iconComponent[toast.type]" :class="iconClasses[toast.type]" class="w-5 h-5" />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0 pt-0.5">
                <h4 class="font-semibold text-gray-900 mb-0.5">
                  {{ toast.title }}
                </h4>
                <p v-if="toast.message" class="text-sm text-gray-600 leading-relaxed">
                  {{ toast.message }}
                </p>
              </div>

              <!-- Close button -->
              <button
                @click="removeToast(toast.id)"
                class="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Progress bar -->
            <div
              class="h-1 transition-all duration-100 ease-linear"
              :class="progressClasses[toast.type]"
              :style="{ width: `${getProgress(toast)}%` }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-vue-next'

const toasts = ref([])
let intervalId = null

const toastClasses = {
  success: 'bg-white border-emerald-200',
  error: 'bg-white border-red-200',
  warning: 'bg-white border-amber-200',
  info: 'bg-white border-blue-200'
}

const iconBgClasses = {
  success: 'bg-emerald-100',
  error: 'bg-red-100',
  warning: 'bg-amber-100',
  info: 'bg-blue-100'
}

const iconClasses = {
  success: 'text-emerald-600',
  error: 'text-red-600',
  warning: 'text-amber-600',
  info: 'text-blue-600'
}

const progressClasses = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500'
}

const iconComponent = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const addToast = (toast) => {
  const id = Date.now() + Math.random()
  const duration = toast.duration || 5000

  toasts.value.push({
    id,
    type: toast.type || 'info',
    title: toast.title,
    message: toast.message,
    duration,
    startTime: Date.now()
  })

  // Auto remove after duration
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const getProgress = (toast) => {
  const elapsed = Date.now() - toast.startTime
  const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100)
  return remaining
}

// Update progress bars
onMounted(() => {
  intervalId = setInterval(() => {
    if (toasts.value.length > 0) {
      // Force re-render by updating a dummy value
      toasts.value = [...toasts.value]
    }
  }, 50)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// Expose methods globally
defineExpose({ addToast })

// Make it available globally via window
onMounted(() => {
  window.$toast = {
    success: (title, message, duration) => addToast({ type: 'success', title, message, duration }),
    error: (title, message, duration) => addToast({ type: 'error', title, message, duration }),
    warning: (title, message, duration) => addToast({ type: 'warning', title, message, duration }),
    info: (title, message, duration) => addToast({ type: 'info', title, message, duration })
  }
})
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
  margin-top: -100px;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>

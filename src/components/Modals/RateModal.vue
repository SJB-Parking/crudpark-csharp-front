<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        @click.stop
      >
        <!-- Header -->
        <div class="relative px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
              <DollarSign class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">
                Editar Tarifa
              </h2>
              <p class="text-sm text-gray-600">
                Actualiza el valor por hora
              </p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-white/50 flex items-center justify-center transition-colors text-gray-600 hover:text-gray-800"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
          <!-- Tipo de Tarifa (readonly) -->
          <div class="form-group">
            <label class="form-label">
              <Tag class="w-4 h-4" />
              Tipo de Tarifa
            </label>
            <div class="relative">
              <input
                v-model="form.rateName"
                type="text"
                readonly
                class="form-input bg-gray-100 cursor-not-allowed"
              />
              <Lock class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <!-- Valor por Hora -->
          <div class="form-group">
            <label class="form-label">
              <DollarSign class="w-4 h-4" />
              Valor por Hora
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                v-model.number="form.hourlyRate"
                type="number"
                required
                min="0"
                step="0.01"
                class="form-input pl-8"
                placeholder="0.00"
              />
            </div>
            <p class="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
              <Info class="w-3 h-3" />
              Se aplicará a todas las nuevas transacciones
            </p>
          </div>

          <!-- Fecha de Vigencia -->
          <div class="form-group">
            <label class="form-label">
              <Calendar class="w-4 h-4" />
              Fecha de Vigencia
            </label>
            <input
              v-model="form.effectiveFrom"
              type="date"
              required
              class="form-input"
            />
            <p class="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
              <AlertCircle class="w-3 h-3" />
              La tarifa será efectiva desde esta fecha
            </p>
          </div>

          <!-- Preview Card -->
          <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs text-gray-600 mb-1">Nueva tarifa</p>
                <p class="text-2xl font-bold text-emerald-700">
                  ${{ form.hourlyRate?.toLocaleString() || '0' }}
                  <span class="text-sm font-normal text-gray-600">/hora</span>
                </p>
              </div>
              <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <TrendingUp class="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save class="w-4 h-4" />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  DollarSign, X, Tag, Lock, Calendar, Save,
  Info, AlertCircle, TrendingUp
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  rateData: { type: Object, default: null }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  rateName: '',
  hourlyRate: 0,
  effectiveFrom: ''
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.rateData) {
    form.value = {
      rateName: props.rateData.rateName || '',
      hourlyRate: props.rateData.hourlyRate || 0,
      effectiveFrom: props.rateData.effectiveFrom?.split('T')[0] || ''
    }
  }
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  const payload = {
    id: props.rateData.id,
    hourlyRate: form.value.hourlyRate,
    effectiveFrom: form.value.effectiveFrom
  }

  emit('submit', payload)
}
</script>

<style scoped>
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply flex items-center gap-2 text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all;
}

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

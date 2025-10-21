<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          Editar Tarifa
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Tipo de Tarifa (readonly) -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Tipo de Tarifa
          </label>
          <input
            v-model="form.rateName"
            type="text"
            readonly
            class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed focus:outline-none"
          />
        </div>

        <!-- Valor por Hora -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Valor por Hora ($)
          </label>
          <input
            v-model.number="form.hourlyRate"
            type="number"
            required
            min="0"
            step="0.01"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <!-- Fecha de Vigencia -->
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Fecha de Vigencia
          </label>
          <input
            v-model="form.effectiveFrom"
            type="date"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  rateData: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  rateName: '',
  hourlyRate: 0,
  effectiveFrom: '',
})

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.rateData) {
      form.value = {
        rateName: props.rateData.rateName || '',
        hourlyRate: props.rateData.hourlyRate || 0,
        effectiveFrom: props.rateData.effectiveFrom?.split('T')[0] || '',
      }
    }
  }
)

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  const payload = {
    id: props.rateData.id,
    hourlyRate: form.value.hourlyRate,
    effectiveFrom: form.value.effectiveFrom,
  }
  
  emit('submit', payload)
}
</script>

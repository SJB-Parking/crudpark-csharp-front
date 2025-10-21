<template>
  <section class="p-6">
    <h1 class="text-2xl font-semibold text-gray-700 mb-6">
      Configuración de Tarifas
    </h1>

    <!-- Modal Component -->
    <RateModal
      :is-open="modalOpen"
      :rate-data="selectedRate"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- Toast Notification -->
    <Toast
      :show="toast.show"
      :type="toast.type"
      :message="toast.message"
      @close="toast.show = false"
    />

    <table class="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
      <thead class="bg-gray-100 text-gray-600 text-sm uppercase">
        <tr>
          <th class="py-3 px-4 text-left">Tipo</th>
          <th class="py-3 px-4 text-left">Valor por hora</th>
          <th class="py-3 px-4 text-left">Fecha de vigencia</th>
          <th class="py-3 px-4 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tarifa in ratesStore.tarifas"
          :key="tarifa.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="py-3 px-4">{{ tarifa.rateName }}</td>
          <td class="py-3 px-4">${{ tarifa.hourlyRate }}</td>
          <td class="py-3 px-4">{{ new Date(tarifa.effectiveFrom).toLocaleDateString() }}</td>
          <td class="py-3 px-4 text-center">
            <button
              @click="openModal(tarifa)"
              class="text-blue-600 hover:underline"
            >
              Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
// Tariffs management page
import { ref, onMounted } from 'vue'
// 1. Importa el nuevo store
import { useRatesStore } from '@/stores/rates'
import RateModal from '@/components/Rates/RateModal.vue'
import Toast from '@/components/common/Toast.vue'

// 2. Crea una instancia del store
const ratesStore = useRatesStore()

// Modal state
const modalOpen = ref(false)
const selectedRate = ref(null)

// Toast notification state
const toast = ref({
  show: false,
  type: 'success',
  message: '',
})

// 3. Llama a la acción del store cuando el componente se monta
onMounted(() => {
  ratesStore.fetchTarifas()
})

// Toast helper
const showToast = (type, message) => {
  toast.value = {
    show: true,
    type,
    message,
  }
}

const openModal = (rate) => {
  selectedRate.value = rate
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  selectedRate.value = null
}

const handleSubmit = async (rateData) => {
  console.log('🔵 handleSubmit called with:', rateData)
  console.log('🔍 ratesStore.updateRate exists?', typeof ratesStore.updateRate)
  
  const result = await ratesStore.updateRate(rateData.id, rateData)
  
  if (result.success) {
    closeModal()
    showToast('success', '✓ Tarifa actualizada exitosamente')
  } else {
    const errorMsg = result.message || 'Error al actualizar la tarifa. Intente nuevamente.'
    showToast('error', `✗ ${errorMsg}`)
  }
}
</script>

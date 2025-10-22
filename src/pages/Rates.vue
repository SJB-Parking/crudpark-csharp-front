<template>
  <section class="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-gray-50 p-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            Configuración de Tarifas
          </h1>
          <p class="text-gray-600">Administra los precios por hora de estacionamiento</p>
        </div>
        <ExportButton
          @export="handleExport"
          :isExporting="isExporting"
          label="Exportar"
          variant="secondary"
        />
      </div>
    </div>

    <!-- Info Banner -->
    <div class="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6 mb-8">
      <div class="flex items-start gap-3">
        <Info class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-blue-900 mb-1">Gestión de Tarifas</h3>
          <p class="text-sm text-blue-800">
            Las tarifas se aplican según el tipo de vehículo. Puedes actualizar los valores en cualquier momento
            y se aplicarán a partir de la fecha de vigencia especificada.
          </p>
        </div>
      </div>
    </div>

    <!-- Rates Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="tarifa in ratesStore.tarifas"
        :key="tarifa.id"
        class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-300"
      >
        <!-- Card Header -->
        <div class="relative h-32 bg-gradient-to-br from-emerald-500 to-teal-600 p-6 flex items-center justify-center">
          <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDE2YzAgNi42MjctNS4zNzMgMTItMTIgMTJzLTEyLTUuMzczLTEyLTEyIDUuMzczLTEyIDEyLTEyIDEyIDUuMzczIDEyIDEyeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
          </div>
          <div class="relative text-center">
            <component
              :is="getRateIcon(tarifa.rateName)"
              class="w-12 h-12 text-white mx-auto mb-2"
            />
            <h3 class="text-xl font-bold text-white">{{ tarifa.rateName }}</h3>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-6">
          <!-- Price -->
          <div class="text-center mb-6">
            <p class="text-sm text-gray-500 mb-1">Tarifa por hora</p>
            <div class="flex items-baseline justify-center gap-1">
              <span class="text-4xl font-bold text-gray-800">
                ${{ tarifa.hourlyRate.toLocaleString() }}
              </span>
              <span class="text-gray-500 font-medium">/h</span>
            </div>
          </div>

          <!-- Vigencia -->
          <div class="bg-gray-50 rounded-xl p-4 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <Calendar class="w-4 h-4 text-gray-500" />
              <span class="text-gray-600">Vigente desde:</span>
            </div>
            <p class="font-semibold text-gray-800 mt-1 ml-6">
              {{ formatDate(tarifa.effectiveFrom) }}
            </p>
          </div>

          <!-- Action Button -->
          <button
            @click="openModal(tarifa)"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg group-hover:scale-105"
          >
            <Edit3 class="w-4 h-4" />
            Editar Tarifa
          </button>
        </div>

        <!-- Decorative Element -->
        <div class="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="ratesStore.tarifas.length === 0" class="text-center py-16 bg-white rounded-2xl shadow-md">
      <DollarSign class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-gray-600 mb-2">No hay tarifas configuradas</h3>
      <p class="text-gray-500">Contacta al administrador para configurar las tarifas</p>
    </div>

    <!-- Modal Component -->
    <RateModal
      :is-open="modalOpen"
      :rate-data="selectedRate"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRatesStore } from '@/stores/rates'
import { useExportCSV } from '@/composables/useExportCSV'
import RateModal from '@/components/Modals/RateModal.vue'
import ExportButton from '@/components/UI/ExportButton.vue'
import {
  DollarSign, Calendar, Edit3, Info,
  Car, Bike, Truck
} from 'lucide-vue-next'

const ratesStore = useRatesStore()
const { exportRatesToCSV, isExporting } = useExportCSV()

// Modal state
const modalOpen = ref(false)
const selectedRate = ref(null)

onMounted(() => {
  ratesStore.fetchTarifas()
})

// Helper functions
const getRateIcon = (rateName) => {
  const name = rateName.toLowerCase()
  if (name.includes('moto')) return Bike
  if (name.includes('camión') || name.includes('camion')) return Truck
  return Car
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Export functionality
const handleExport = async () => {
  const result = await exportRatesToCSV(ratesStore.tarifas)

  if (result.success) {
    window.$toast.success('¡Exportado!', `Archivo ${result.filename} descargado`)
  } else {
    window.$toast.error('Error', result.error)
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
  const result = await ratesStore.updateRate(rateData.id, rateData)

  if (result.success) {
    closeModal()
    window.$toast.success('¡Actualizada!', 'Tarifa actualizada correctamente')
  } else {
    const errorMsg = result.message || 'Error al actualizar la tarifa'
    window.$toast.error('Error', errorMsg)
  }
}
</script>

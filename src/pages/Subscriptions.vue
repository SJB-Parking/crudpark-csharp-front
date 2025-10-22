<template>
  <section class="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 p-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            Control de Mensualidades
          </h1>
          <p class="text-gray-600">Gestiona las suscripciones mensuales</p>
        </div>
        <div class="flex gap-3">
          <ExportButton
            @export="handleExport"
            :isExporting="isExporting"
            label="Exportar"
            variant="secondary"
          />
          <button
            @click="openModal('create')"
            class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Plus class="w-5 h-5" />
            Nueva Mensualidad
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-2xl p-6 shadow-md border-l-4 border-emerald-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Activas</p>
            <p class="text-3xl font-bold text-emerald-600">{{ activeCount }}</p>
          </div>
          <div class="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
            <CheckCircle class="w-7 h-7 text-emerald-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-md border-l-4 border-amber-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Por Vencer</p>
            <p class="text-3xl font-bold text-amber-600">{{ proximasCount }}</p>
          </div>
          <div class="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center">
            <Clock class="w-7 h-7 text-amber-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-md border-l-4 border-red-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Vencidas</p>
            <p class="text-3xl font-bold text-red-600">{{ vencidasCount }}</p>
          </div>
          <div class="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertCircle class="w-7 h-7 text-red-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-md border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total</p>
            <p class="text-3xl font-bold text-blue-600">{{ subscriptionsStore.subscriptions.length }}</p>
          </div>
          <div class="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
            <CreditCard class="w-7 h-7 text-blue-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div class="flex flex-wrap gap-3">
        <button
          v-for="filterOption in filterOptions"
          :key="filterOption.value"
          @click="filter = filterOption.value"
          :class="[
            'px-4 py-2.5 rounded-xl font-medium transition-all',
            filter === filterOption.value
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          <component :is="filterOption.icon" class="w-4 h-4 inline mr-2" />
          {{ filterOption.label }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              <th class="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cliente
              </th>
              <th class="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Vehículos
              </th>
              <th class="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Vigencia
              </th>
              <th class="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Monto
              </th>
              <th class="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th class="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="subscription in filteredSubscriptions"
              :key="subscription.id"
              class="hover:bg-purple-50 transition-colors"
            >
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                    {{ subscription.customer.fullName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ subscription.customer.fullName }}</p>
                    <p class="text-xs text-gray-500">{{ subscription.customer.identificationNumber || subscription.customer.documentNumber }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="(vehicle, index) in subscription.vehicles"
                    :key="index"
                    class="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                  >
                    <Car class="w-3 h-3" />
                    {{ vehicle.licensePlate || 'SIN PLACA' }}
                  </span>
                  <span v-if="!subscription.vehicles || subscription.vehicles.length === 0" class="text-gray-400 text-xs">
                    Sin vehículos
                  </span>
                </div>
              </td>
              <td class="py-4 px-6">
                <div class="text-sm">
                  <p class="text-gray-700 font-medium">{{ formatDate(subscription.endDate) }}</p>
                  <p class="text-xs text-gray-500">{{ getDaysRemaining(subscription.endDate) }}</p>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="font-semibold text-gray-800">
                  ${{ (subscription.amountPaid || subscription.amount || 0).toLocaleString() }}
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                    statusColor(getSubscriptionStatus(subscription))
                  ]"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="statusDotColor(getSubscriptionStatus(subscription))"
                  ></span>
                  {{ getSubscriptionStatusText(subscription) }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openModal('edit', subscription)"
                    class="p-2 hover:bg-purple-100 rounded-lg transition-colors text-purple-600 tooltip"
                    title="Editar"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDelete(subscription)"
                    class="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 tooltip"
                    title="Eliminar"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredSubscriptions.length === 0" class="text-center py-16">
          <CreditCard class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-600 mb-2">No hay mensualidades</h3>
          <p class="text-gray-500">{{ filter ? 'Intenta con otro filtro' : 'Crea tu primera mensualidad' }}</p>
        </div>
      </div>
    </div>

    <!-- Modal Component -->
    <SubscriptionModal
      :is-open="modalOpen"
      :mode="modalMode"
      :subscription-data="selectedSubscription"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :is-open="confirmDialogOpen"
      type="danger"
      :title="confirmTitle"
      :message="confirmMessage"
      confirm-text="Eliminar"
      @confirm="handleConfirmDelete"
      @cancel="closeConfirmDialog"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useSubscriptionsStore } from '@/stores/subscriptions'
import { useExportCSV } from '@/composables/useExportCSV'
import SubscriptionModal from '@/components/Modals/SubscriptionModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ExportButton from '@/components/UI/ExportButton.vue'
import {
  Plus, CheckCircle, Clock, AlertCircle, CreditCard,
  Car, Edit2, Trash2, Layers, CircleDot
} from 'lucide-vue-next'

const subscriptionsStore = useSubscriptionsStore()
const { exportSubscriptionsToCSV, isExporting } = useExportCSV()

// Modal state
const modalOpen = ref(false)
const modalMode = ref('create')
const selectedSubscription = ref(null)

// Confirm dialog state
const confirmDialogOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const subscriptionToDelete = ref(null)

// Filter state
const filter = ref('')

const filterOptions = [
  { value: '', label: 'Todas', icon: Layers },
  { value: 'activas', label: 'Activas', icon: CheckCircle },
  { value: 'proximas', label: 'Por Vencer', icon: Clock },
  { value: 'vencidas', label: 'Vencidas', icon: AlertCircle }
]

onMounted(() => {
  subscriptionsStore.fetchSubscriptions()
})

// Helper functions
const getSubscriptionStatus = (subscription) => {
  if (!subscription.isActive) return 'vencida'

  const endDate = new Date(subscription.endDate)
  const today = new Date()
  const daysUntilExpiration = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiration < 0) return 'vencida'
  if (daysUntilExpiration <= 7) return 'proxima'
  return 'activa'
}

const getSubscriptionStatusText = (subscription) => {
  const status = getSubscriptionStatus(subscription)
  if (status === 'vencida') return 'Vencida'
  if (status === 'proxima') return 'Por Vencer'
  return 'Activa'
}

const statusColor = (status) => {
  if (status === 'vencida') return 'bg-red-100 text-red-700'
  if (status === 'proxima') return 'bg-amber-100 text-amber-700'
  return 'bg-emerald-100 text-emerald-700'
}

const statusDotColor = (status) => {
  if (status === 'vencida') return 'bg-red-500'
  if (status === 'proxima') return 'bg-amber-500'
  return 'bg-emerald-500'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getDaysRemaining = (endDate) => {
  const end = new Date(endDate)
  const today = new Date()
  const days = Math.ceil((end - today) / (1000 * 60 * 60 * 24))

  if (days < 0) return `Venció hace ${Math.abs(days)} días`
  if (days === 0) return 'Vence hoy'
  if (days === 1) return 'Vence mañana'
  return `${days} días restantes`
}

// Computed properties
const filteredSubscriptions = computed(() => {
  if (!filter.value) return subscriptionsStore.subscriptions

  return subscriptionsStore.subscriptions.filter(subscription => {
    const status = getSubscriptionStatus(subscription)

    switch (filter.value) {
      case 'activas':
        return status === 'activa'
      case 'proximas':
        return status === 'proxima'
      case 'vencidas':
        return status === 'vencida'
      default:
        return true
    }
  })
})

const activeCount = computed(() =>
  subscriptionsStore.subscriptions.filter(s => getSubscriptionStatus(s) === 'activa').length
)

const proximasCount = computed(() =>
  subscriptionsStore.subscriptions.filter(s => getSubscriptionStatus(s) === 'proxima').length
)

const vencidasCount = computed(() =>
  subscriptionsStore.subscriptions.filter(s => getSubscriptionStatus(s) === 'vencida').length
)

// Export functionality
const handleExport = async () => {
  const result = await exportSubscriptionsToCSV(subscriptionsStore.subscriptions)

  if (result.success) {
    window.$toast.success('¡Exportado!', `Archivo ${result.filename} descargado`)
  } else {
    window.$toast.error('Error', result.error)
  }
}

const openModal = (mode, data = null) => {
  modalMode.value = mode
  selectedSubscription.value = data
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  selectedSubscription.value = null
}

const handleSubmit = async (subscriptionData) => {
  try {
    let result

    if (modalMode.value === 'create') {
      result = await subscriptionsStore.createSubscription(subscriptionData)

      if (result.success) {
        closeModal()
        window.$toast.success('¡Creada!', 'Mensualidad registrada correctamente')
        await subscriptionsStore.fetchSubscriptions()
      } else {
        const errorMsg = result.message || 'Error al crear la mensualidad'
        window.$toast.error('Error', errorMsg)
      }
    } else {
      result = await subscriptionsStore.updateSubscription(
        subscriptionData.id,
        subscriptionData
      )

      if (result.success) {
        closeModal()
        window.$toast.success('¡Actualizada!', 'Cambios guardados correctamente')
        await subscriptionsStore.fetchSubscriptions()
      } else {
        const errorMsg = result.message || 'Error al actualizar la mensualidad'
        window.$toast.error('Error', errorMsg)
      }
    }
  } catch (error) {
    console.error('Error en handleSubmit:', error)
    window.$toast.error('Error', 'Ocurrió un error inesperado')
  }
}

const confirmDelete = (subscription) => {
  subscriptionToDelete.value = subscription
  confirmTitle.value = 'Eliminar mensualidad'
  confirmMessage.value = `¿Está seguro que desea eliminar la mensualidad de "${subscription.customer.fullName}"?`
  confirmDialogOpen.value = true
}

// ✅ FUNCIÓN CORREGIDA
const handleConfirmDelete = async () => {
  if (subscriptionToDelete.value) {
    const id = subscriptionToDelete.value.id

    // Cerrar el modal primero para mejor UX
    closeConfirmDialog()

    // Ejecutar el delete
    const result = await subscriptionsStore.deleteSubscription(id)

    if (result.success) {
      // Esperar a que Vue actualice el DOM
      await nextTick()
      window.$toast.success('Eliminada', 'Mensualidad eliminada correctamente')
    } else {
      const errorMsg = result.message || 'Error al eliminar'
      window.$toast.error('Error', errorMsg)
    }
  } else {
    closeConfirmDialog()
  }
}

const closeConfirmDialog = () => {
  confirmDialogOpen.value = false
  subscriptionToDelete.value = null
}
</script>

<style scoped>
.tooltip {
  position: relative;
}

.tooltip:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  white-space: nowrap;
  z-index: 10;
  margin-bottom: 0.5rem;
}
</style>

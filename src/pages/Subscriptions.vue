<template>
  <section class="p-6">
    <h1 class="text-2xl font-semibold text-gray-700 mb-6">
      Control de Mensualidades
    </h1>

    <div class="flex gap-4 mb-4">
      <select
        v-model="filter"
        class="border border-gray-300 rounded-lg px-3 py-2"
      >
        <option value="">Todas</option>
        <option value="activas">Activas</option>
        <option value="vencidas">Vencidas</option>
      </select>

      <button
        @click="openModal('create')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Nueva Mensualidad
      </button>
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
          <th class="py-3 px-4 text-left">Cliente</th>
          <th class="py-3 px-4 text-left">Placa</th>
          <th class="py-3 px-4 text-left">Fecha fin</th>
          <th class="py-3 px-4 text-left">Estado</th>
          <th class="py-3 px-4 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="subscription in filteredSubscriptions"
          :key="subscription.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="py-3 px-4">{{ subscription.customer.fullName }}</td>
          <td class="py-3 px-4">
            {{ subscription.vehicles?.map(v => v.licensePlate || 'SIN PLACA').join(', ') || 'Sin vehículos' }}
          </td>
          <td class="py-3 px-4">{{ new Date(subscription.endDate).toLocaleDateString() }}</td>
          <td class="py-3 px-4">
            <span
              class="px-2 py-1 rounded-full text-xs"
              :class="statusColor(getSubscriptionStatus(subscription))"
            >
              {{ getSubscriptionStatusText(subscription) }}
            </span>
          </td>
          <td class="py-3 px-4 text-center">
            <button
              @click="openModal('edit', subscription)"
              class="text-blue-600 hover:underline mr-2"
            >
              Editar
            </button>
            <button
              @click="confirmDelete(subscription)"
              class="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSubscriptionsStore } from '@/stores/subscriptions'
import SubscriptionModal from '@/components/Subscriptions/SubscriptionModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import Toast from '@/components/common/Toast.vue'

const subscriptionsStore = useSubscriptionsStore()

// Modal state
const modalOpen = ref(false)
const modalMode = ref('create')
const selectedSubscription = ref(null)

// Toast notification state
const toast = ref({
  show: false,
  type: 'success',
  message: '',
})

// Confirm dialog state
const confirmDialogOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const subscriptionToDelete = ref(null)

onMounted(() => {
  subscriptionsStore.fetchSubscriptions()
})

// Filtro local (sin usar el store)
const filter = ref('')

// Función para determinar el estado de una suscripción
const getSubscriptionStatus = (subscription) => {
  if (!subscription.isActive) return 'vencida'
  
  const endDate = new Date(subscription.endDate)
  const today = new Date()
  const daysUntilExpiration = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
  
  if (daysUntilExpiration < 0) return 'vencida'
  if (daysUntilExpiration <= 7) return 'proxima'
  return 'activa'
}

// Función para obtener el texto del estado
const getSubscriptionStatusText = (subscription) => {
  const status = getSubscriptionStatus(subscription)
  if (status === 'vencida') return 'Vencida'
  if (status === 'proxima') return 'Próxima a vencer'
  return 'Activa'
}

// Propiedad computada para filtrar las suscripciones
const filteredSubscriptions = computed(() => {
  if (!filter.value) return subscriptionsStore.subscriptions
  
  return subscriptionsStore.subscriptions.filter(subscription => {
    const status = getSubscriptionStatus(subscription)
    
    switch (filter.value) {
      case 'activas':
        // Incluye tanto 'activa' como 'proxima' en el filtro de activas
        return status === 'activa' || status === 'proxima'
      case 'vencidas':
        return status === 'vencida'
      default:
        return true
    }
  })
})

// Toast helper
const showToast = (type, message) => {
  toast.value = {
    show: true,
    type,
    message,
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
  let result
  if (modalMode.value === 'create') {
    result = await subscriptionsStore.createSubscription(subscriptionData)
    if (result.success) {
      closeModal()
      showToast('success', '✓ Mensualidad creada exitosamente')
    } else {
      const errorMsg = result.message || 'Error al crear la mensualidad. Intente nuevamente.'
      showToast('error', `✗ ${errorMsg}`)
    }
  } else {
    result = await subscriptionsStore.updateSubscription(subscriptionData.id, subscriptionData)
    if (result.success) {
      closeModal()
      showToast('success', '✓ Mensualidad actualizada exitosamente')
    } else {
      const errorMsg = result.message || 'Error al actualizar la mensualidad. Intente nuevamente.'
      showToast('error', `✗ ${errorMsg}`)
    }
  }
}

const confirmDelete = (subscription) => {
  subscriptionToDelete.value = subscription
  confirmTitle.value = 'Eliminar mensualidad'
  confirmMessage.value = `¿Está seguro que desea eliminar la mensualidad de "${subscription.customer.fullName}"?`
  confirmDialogOpen.value = true
}

const handleConfirmDelete = async () => {
  if (subscriptionToDelete.value) {
    const result = await subscriptionsStore.deleteSubscription(subscriptionToDelete.value.id)
    
    if (result.success) {
      showToast('success', `✓ Mensualidad eliminada exitosamente`)
    } else {
      const errorMsg = result.message || 'Error al eliminar la mensualidad'
      showToast('error', `✗ ${errorMsg}`)
    }
  }
  closeConfirmDialog()
}

const closeConfirmDialog = () => {
  confirmDialogOpen.value = false
  subscriptionToDelete.value = null
}

// Lógica mejorada para el color y texto del estado
const statusColor = (status) => {
  if (status === 'vencida') return 'bg-red-100 text-red-700'
  if (status === 'proxima') return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}
</script>

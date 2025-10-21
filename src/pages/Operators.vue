<template>
  <section class="p-6">
    <h1 class="text-2xl font-semibold text-gray-700 mb-6">
      Gestión de Operadores
    </h1>

    <div class="flex justify-between mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar operador..."
        class="border border-gray-300 rounded-lg px-3 py-2 w-1/3"
      />
      <button
        @click="openModal('create')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Nuevo Operador
      </button>
    </div>

    <!-- Modal Component -->
    <OperatorModal
      :is-open="modalOpen"
      :mode="modalMode"
      :operator-data="selectedOperator"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :is-open="confirmDialogOpen"
      :type="confirmType"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirm-text="confirmButtonText"
      @confirm="handleConfirmAction"
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
          <th class="py-3 px-4 text-left">Nombre</th>
          <th class="py-3 px-4 text-left">Usuario</th>
          <th class="py-3 px-4 text-left">Correo</th>
          <th class="py-3 px-4 text-left">Estado</th>
          <th class="py-3 px-4 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="operator in filteredOperators"
          :key="operator.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="py-3 px-4">{{ operator.fullName }}</td>
          <td class="py-3 px-4">{{ operator.userName || operator.username || '-' }}</td>
          <td class="py-3 px-4">{{ operator.email }}</td>
          <td class="py-3 px-4">
            <span
              class="px-2 py-1 rounded-full text-xs"
              :class="operator.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ operator.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="py-3 px-4 text-center">
            <button
              @click="openModal('edit', operator)"
              class="text-blue-600 hover:underline mr-2"
            >
              Editar
            </button>
            <button
              @click="toggleStatus(operator)"
              :class="operator.isActive ? 'text-red-600 hover:underline' : 'text-green-600 hover:underline'"
            >
              {{ operator.isActive ? 'Desactivar' : 'Activar' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOperatorsStore } from '@/stores/operators'
import OperatorModal from '@/components/Operators/OperatorModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import Toast from '@/components/common/Toast.vue'

const operatorsStore = useOperatorsStore()
const searchQuery = ref('')
const modalOpen = ref(false)
const modalMode = ref('create')
const selectedOperator = ref(null)

// Toast notification state
const toast = ref({
  show: false,
  type: 'success',
  message: '',
})

// Confirm dialog state
const confirmDialogOpen = ref(false)
const confirmType = ref('warning')
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('Confirmar')
const pendingAction = ref(null)

onMounted(() => {
  operatorsStore.fetchOperators()
})

const filteredOperators = computed(() => {
  if (!searchQuery.value) {
    return operatorsStore.operators
  }
  return operatorsStore.operators.filter((op) =>
    op.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
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
  selectedOperator.value = data
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  selectedOperator.value = null
}

const handleSubmit = async (operatorData) => {
  let result
  if (modalMode.value === 'create') {
    result = await operatorsStore.createOperator(operatorData)
    if (result.success) {
      closeModal()
      showToast('success', '✓ Operador creado exitosamente')
    } else {
      const errorMsg = result.message || 'Error al crear el operador. Intente nuevamente.'
      showToast('error', `✗ ${errorMsg}`)
      console.error('Create operator error:', result.error)
    }
  } else {
    result = await operatorsStore.updateOperator(operatorData.id, operatorData)
    if (result.success) {
      closeModal()
      showToast('success', '✓ Operador actualizado exitosamente')
    } else {
      const errorMsg = result.message || 'Error al actualizar el operador. Intente nuevamente.'
      showToast('error', `✗ ${errorMsg}`)
      console.error('Update operator error:', result.error)
    }
  }
}

const toggleStatus = (operator) => {
  const action = operator.isActive ? 'desactivar' : 'activar'
  const actionCapitalized = operator.isActive ? 'Desactivar' : 'Activar'
  
  confirmType.value = operator.isActive ? 'warning' : 'info'
  confirmTitle.value = `${actionCapitalized} operador`
  confirmMessage.value = `¿Está seguro que desea ${action} al operador "${operator.fullName}"?`
  confirmButtonText.value = actionCapitalized
  pendingAction.value = () => confirmToggleStatus(operator)
  confirmDialogOpen.value = true
}

const confirmToggleStatus = async (operator) => {
  closeConfirmDialog()
  
  const wasActive = operator.isActive
  const result = await operatorsStore.toggleStatus(operator)
  
  if (result.success) {
    // Show success message
    if (wasActive) {
      showToast('success', `✓ Operador "${operator.fullName}" desactivado exitosamente`)
    } else {
      showToast('success', `✓ Operador "${operator.fullName}" activado exitosamente`)
    }
  } else {
    // Show error message
    const errorMsg = result.message || 'Error al cambiar el estado del operador'
    showToast('error', `✗ ${errorMsg}`)
  }
}

const handleConfirmAction = () => {
  if (pendingAction.value) {
    pendingAction.value()
  }
}

const closeConfirmDialog = () => {
  confirmDialogOpen.value = false
  pendingAction.value = null
}
</script>

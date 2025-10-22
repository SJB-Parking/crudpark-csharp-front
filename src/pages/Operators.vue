<template>
  <section class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 p-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            Gestión de Operadores
          </h1>
          <p class="text-gray-600">Administra los usuarios del sistema</p>
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
            class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <UserPlus class="w-5 h-5" />
            Nuevo Operador
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-2xl p-6 shadow-md border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Operadores</p>
            <p class="text-3xl font-bold text-gray-800">{{ operatorsStore.operators.length }}</p>
          </div>
          <div class="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users class="w-7 h-7 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-md border-l-4 border-emerald-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Activos</p>
            <p class="text-3xl font-bold text-emerald-600">{{ activeCount }}</p>
          </div>
          <div class="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
            <CheckCircle class="w-7 h-7 text-emerald-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-md border-l-4 border-red-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Inactivos</p>
            <p class="text-3xl font-bold text-red-600">{{ inactiveCount }}</p>
          </div>
          <div class="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
            <XCircle class="w-7 h-7 text-red-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div class="relative">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre, usuario o correo..."
          class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              <th class="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Operador
              </th>
              <th class="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Usuario
              </th>
              <th class="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Correo
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
              v-for="operator in filteredOperators"
              :key="operator.id"
              class="hover:bg-blue-50 transition-colors"
            >
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                    {{ operator.fullName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ operator.fullName }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <AtSign class="w-4 h-4 text-gray-400" />
                  <span class="text-gray-700">{{ operator.userName || operator.username || '-' }}</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <Mail class="w-4 h-4 text-gray-400" />
                  <span class="text-gray-700">{{ operator.email }}</span>
                </div>
              </td>
              <td class="py-4 px-6 text-center">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
                    operator.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  ]"
                >
                  <span class="w-2 h-2 rounded-full" :class="operator.isActive ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  {{ operator.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openModal('edit', operator)"
                    class="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 tooltip"
                    title="Editar"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    @click="toggleStatus(operator)"
                    :class="[
                      'p-2 rounded-lg transition-colors tooltip',
                      operator.isActive
                        ? 'hover:bg-red-100 text-red-600'
                        : 'hover:bg-emerald-100 text-emerald-600'
                    ]"
                    :title="operator.isActive ? 'Desactivar' : 'Activar'"
                  >
                    <Power class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredOperators.length === 0" class="text-center py-16">
          <Users class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-600 mb-2">No se encontraron operadores</h3>
          <p class="text-gray-500">Intenta con otro término de búsqueda</p>
        </div>
      </div>
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
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOperatorsStore } from '@/stores/operators'
import { useExportCSV } from '@/composables/useExportCSV'
import OperatorModal from '@/components/Modals/OperatorModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ExportButton from '@/components/UI/ExportButton.vue'
import {
  Users, UserPlus, CheckCircle, XCircle, Search,
  Edit2, Power, AtSign, Mail
} from 'lucide-vue-next'

const operatorsStore = useOperatorsStore()
const { exportOperatorsToCSV, isExporting } = useExportCSV()

const searchQuery = ref('')
const modalOpen = ref(false)
const modalMode = ref('create')
const selectedOperator = ref(null)

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

// Computed properties
const filteredOperators = computed(() => {
  if (!searchQuery.value) {
    return operatorsStore.operators
  }
  const query = searchQuery.value.toLowerCase()
  return operatorsStore.operators.filter((op) =>
    op.fullName.toLowerCase().includes(query) ||
    (op.userName || op.username || '').toLowerCase().includes(query) ||
    op.email.toLowerCase().includes(query)
  )
})

const activeCount = computed(() =>
  operatorsStore.operators.filter(op => op.isActive).length
)

const inactiveCount = computed(() =>
  operatorsStore.operators.filter(op => !op.isActive).length
)

// Export functionality
const handleExport = async () => {
  const result = await exportOperatorsToCSV(operatorsStore.operators)

  if (result.success) {
    window.$toast.success('¡Exportado!', `Archivo ${result.filename} descargado`)
  } else {
    window.$toast.error('Error', result.error)
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

// En tu Operators.vue, actualiza la función handleSubmit:

const handleSubmit = async (operatorData) => {
  try {
    let result

    if (modalMode.value === 'create') {
      result = await operatorsStore.createOperator(operatorData)
      if (result.success) {
        closeModal() // ✅ Cerrar modal
        window.$toast.success('¡Creado!', 'Operador registrado correctamente')
        await operatorsStore.fetchOperators() // ✅ Refrescar lista
      } else {
        const errorMsg = result.message || 'Error al crear el operador'
        window.$toast.error('Error', errorMsg)
      }
    } else {
      result = await operatorsStore.updateOperator(operatorData.id, operatorData)
      if (result.success) {
        closeModal() // ✅ Cerrar modal ANTES del toast
        window.$toast.success('¡Actualizado!', 'Cambios guardados correctamente')
        await operatorsStore.fetchOperators() // ✅ Refrescar lista
      } else {
        const errorMsg = result.message || 'Error al actualizar el operador'
        window.$toast.error('Error', errorMsg)
      }
    }
  } catch (error) {
    console.error('Error en handleSubmit:', error)
    window.$toast.error('Error', 'Ocurrió un error inesperado')
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
    if (wasActive) {
      window.$toast.success('Desactivado', `Operador "${operator.fullName}" desactivado`)
    } else {
      window.$toast.success('Activado', `Operador "${operator.fullName}" activado`)
    }
  } else {
    const errorMsg = result.message || 'Error al cambiar el estado'
    window.$toast.error('Error', errorMsg)
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

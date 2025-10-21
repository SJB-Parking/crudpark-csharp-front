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

    <table class="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
      <thead class="bg-gray-100 text-gray-600 text-sm uppercase">
        <tr>
          <th class="py-3 px-4 text-left">Nombre</th>
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
              class="text-red-600 hover:underline"
            >
              {{ operator.active ? 'Inactivar' : 'Activar' }}
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

const operatorsStore = useOperatorsStore()
const searchQuery = ref('')

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

const openModal = (mode, data = null) => {
  console.log(`Open modal: ${mode}`, data)
}
</script>

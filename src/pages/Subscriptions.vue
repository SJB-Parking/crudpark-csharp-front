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
        <option value="proximas">Próximas a vencer</option>
        <option value="vencidas">Vencidas</option>
      </select>

      <button
        @click="openModal('create')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Nueva Mensualidad
      </button>
    </div>

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
          v-for="subscription in subscriptionsStore.subscriptions"
          :key="subscription.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="py-3 px-4">{{ subscription.customer.fullName }}</td>
          <td class="py-3 px-4">{{ subscription.vehicles.map(v => v.licensePlate).join(', ') }}</td>
          <td class="py-3 px-4">{{ new Date(subscription.endDate).toLocaleDateString() }}</td>
          <td class="py-3 px-4">
            <span
              class="px-2 py-1 rounded-full text-xs"
              :class="statusColor(subscription.isActive ? 'activa' : 'vencida')"
            >
              {{ subscription.isActive ? 'Activa' : 'Vencida' }}
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
              @click="deleteMensualidad(subscription)"
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
import { computed, onMounted } from 'vue'
import { useSubscriptionsStore } from '@/stores/subscriptions'

const subscriptionsStore = useSubscriptionsStore()

onMounted(() => {
  subscriptionsStore.fetchSubscriptions()
})

// Propiedad computada para manejar el filtro
const filter = computed({
  get: () => subscriptionsStore.filter,
  set: (value) => subscriptionsStore.setFilter(value),
})

const openModal = (mode, data = null) => {
  console.log(`Open modal: ${mode}`, data)
}

// Lógica mejorada para el color y texto del estado
const statusColor = (daysRemaining) => {
  if (daysRemaining < 0) return 'bg-red-100 text-red-700'
  if (daysRemaining <= 3) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}

const getStatusText = (daysRemaining) => {
  if (daysRemaining < 0) return 'Vencida'
  if (daysRemaining <= 3) return 'Próxima a vencer'
  return 'Activa'
}
</script>

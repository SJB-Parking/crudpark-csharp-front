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
          v-for="m in mensualidades"
          :key="m.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="py-3 px-4">{{ m.client }}</td>
          <td class="py-3 px-4">{{ m.plate }}</td>
          <td class="py-3 px-4">{{ m.expirationDate }}</td>
          <td class="py-3 px-4">
            <span
              class="px-2 py-1 rounded-full text-xs"
              :class="statusColor(m.status)"
            >
              {{ m.status }}
            </span>
          </td>
          <td class="py-3 px-4 text-center">
            <button
              @click="openModal('edit', m)"
              class="text-blue-600 hover:underline mr-2"
            >
              Editar
            </button>
            <button
              @click="deleteMensualidad(m)"
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
// Subscriptions (Mensualidades) management page
import { ref, onMounted } from 'vue'
import api from '../services/api'

const mensualidades = ref([])
const filter = ref('')

// Fetch mensualidades
const fetchMensualidades = async () => {
  try {
    const { data } = await api.get('/mensualidades', {
      params: { filtro: filter.value },
    })
    mensualidades.value = data
  } catch (err) {
    console.error('Failed to fetch mensualidades:', err)
  }
}

onMounted(fetchMensualidades)

const openModal = (mode, data = null) => {
  console.log(`Open modal: ${mode}`, data)
}

const deleteMensualidad = async (m) => {
  await api.delete(`/mensualidades/${m.id}`)
  fetchMensualidades()
}

const statusColor = (status) => {
  switch (status) {
    case 'activa':
      return 'bg-green-100 text-green-700'
    case 'vencida':
      return 'bg-red-100 text-red-700'
    case 'próxima':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return ''
  }
}
</script>

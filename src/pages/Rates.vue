<template>
  <section class="p-6">
    <h1 class="text-2xl font-semibold text-gray-700 mb-6">
      Configuración de Tarifas
    </h1>

    <button
      @click="openModal('create')"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-4"
    >
      Nueva Tarifa
    </button>

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
          v-for="tarifa in tarifas"
          :key="tarifa.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="py-3 px-4">{{ tarifa.rateName }}</td>
          <td class="py-3 px-4">${{ tarifa.hourlyRate }}</td>
          <td class="py-3 px-4">{{ new Date(tarifa.effectiveFrom).toLocaleDateString() }}</td>
          <td class="py-3 px-4 text-center">
            <button
              @click="openModal('edit', tarifa)"
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
import api from '../services/api'

const tarifas = ref([])

const fetchTarifas = async () => {
  const { data } = await api.get('/tarifas')
  tarifas.value = data.data
}

onMounted(fetchTarifas)

const openModal = (mode, data = null) => {
  console.log(`Open modal: ${mode}`, data)
}
</script>

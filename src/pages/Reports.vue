<template>
  <section class="p-6">
    <h1 class="text-2xl font-semibold text-gray-700 mb-6">
      Reportes y Análisis
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold text-gray-600 mb-2">Ingresos del Último Mes</h2>
        <canvas id="incomeChart"></canvas>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold text-gray-600 mb-2">Ocupación Diaria (Últimos 7 días)</h2>
        <canvas id="occupancyChart"></canvas>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import api from '../services/api'
import Chart from 'chart.js/auto'

onMounted(async () => {
  try {
    // --- GRÁFICO DE INGRESOS ---
    const { data: incomeResponse } = await api.get('/reportes/ingresos', {
      params: { periodo: 'month' },
    })

    // 1. Extraer el array de datos
    const incomeData = incomeResponse.data;

    // 2. Mapear los datos al formato de Chart.js
    const incomeLabels = incomeData.map(item => new Date(item.date).toLocaleDateString());
    const incomeValues = incomeData.map(item => item.totalIncome);

    const ctx1 = document.getElementById('incomeChart')
    new Chart(ctx1, {
      type: 'bar',
      data: {
        // 3. Usar los datos mapeados
        labels: incomeLabels,
        datasets: [
          {
            label: 'Ingresos Mensuales',
            data: incomeValues,
            backgroundColor: '#2563eb',
          },
        ],
      },
      options: {
        responsive: true,
      },
    })

    // --- GRÁFICO DE OCUPACIÓN ---
    const { data: occupancyResponse } = await api.get('/reportes/ocupacion', {
        params: { days: 7 }
    });

    const occupancyData = occupancyResponse.data;

    const occupancyLabels = occupancyData.map(item => new Date(item.date).toLocaleDateString());
    const occupancyValues = occupancyData.map(item => item.totalEntries);

    const ctx2 = document.getElementById('occupancyChart')
    new Chart(ctx2, {
      type: 'line', // Un gráfico de líneas es mejor para mostrar tendencias
      data: {
        labels: occupancyLabels,
        datasets: [
          {
            label: 'Vehículos por Día',
            data: occupancyValues,
            backgroundColor: '#10b981',
            borderColor: '#059669',
          },
        ],
      },
      options: { responsive: true },
    })
  } catch (err) {
    console.error('Failed to load reports:', err)
  }
})
</script>

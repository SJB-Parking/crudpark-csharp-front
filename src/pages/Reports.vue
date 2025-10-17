<template>
  <section class="p-6">
    <h1 class="text-2xl font-semibold text-gray-700 mb-6">
      Reportes y Análisis
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <canvas id="incomeChart"></canvas>
      <canvas id="occupancyChart"></canvas>
    </div>
  </section>
</template>

<script setup>
// Reports and charts page
import { onMounted } from 'vue'
import api from '../services/api'
import Chart from 'chart.js/auto'

onMounted(async () => {
  try {
    const { data } = await api.get('/reportes/ingresos', {
      params: { periodo: 'mes' },
    })

    const ctx1 = document.getElementById('incomeChart')
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Ingresos mensuales',
            data: data.values,
            backgroundColor: '#2563eb',
          },
        ],
      },
      options: {
        responsive: true,
      },
    })

    const ctx2 = document.getElementById('occupancyChart')
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Ocupado', 'Disponible'],
        datasets: [
          {
            data: [70, 30],
            backgroundColor: ['#22c55e', '#e5e7eb'],
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

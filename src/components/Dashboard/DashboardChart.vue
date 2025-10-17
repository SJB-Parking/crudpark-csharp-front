<template>
  <div class="bg-white p-5 rounded-2xl shadow-md">
    <h3 class="text-gray-700 text-sm font-semibold mb-4">{{ title }}</h3>
    <component
      :is="chartType"
      :data="chartData"
      :options="chartOptions"
      class="h-72"
    />
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'
import { Bar, Line } from 'vue-chartjs'

// Register required Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
)

defineProps({
  title: String,
  chartType: {
    type: String,
    default: 'Bar',
  },
  chartData: Object,
  chartOptions: Object,
})
</script>

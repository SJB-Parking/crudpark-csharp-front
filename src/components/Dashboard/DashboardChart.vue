<template>
  <div class="bg-white p-5 rounded-2xl shadow-md">
    <h3 class="text-gray-700 text-sm font-semibold mb-4">{{ title }}</h3>
    <component
      :is="chartComponent"
      :data="chartData"
      :options="chartOptions"
      class="h-72"
    />
  </div>
</template>

<script setup>
// 1. Importa 'computed' de Vue
import { computed } from 'vue'
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

ChartJS.register(
  Title, Tooltip, Legend, BarElement, LineElement, PointElement, CategoryScale, LinearScale
)

// 2. Guarda los props en una constante para usarlos
const props = defineProps({
  title: String,
  chartType: {
    type: String,
    default: 'Bar',
  },
  chartData: Object,
  chartOptions: Object,
})

// 3. Crea una propiedad computada que devuelve el componente correcto
const chartComponent = computed(() => {
  if (props.chartType === 'Line') {
    return Line
  }
  // Por defecto, devuelve el componente Bar
  return Bar
})
</script>
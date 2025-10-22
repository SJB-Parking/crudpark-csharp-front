<template>
  <section class="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-gray-50 p-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            Reportes y Análisis
          </h1>
          <p class="text-gray-600">Visualiza el rendimiento de tu estacionamiento</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="refreshReports"
            :disabled="loading"
            class="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-700 rounded-xl transition-all font-medium"
          >
            <RefreshCw :class="['w-4 h-4', loading && 'animate-spin']" />
            Actualizar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="bg-white rounded-2xl shadow-md p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div class="h-64 bg-gray-100 rounded"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-xl p-6">
      <div class="flex items-start gap-3">
        <AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-red-900 mb-1">Error al cargar reportes</h3>
          <p class="text-sm text-red-800">{{ error }}</p>
          <button
            @click="refreshReports"
            class="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Income Chart -->
      <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <TrendingUp class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-800">Ingresos del Último Mes</h2>
              <p class="text-sm text-gray-500">Análisis de ganancias diarias</p>
            </div>
          </div>
        </div>

        <div class="relative" style="height: 300px">
          <canvas ref="incomeChartRef"></canvas>
        </div>

        <!-- Total Income -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Ingresos totales del mes</span>
            <span class="text-2xl font-bold text-emerald-600">
              ${{ totalIncome.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Occupancy Chart -->
      <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <BarChart3 class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-800">Ocupación Diaria</h2>
              <p class="text-sm text-gray-500">Últimos 7 días</p>
            </div>
          </div>
        </div>

        <div class="relative" style="height: 300px">
          <canvas ref="occupancyChartRef"></canvas>
        </div>

        <!-- Average Occupancy -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Promedio de entradas diarias</span>
            <span class="text-2xl font-bold text-blue-600">
              {{ averageOccupancy }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Stats -->
    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div class="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Día con más ingresos</p>
            <p class="text-xl font-bold text-purple-600">{{ bestIncomeDay }}</p>
            <p class="text-sm text-gray-500 mt-1">${{ bestIncomeAmount.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <Trophy class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-md p-6 border-l-4 border-amber-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Día con más ocupación</p>
            <p class="text-xl font-bold text-amber-600">{{ bestOccupancyDay }}</p>
            <p class="text-sm text-gray-500 mt-1">{{ bestOccupancyAmount }} entradas</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Calendar class="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-md p-6 border-l-4 border-rose-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Ingresos promedio/día</p>
            <p class="text-xl font-bold text-rose-600">${{ averageIncome.toLocaleString() }}</p>
            <p class="text-sm text-gray-500 mt-1">Últimos 30 días</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-rose-600" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '../services/api'
import Chart from 'chart.js/auto'
import {
  TrendingUp, BarChart3, RefreshCw, AlertCircle,
  Trophy, Calendar, DollarSign
} from 'lucide-vue-next'

const loading = ref(true)
const error = ref(null)

const incomeChartRef = ref(null)
const occupancyChartRef = ref(null)
let incomeChart = null
let occupancyChart = null

const incomeData = ref([])
const occupancyData = ref([])

// Computed stats
const totalIncome = computed(() => {
  return incomeData.value.reduce((sum, item) => sum + item.totalIncome, 0)
})

const averageIncome = computed(() => {
  if (incomeData.value.length === 0) return 0
  return Math.round(totalIncome.value / incomeData.value.length)
})

const averageOccupancy = computed(() => {
  if (occupancyData.value.length === 0) return 0
  const total = occupancyData.value.reduce((sum, item) => sum + item.totalEntries, 0)
  return Math.round(total / occupancyData.value.length)
})

const bestIncomeDay = computed(() => {
  if (incomeData.value.length === 0) return '-'
  const best = incomeData.value.reduce((max, item) =>
    item.totalIncome > max.totalIncome ? item : max
  )
  return formatDate(best.date, 'short')
})

const bestIncomeAmount = computed(() => {
  if (incomeData.value.length === 0) return 0
  return Math.max(...incomeData.value.map(item => item.totalIncome))
})

const bestOccupancyDay = computed(() => {
  if (occupancyData.value.length === 0) return '-'
  const best = occupancyData.value.reduce((max, item) =>
    item.totalEntries > max.totalEntries ? item : max
  )
  return formatDate(best.date, 'short')
})

const bestOccupancyAmount = computed(() => {
  if (occupancyData.value.length === 0) return 0
  return Math.max(...occupancyData.value.map(item => item.totalEntries))
})

// Helper functions
const formatDate = (dateString, format = 'full') => {
  const date = new Date(dateString)
  if (format === 'short') {
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
  }
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const createIncomeChart = () => {
  if (!incomeChartRef.value) return

  const labels = incomeData.value.map(item => formatDate(item.date, 'short'))
  const values = incomeData.value.map(item => item.totalIncome)

  // Destroy existing chart
  if (incomeChart) {
    incomeChart.destroy()
  }

  incomeChart = new Chart(incomeChartRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Ingresos',
        data: values,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          titleColor: '#fff',
          bodyColor: '#fff',
          displayColors: false,
          callbacks: {
            label: (context) => `$${context.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#6B7280',
            callback: (value) => `$${value.toLocaleString()}`
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#6B7280'
          }
        }
      }
    }
  })
}

const createOccupancyChart = () => {
  if (!occupancyChartRef.value) return

  const labels = occupancyData.value.map(item => formatDate(item.date, 'short'))
  const values = occupancyData.value.map(item => item.totalEntries)

  // Destroy existing chart
  if (occupancyChart) {
    occupancyChart.destroy()
  }

  occupancyChart = new Chart(occupancyChartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Entradas',
        data: values,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          titleColor: '#fff',
          bodyColor: '#fff',
          displayColors: false,
          callbacks: {
            label: (context) => `${context.parsed.y} entradas`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#6B7280',
            stepSize: 1
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#6B7280'
          }
        }
      }
    }
  })
}

// ✅ FUNCIÓN CORREGIDA CON RUTAS CORRECTAS
const loadReports = async () => {
  loading.value = true
  error.value = null

  try {
    // ✅ Cambió de '/reportes/ingresos' a '/reportes/income'
    const incomeResponse = await api.get('/reportes/income', {
      params: { period: 'month' }  // ✅ 'period' en lugar de 'periodo'
    })

    // ✅ Cambió de '/reportes/ocupacion' a '/reportes/occupancy'
    const occupancyResponse = await api.get('/reportes/occupancy', {
      params: { days: 7 }
    })

    // Verificar que las respuestas sean exitosas
    if (incomeResponse.data.success) {
      incomeData.value = incomeResponse.data.data || []
    }

    if (occupancyResponse.data.success) {
      occupancyData.value = occupancyResponse.data.data || []
    }

    // Create charts after data is loaded
    setTimeout(() => {
      createIncomeChart()
      createOccupancyChart()
    }, 100)

    window.$toast.success('Reportes', 'Datos cargados correctamente')

  } catch (err) {
    console.error('Failed to load reports:', err)
    error.value = err.response?.data?.message || 'Error al cargar los reportes'
    window.$toast.error('Error', 'No se pudieron cargar los reportes')
  } finally {
    loading.value = false
  }
}

const refreshReports = () => {
  loadReports()
}

onMounted(() => {
  loadReports()
})

onUnmounted(() => {
  if (incomeChart) incomeChart.destroy()
  if (occupancyChart) occupancyChart.destroy()
})
</script>

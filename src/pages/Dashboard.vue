<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="mb-2">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
        Panel de Control
        <span class="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          General
        </span>
      </h1>
      <p class="text-gray-600">Monitorea tu estacionamiento en tiempo real</p>
    </div>

    <!-- Loading Skeleton -->
    <section v-if="dashboard.loading">
      <DashboardSkeleton />
    </section>

    <!-- Main Content -->
    <div v-else class="space-y-8">
      <!-- Metrics Section -->
      <section
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        style="animation: slideUp 0.6s ease-out"
      >
        <DashboardCard
          title="Vehículos dentro"
          :value="metrics?.vehiclesInside ?? '—'"
          variant="primary"
        />
        <DashboardCard
          title="Ingresos del día"
          :value="`$${Number(metrics?.todayIncome ?? 0).toLocaleString()}`"
          variant="success"
        />
        <DashboardCard
          title="Mensualidades activas"
          :value="metrics?.activeSubscriptions ?? '—'"
          variant="info"
        />
        <DashboardCard
          title="Próximas a vencer"
          :value="metrics?.expiringSoon ?? '—'"
          variant="warning"
        />
        <DashboardCard
          title="Mensualidades vencidas"
          :value="metrics?.expiredSubscriptions ?? '—'"
          variant="danger"
        />
      </section>

      <!-- Charts Section -->
      <section
        class="grid grid-cols-1 lg:grid-cols-2 gap-6"
        style="animation: slideUp 0.8s ease-out"
      >
        <div
          v-if="incomeData"
          class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <TrendingUp class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-800">Ingresos por día</h2>
              <p class="text-sm text-gray-500">Últimos 7 días</p>
            </div>
          </div>
          <DashboardChart
            chartType="Line"
            :chartData="incomeData"
            :chartOptions="enhancedLineOptions"
          />
        </div>

        <div
          v-if="occupancyData"
          class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
              <BarChart3 class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-800">Ocupación promedio</h2>
              <p class="text-sm text-gray-500">Análisis semanal</p>
            </div>
          </div>
          <DashboardChart
            chartType="Bar"
            :chartData="occupancyData"
            :chartOptions="enhancedBarOptions"
          />
        </div>
      </section>

      <!-- Quick Stats Footer -->
      <section
        class="bg-white rounded-2xl shadow-lg p-6"
        style="animation: slideUp 1s ease-out"
      >
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Activity class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Estado del sistema</p>
              <p class="font-bold text-green-600">● Operativo</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock class="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Última actualización</p>
              <p class="font-bold text-gray-700">{{ currentTime }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, onUnmounted } from 'vue'
import { useDashboardStore } from '../stores/dashboard'
import DashboardCard from '../components/Dashboard/DashboardCard.vue'
import DashboardChart from '../components/Dashboard/DashboardChart.vue'
import DashboardSkeleton from "@/components/Dashboard/DashboardSkeleton.vue"
import {
  TrendingUp,
  BarChart3,
  Activity,
  Clock
} from 'lucide-vue-next'

// Current time
const currentTime = ref(new Date().toLocaleTimeString('es-ES', {
  hour: '2-digit',
  minute: '2-digit'
}))

let timeInterval = null

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }, 60000) // Update every minute
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

// Enhanced chart options
const enhancedLineOptions = {
  responsive: true,
  maintainAspectRatio: true,
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
      displayColors: false
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
        color: '#6B7280'
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

const enhancedBarOptions = {
  responsive: true,
  maintainAspectRatio: true,
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
      displayColors: false
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
        color: '#6B7280'
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

// Pinia store instance
const dashboard = useDashboardStore()

// Computed bindings
const metrics = computed(() => dashboard.metrics)
const incomeData = computed(() => dashboard.incomeData)
const occupancyData = computed(() => dashboard.occupancyData)

// Load dashboard data when the component mounts
onMounted(async () => {
  await dashboard.fetchMetrics()
  await dashboard.fetchReports()
})
</script>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

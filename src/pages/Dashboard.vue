<template>
  <main class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-2xl font-bold text-gray-700 mb-8">
      Panel de control general
    </h1>

    <!-- Metrics Section -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <DashboardCard
        title="Vehículos dentro"
        :value="metrics?.vehiclesInside ?? '—'"
      />
      <DashboardCard
        title="Ingresos del día"
        :value="`$${metrics?.dailyIncome ?? 0}`"
      />
      <DashboardCard
        title="Mensualidades activas"
        :value="metrics?.activeMonthlies ?? '—'"
      />
      <DashboardCard
        title="Próximas a vencer"
        :value="metrics?.expiringMonthlies ?? '—'"
      />
      <DashboardCard
        title="Mensualidades vencidas"
        :value="metrics?.expiredMonthlies ?? '—'"
      />
    </section>

    <!-- Charts Section -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardChart
        title="Ingresos por día"
        chartType="Line"
        :chartData="incomeData"
        :chartOptions="chartOptions"
      />
      <DashboardChart
        title="Ocupación promedio"
        chartType="Bar"
        :chartData="occupancyData"
        :chartOptions="chartOptions"
      />
    </section>
    <section v-if="dashboard.loading">
      <DashboardSkeleton/>
    </section>
  </main>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useDashboardStore } from '../stores/dashboard'
import DashboardCard from '../components/Dashboard/DashboardCard.vue'
import DashboardChart from '../components/Dashboard/DashboardChart.vue'
import DashboardSkeleton from "@/components/Dashboard/DashboardSkeleton.vue";

// Chart options (shared by all)
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: false },
  },
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

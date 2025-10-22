// Pinia store that handles dashboard metrics and report data
import { defineStore } from 'pinia'
import api from '../services/api'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    metrics: null,
    incomeData: null,
    occupancyData: null,
    loading: false,
  }),

  actions: {
    // Fetch all dashboard metrics from API
    async fetchMetrics() {
      this.loading = true
      try {
        // Obtener mensualidades para calcular métricas
        const { data } = await api.get('/mensualidades')
        const subscriptions = data.data || []

        // Calcular métricas básicas
        this.metrics = {
          vehiclesInside: 0, // Esto requeriría un endpoint específico
          todayIncome: 0, // Calculado desde payments
          activeSubscriptions: subscriptions.filter(s => s.isActive).length,
          expiringSoon: subscriptions.filter(s => {
            const daysRemaining = s.daysRemaining || 0
            return s.isActive && daysRemaining <= 7 && daysRemaining > 0
          }).length,
          expiredSubscriptions: subscriptions.filter(s => !s.isActive).length
        }
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch report datasets for charts
    async fetchReports() {
      try {
        // ✅ RUTAS CORREGIDAS: Cambió de español a inglés
        const incomeRes = await api.get('/reportes/income', {
          params: { period: 'week' }  // ✅ Cambió de 'periodo: dia' a 'period: week'
        })

        const occupancyRes = await api.get('/reportes/occupancy', {
          params: { days: 7 }  // ✅ Nueva ruta correcta
        })

        // Verificar si las respuestas son exitosas
        if (incomeRes.data.success) {
          const incomeData = incomeRes.data.data || []

          // Transformar datos de ingresos
          this.incomeData = {
            labels: incomeData.map(d => {
              const date = new Date(d.date)
              return date.toLocaleDateString('es-ES', { weekday: 'short' })
            }),
            datasets: [{
              label: 'Ingresos Diarios',
              data: incomeData.map(d => d.totalIncome),
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              borderColor: 'rgba(16, 185, 129, 1)',
              borderWidth: 2,
              tension: 0.4,
              fill: true
            }]
          }
        }

        if (occupancyRes.data.success) {
          const occupancyData = occupancyRes.data.data || []

          // Transformar datos de ocupación
          this.occupancyData = {
            labels: occupancyData.map(d => {
              const date = new Date(d.date)
              return date.toLocaleDateString('es-ES', { weekday: 'short' })
            }),
            datasets: [{
              label: 'Entradas Diarias',
              data: occupancyData.map(d => d.totalEntries),
              backgroundColor: 'rgba(59, 130, 246, 0.6)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            }]
          }
        }

        console.log('✅ Reports loaded successfully')
      } catch (error) {
        console.error('Error fetching reports:', error)

        // Datos de respaldo si falla
        this.incomeData = {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: 'Ingresos Diarios',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2
          }]
        }

        this.occupancyData = {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{
            label: 'Entradas Diarias',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)'
          }]
        }
      }
    }
  }
})

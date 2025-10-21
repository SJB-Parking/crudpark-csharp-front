import { defineStore } from 'pinia'
import api from '../services/api'

export const useReportsStore = defineStore('reports', {
  state: () => ({
    incomeData: null,
    occupancyData: null,
    loading: false,
  }),
  actions: {
    // Acción para buscar ambos reportes a la vez
    async fetchAllReports() {
      if (this.incomeData && this.occupancyData) return // No volver a cargar si ya los tenemos

      this.loading = true
      try {
        // Hacemos las dos llamadas en paralelo para más eficiencia
        const [incomeRes, occupancyRes] = await Promise.all([
          api.get('/reportes/ingresos', { params: { periodo: 'month' } }),
          api.get('/reportes/ocupacion', { params: { days: 7 } })
        ])

        // Transformar datos de ingresos
        this.incomeData = {
          labels: incomeRes.data.data.map(d => new Date(d.date).toLocaleDateString()),
          datasets: [{
            label: 'Ingresos Mensuales',
            data: incomeRes.data.data.map(d => d.totalIncome),
            backgroundColor: '#2563eb',
          }],
        };

        // Transformar datos de ocupación
        this.occupancyData = {
          labels: occupancyRes.data.data.map(d => new Date(d.date).toLocaleDateString()),
          datasets: [{
            label: 'Vehículos por Día',
            data: occupancyRes.data.data.map(d => d.totalEntries),
            backgroundColor: '#10b981',
            borderColor: '#059669',
          }],
        };
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        this.loading = false
      }
    },
  },
})

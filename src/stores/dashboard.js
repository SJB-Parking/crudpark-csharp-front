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
        const { data } = await api.get('/dashboard/metrics')
        this.metrics = data
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch report datasets for charts
    async fetchReports() {
      try {
        const incomeRes = await api.get('/reportes/ingresos?periodo=dia')
        const occupancyRes = await api.get('/reportes/ocupacion')

        this.incomeData = incomeRes.data
        this.occupancyData = occupancyRes.data
      } catch (error) {
        console.error('Error fetching reports:', error)
      }
    },
  },
})

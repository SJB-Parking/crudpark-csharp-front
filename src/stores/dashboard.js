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
        this.metrics = data.data
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error)
      } finally {
        this.loading = false
      }
    },

    // Fetch report datasets for charts
    async fetchReports() {
      try {
        const incomeRes = await api.get('/reportes/ingresos?periodo=dia');
        const occupancyRes = await api.get('/reportes/ocupacion');

        // Transformar datos de ingresos
        this.incomeData = {
          labels: incomeRes.data.data.map(d => new Date(d.date).toLocaleDateString()),
          datasets: [{
            label: 'Ingresos Diarios',
            data: incomeRes.data.data.map(d => d.totalIncome),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        };

        // Transformar datos de ocupación
        this.occupancyData = {
          labels: occupancyRes.data.data.map(d => new Date(d.date).toLocaleDateString()),
          datasets: [{
            label: 'Ocupación Promedio',
            data: occupancyRes.data.data.map(d => d.totalEntries),
            backgroundColor: '#3b82f6',
          }],
        };
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    },
  },
})
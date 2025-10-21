import { defineStore } from 'pinia'
import api from '../services/api'

export const useOperatorsStore = defineStore('operators', {
  state: () => ({
    operators: [],
    loading: false,
  }),
  actions: {
    async fetchOperators() {
      this.loading = true
      try {
        const { data } = await api.get('/operadores')
        this.operators = data.data
      } catch (error) {
        console.error('Failed to fetch operators:', error)
      } finally {
        this.loading = false
      }
    },
    async toggleStatus(operator) {
      // Optimistic update: change status locally first
      const originalStatus = operator.isActive
      operator.isActive = !operator.isActive

      try {
        await api.delete(`/operadores/${operator.id}`)
        // If the API call is successful, we don't need to do anything
        // because we already changed it locally.
      } catch (err) {
        // If the API call fails, revert the change
        operator.isActive = originalStatus
        console.error('Failed to toggle operator status:', err)
      }
    },
  },
})

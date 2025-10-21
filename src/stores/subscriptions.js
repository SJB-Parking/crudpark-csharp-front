import { defineStore } from 'pinia'
import api from '../services/api'

export const useSubscriptionsStore = defineStore('subscriptions', {
  state: () => ({
    subscriptions: [],
    loading: false,
    filter: '', // Para manejar el filtro
  }),
  actions: {
    async fetchSubscriptions() {
      this.loading = true
      try {
        const { data } = await api.get('/mensualidades', {
          params: { filtro: this.filter },
        })
        this.subscriptions = data.data
      } catch (err) {
        console.error('Failed to fetch subscriptions:', err)
      } finally {
        this.loading = false
      }
    },
    async deleteSubscription(subscriptionId) {
      try {
        await api.delete(`/mensualidades/${subscriptionId}`)
        // Después de borrar, volvemos a cargar la lista actualizada
        await this.fetchSubscriptions()
      } catch (err) {
        console.error('Failed to delete subscription:', err)
      }
    },
    // Acción para cambiar el filtro y recargar
    setFilter(newFilter) {
      this.filter = newFilter
      this.fetchSubscriptions()
    }
  },
})

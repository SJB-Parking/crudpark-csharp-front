import { defineStore } from 'pinia'
import api from '../services/api'

export const useRatesStore = defineStore('rates', {
  // 1. STATE: Aquí guardaremos la lista de tarifas
  state: () => ({
    tarifas: [],
    loading: false,
  }),

  // 2. ACTIONS: Aquí pondremos la lógica para llamar a la API
  actions: {
    async fetchTarifas() {
      this.loading = true
      try {
        const { data } = await api.get('/tarifas')
        // Guardamos la lista de tarifas en el state
        this.tarifas = data.data
      } catch (error) {
        console.error('Failed to fetch tarifas:', error)
      } finally {
        this.loading = false
      }
    },
    // Aquí podrías agregar más acciones en el futuro (createRate, updateRate, etc.)
  },
})

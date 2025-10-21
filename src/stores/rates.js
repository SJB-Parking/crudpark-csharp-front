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
    async updateRate(id, rateData) {
      this.loading = true
      try {
        console.log('🔵 Updating rate:', id)
        console.log('Rate data:', JSON.stringify(rateData, null, 2))
        
        const payload = {
          hourlyRate: parseFloat(rateData.hourlyRate),
          effectiveFrom: rateData.effectiveFrom + 'T00:00:00Z'
        }
        
        console.log('Payload:', JSON.stringify(payload, null, 2))
        const { data } = await api.put(`/tarifas/${id}`, payload)
        
        console.log('✅ Rate updated successfully')
        await this.fetchTarifas()
        return { success: true, data: data.data || data }
      } catch (error) {
        console.error('❌ Failed to update rate:', error)
        console.error('Error response:', error.response?.data)
        console.error('Error status:', error.response?.status)
        
        let errorMessage = 'Error desconocido'
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response?.data?.errors) {
          const errors = error.response.data.errors
          errorMessage = Object.values(errors).flat().join(', ')
        } else if (error.response?.data) {
          errorMessage = typeof error.response.data === 'string' 
            ? error.response.data 
            : JSON.stringify(error.response.data)
        } else if (error.message) {
          errorMessage = error.message
        }
        
        return { success: false, error, message: errorMessage }
      } finally {
        this.loading = false
      }
    },
  },
})

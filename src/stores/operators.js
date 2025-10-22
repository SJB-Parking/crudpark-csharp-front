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

    async createOperator(operatorData) {
      this.loading = true
      try {
        console.log('📤 Creating operator:', operatorData)
        const response = await api.post('/operadores', operatorData)
        console.log('📥 Response:', response.data)

        const data = response.data

        // Check if the API returned success: false
        if (data && data.success === false) {
          console.error('API returned success: false', data)
          return {
            success: false,
            error: data,
            message: data.message || 'Error al crear el operador'
          }
        }

        // Add to local state
        if (data && data.data) {
          this.operators.push(data.data)
          return { success: true, data: data.data }
        } else if (data) {
          this.operators.push(data)
          return { success: true, data: data }
        }

        return { success: true, data }
      } catch (error) {
        console.error('❌ Failed to create operator:', error)
        console.error('Error response:', error.response?.data)

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

        return {
          success: false,
          error,
          message: errorMessage
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ FUNCIÓN CORREGIDA
    async updateOperator(id, operatorData) {
      this.loading = true
      try {
        console.log('📤 Updating operator:', id)
        console.log('Data to send:', JSON.stringify(operatorData, null, 2))

        // ✅ NO enviar username en modo edit
        const payload = {
          fullName: operatorData.fullName,
          email: operatorData.email,
          isActive: operatorData.isActive
        }

        // Solo enviar password si existe y no está vacío
        if (operatorData.password && operatorData.password.trim() !== '') {
          payload.password = operatorData.password
        }

        console.log('📤 Final payload:', JSON.stringify(payload, null, 2))
        const response = await api.put(`/operadores/${id}`, payload)
        console.log('📥 Response:', JSON.stringify(response.data, null, 2))

        const updatedOperator = response.data.data || response.data

        // ✅ Actualizar en el estado local
        const index = this.operators.findIndex((op) => op.id === id)
        if (index !== -1) {
          this.operators[index] = { ...updatedOperator }
        }

        return { success: true, data: updatedOperator }
      } catch (error) {
        console.error('❌ Failed to update operator:', error)
        console.error('Error details:', error.response?.data)

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

        return {
          success: false,
          error,
          message: errorMessage
        }
      } finally {
        this.loading = false
      }
    },

    // ✅ FUNCIÓN CORREGIDA
    async toggleStatus(operator) {
      this.loading = true
      const originalStatus = operator.isActive

      try {
        console.log(`🔵 Toggling operator ${operator.id} status from ${originalStatus} to ${!originalStatus}`)

        // ✅ NO enviar username, solo lo necesario
        const payload = {
          fullName: operator.fullName,
          email: operator.email,
          isActive: !originalStatus
        }

        console.log('📤 Toggle payload:', payload)
        const { data } = await api.put(`/operadores/${operator.id}`, payload)
        console.log('📥 Toggle response:', data)

        // ✅ Actualizar en el estado local
        const index = this.operators.findIndex((op) => op.id === operator.id)
        if (index !== -1) {
          this.operators[index] = { ...(data.data || data) }
        }

        return { success: true }
      } catch (err) {
        // Si falla, revertir el cambio local
        operator.isActive = originalStatus
        console.error('❌ Failed to toggle operator status:', err)
        console.error('Error details:', err.response?.data)
        return {
          success: false,
          error: err,
          message: err.response?.data?.message || 'Error al cambiar el estado del operador'
        }
      } finally {
        this.loading = false
      }
    },
  },
})

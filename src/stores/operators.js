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
        console.log('Sending operator data:', operatorData)
        const response = await api.post('/operadores', operatorData)
        console.log('Full response:', response)
        console.log('Response data:', response.data)
        
        const data = response.data
        
        // Check if the API returned success: false (even with 200 status)
        if (data && data.success === false) {
          console.error('API returned success: false', data)
          return {
            success: false,
            error: data,
            message: data.message || 'Error al crear el operador'
          }
        }
        
        // Check if the response has the expected structure
        if (data && data.data) {
          this.operators.push(data.data)
          return { success: true, data: data.data }
        } else if (data) {
          // If the response is the operator directly
          this.operators.push(data)
          return { success: true, data: data }
        }
        
        return { success: true, data }
      } catch (error) {
        console.error('Failed to create operator:', error)
        console.error('Error response:', error.response)
        console.error('Error details:', error.response?.data)
        
        // Extract the error message from different possible locations
        let errorMessage = 'Error desconocido'
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response?.data?.errors) {
          // Handle validation errors
          const errors = error.response.data.errors
          errorMessage = Object.values(errors).flat().join(', ')
        } else if (error.response?.data) {
          // Sometimes the message comes directly in data
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
    async updateOperator(id, operatorData) {
      this.loading = true
      try {
        console.log('📤 Sending to API:', JSON.stringify(operatorData, null, 2))
        const response = await api.put(`/operadores/${id}`, operatorData)
        console.log('📥 Received from API:', JSON.stringify(response.data, null, 2))
        
        const updatedOperator = response.data.data || response.data
        
        const index = this.operators.findIndex((op) => op.id === id)
        if (index !== -1) {
          // Force reactivity by replacing the entire object
          this.operators[index] = { ...updatedOperator }
        }
        
        return { success: true, data: updatedOperator }
      } catch (error) {
        console.error('Failed to update operator:', error)
        console.error('Error details:', error.response?.data)
        
        // Extract the error message from different possible locations
        let errorMessage = 'Error desconocido'
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.response?.data?.errors) {
          // Handle validation errors
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
    async toggleStatus(operator) {
      this.loading = true
      const originalStatus = operator.isActive
      
      try {
        console.log(`Toggling operator ${operator.id} status from ${originalStatus} to ${!originalStatus}`)
        console.log('Operator object:', operator)
        
        // Update the operator with the new status
        const updatedData = {
          id: operator.id,
          fullName: operator.fullName,
          username: operator.userName || operator.username || operator.email,  // Backend expects 'username' in lowercase
          email: operator.email,
          isActive: !originalStatus
        }
        
        console.log('Sending toggle data:', updatedData)
        const { data } = await api.put(`/operadores/${operator.id}`, updatedData)
        console.log('Toggle status response:', data)
        
        // Update locally with the response from server
        const index = this.operators.findIndex((op) => op.id === operator.id)
        if (index !== -1) {
          this.operators[index] = { ...(data.data || data) }
        }
        
        return { success: true }
      } catch (err) {
        // If the API call fails, revert the change
        operator.isActive = originalStatus
        console.error('Failed to toggle operator status:', err)
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

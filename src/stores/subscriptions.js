import { defineStore } from 'pinia'
import api from '../services/api'

export const useSubscriptionsStore = defineStore('subscriptions', {
  state: () => ({
    subscriptions: [],
    loading: false,
  }),
  actions: {
    async fetchSubscriptions() {
      this.loading = true
      try {
        console.log('🔵 Fetching subscriptions...')
        const { data } = await api.get('/mensualidades')
        console.log('📥 Received subscriptions:', data)
        
        // El backend puede devolver data.data o data directamente
        this.subscriptions = data.data || data
        console.log('✅ Subscriptions loaded:', this.subscriptions.length)
      } catch (err) {
        console.error('❌ Failed to fetch subscriptions:', err)
      } finally {
        this.loading = false
      }
    },
    async createSubscription(subscriptionData) {
      this.loading = true
      try {
        console.log('🔵 Creating subscription...')
        console.log('Original data:', JSON.stringify(subscriptionData, null, 2))
        
        // 1. Crear o buscar el cliente
        const customerPayload = {
          fullName: subscriptionData.customerName,
          email: subscriptionData.customerEmail || 'no-email@example.com',
          phone: subscriptionData.customerPhone || '',
          identificationNumber: subscriptionData.customerDocument
        }
        
        console.log('Creating customer:', customerPayload)
        let customerId
        try {
          const customerResponse = await api.post('/clientes', customerPayload)
          customerId = customerResponse.data.data?.id || customerResponse.data.id
          console.log('✅ Customer created with ID:', customerId)
        } catch (error) {
          console.error('❌ Customer creation failed:', error.response?.data)
          throw error
        }
        
        // 2. Crear los vehículos
        const vehicleIds = []
        for (const vehicle of subscriptionData.vehicles) {
          console.log('Creating vehicle:', vehicle)
          
          // Convertir el tipo de vehículo a número (enum)
          // 0 = Car, 1 = Motorcycle, 2 = Truck
          let vehicleTypeEnum = 0 // Default: Car
          if (vehicle.vehicleType === 'Moto' || vehicle.vehicleType === 'Motorcycle') {
            vehicleTypeEnum = 1
          } else if (vehicle.vehicleType === 'Truck' || vehicle.vehicleType === 'Camión') {
            vehicleTypeEnum = 2
          }
          
          const vehiclePayload = {
            licensePlate: vehicle.licensePlate.toUpperCase(),
            vehicleType: vehicleTypeEnum,
            customerId: customerId
          }
          console.log('Vehicle payload:', vehiclePayload)
          
          try {
            const vehicleResponse = await api.post('/vehiculos', vehiclePayload)
            const vehicleId = vehicleResponse.data.data?.id || vehicleResponse.data.id
            vehicleIds.push(vehicleId)
            console.log('✅ Vehicle created with ID:', vehicleId)
          } catch (error) {
            console.error('❌ Vehicle creation failed:', error.response?.data)
            throw error
          }
        }
        
        // 3. Crear la mensualidad
        const subscriptionPayload = {
          customerId: customerId,
          startDate: subscriptionData.startDate + 'T00:00:00Z',
          endDate: subscriptionData.endDate + 'T23:59:59Z',
          amountPaid: parseFloat(subscriptionData.amount),
          maxVehicles: subscriptionData.vehicles.length,
          vehicleIds: vehicleIds
        }
        
        console.log('Creating subscription:', JSON.stringify(subscriptionPayload, null, 2))
        const { data } = await api.post('/mensualidades', subscriptionPayload)
        
        console.log('✅ Subscription created successfully!')
        await this.fetchSubscriptions()
        return { success: true, data: data.data || data }
      } catch (error) {
        console.error('❌ Failed to create subscription:', error)
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
    async updateSubscription(id, subscriptionData) {
      this.loading = true
      try {
        console.log('🔵 Updating subscription:', id)
        console.log('Original data:', JSON.stringify(subscriptionData, null, 2))
        
        // Actualizar la mensualidad (solo campos permitidos por el backend)
        const subscriptionPayload = {
          startDate: subscriptionData.startDate + 'T00:00:00Z',
          endDate: subscriptionData.endDate + 'T23:59:59Z',
          amountPaid: parseFloat(subscriptionData.amount),
          isActive: subscriptionData.isActive
        }
        
        console.log('Updating subscription with:', JSON.stringify(subscriptionPayload, null, 2))
        const { data } = await api.put(`/mensualidades/${id}`, subscriptionPayload)
        
        console.log('✅ Subscription updated:', JSON.stringify(data, null, 2))
        await this.fetchSubscriptions()
        return { success: true, data: data.data || data }
      } catch (error) {
        console.error('❌ Failed to update subscription:', error)
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
    async deleteSubscription(subscriptionId) {
      this.loading = true
      try {
        console.log('🔵 Deleting subscription:', subscriptionId)
        const response = await api.delete(`/mensualidades/${subscriptionId}`)
        console.log('✅ Delete response:', response.data)
        
        // Recargar la lista después de eliminar
        await this.fetchSubscriptions()
        console.log('✅ Subscriptions reloaded after delete')
        
        return { success: true }
      } catch (error) {
        console.error('❌ Failed to delete subscription:', error)
        console.error('Error response:', error.response?.data)
        console.error('Error status:', error.response?.status)
        
        return { 
          success: false, 
          error,
          message: error.response?.data?.message || 'Error al eliminar la mensualidad'
        }
      } finally {
        this.loading = false
      }
    },
  },
})

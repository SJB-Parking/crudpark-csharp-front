<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ mode === 'create' ? 'Nueva Mensualidad' : 'Editar Mensualidad' }}
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Cliente -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Cliente
          </label>
          <input
            v-model="form.customerName"
            type="text"
            required
            :readonly="mode === 'edit'"
            :class="mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre completo del cliente"
          />
        </div>

        <!-- Documento -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Documento
          </label>
          <input
            v-model="form.customerDocument"
            type="text"
            required
            :readonly="mode === 'edit'"
            :class="mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Número de documento"
          />
        </div>

        <!-- Teléfono -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Teléfono
          </label>
          <input
            v-model="form.customerPhone"
            type="tel"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Número de teléfono"
          />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Email
          </label>
          <input
            v-model="form.customerEmail"
            type="email"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <!-- Vehículos -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Vehículos
          </label>
          <div v-for="(vehicle, index) in form.vehicles" :key="index" class="flex gap-2 mb-2">
            <input
              v-model="vehicle.licensePlate"
              type="text"
              required
              :readonly="mode === 'edit'"
              :class="mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''"
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Placa del vehículo"
            />
            <select
              v-model="vehicle.vehicleType"
              required
              :disabled="mode === 'edit'"
              :class="mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tipo</option>
              <option value="Carro">Carro</option>
              <option value="Moto">Moto</option>
            </select>
            <button
              v-if="form.vehicles.length > 1 && mode === 'create'"
              type="button"
              @click="removeVehicle(index)"
              class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              ✕
            </button>
          </div>
          <button
            v-if="mode === 'create'"
            type="button"
            @click="addVehicle"
            class="text-blue-600 hover:underline text-sm"
          >
            + Agregar vehículo
          </button>
        </div>

        <!-- Fechas -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">
              Fecha de Inicio
            </label>
            <input
              v-model="form.startDate"
              type="date"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-2">
              Fecha de Fin
            </label>
            <input
              v-model="form.endDate"
              type="date"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Monto -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Monto Mensual
          </label>
          <input
            v-model.number="form.amount"
            type="number"
            required
            min="0"
            step="0.01"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <!-- Estado (solo en edición) -->
        <div class="mb-6" v-if="mode === 'edit'">
          <label class="flex items-center">
            <input
              v-model="form.isActive"
              type="checkbox"
              class="mr-2 h-4 w-4 text-blue-600"
            />
            <span class="text-gray-700 text-sm font-medium">Activa</span>
          </label>
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {{ mode === 'create' ? 'Crear' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'create',
  },
  subscriptionData: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  customerName: '',
  customerDocument: '',
  customerPhone: '',
  customerEmail: '',
  vehicles: [{ licensePlate: '', vehicleType: '' }],
  startDate: '',
  endDate: '',
  amount: 0,
  isActive: true,
})

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.mode === 'edit' && props.subscriptionData) {
        // Función para convertir el enum de vehicleType del backend a string del frontend
        const mapVehicleType = (enumValue) => {
          const typeMap = {
            0: 'Carro',  // Car
            1: 'Moto',   // Motorcycle
            2: 'Camión'  // Truck
          }
          return typeMap[enumValue] || 'Carro'
        }

        form.value = {
          customerName: props.subscriptionData.customer?.fullName || '',
          customerDocument: props.subscriptionData.customer?.identificationNumber || props.subscriptionData.customer?.documentNumber || '',
          customerPhone: props.subscriptionData.customer?.phone || '',
          customerEmail: props.subscriptionData.customer?.email || '',
          vehicles: props.subscriptionData.vehicles?.length > 0 
            ? props.subscriptionData.vehicles.map(v => ({
                licensePlate: v.licensePlate || 'SIN PLACA',
                vehicleType: mapVehicleType(v.vehicleType)
              }))
            : [{ licensePlate: '', vehicleType: '' }],
          startDate: props.subscriptionData.startDate?.split('T')[0] || '',
          endDate: props.subscriptionData.endDate?.split('T')[0] || '',
          amount: props.subscriptionData.amountPaid || props.subscriptionData.amount || 0,
          isActive: props.subscriptionData.isActive !== undefined ? props.subscriptionData.isActive : true,
        }
      } else {
        // Reset form for create mode
        const today = new Date().toISOString().split('T')[0]
        const nextMonth = new Date()
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        const endDate = nextMonth.toISOString().split('T')[0]
        
        form.value = {
          customerName: '',
          customerDocument: '',
          customerPhone: '',
          customerEmail: '',
          vehicles: [{ licensePlate: '', vehicleType: '' }],
          startDate: today,
          endDate: endDate,
          amount: 0,
          isActive: true,
        }
      }
    }
  }
)

const addVehicle = () => {
  form.value.vehicles.push({ licensePlate: '', vehicleType: '' })
}

const removeVehicle = (index) => {
  form.value.vehicles.splice(index, 1)
}

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  const payload = { ...form.value }
  
  if (props.mode === 'edit') {
    payload.id = props.subscriptionData.id
    payload.customerId = props.subscriptionData.customer.id
  }
  
  emit('submit', payload)
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden transform transition-all"
        @click.stop
      >
        <!-- Header -->
        <div class="relative px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 sticky top-0 z-10">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <CreditCard class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">
                {{ mode === 'create' ? 'Nueva Mensualidad' : 'Editar Mensualidad' }}
              </h2>
              <p class="text-sm text-gray-600">
                {{ mode === 'create' ? 'Registra una nueva suscripción' : 'Actualiza la información' }}
              </p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-white/50 flex items-center justify-center transition-colors text-gray-600 hover:text-gray-800"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <!-- Cliente Info -->
          <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 class="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <UserCircle class="w-4 h-4" />
              Información del Cliente
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">
                  <User class="w-4 h-4" />
                  Nombre Completo
                </label>
                <input
                  v-model="form.customerName"
                  type="text"
                  required
                  :readonly="mode === 'edit'"
                  :class="mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''"
                  class="form-input"
                  placeholder="Juan Pérez"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <FileText class="w-4 h-4" />
                  Documento
                </label>
                <input
                  v-model="form.customerDocument"
                  type="text"
                  required
                  :readonly="mode === 'edit'"
                  :class="mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''"
                  class="form-input"
                  placeholder="123456789"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <Phone class="w-4 h-4" />
                  Teléfono
                </label>
                <input
                  v-model="form.customerPhone"
                  type="tel"
                  class="form-input"
                  placeholder="300 123 4567"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <Mail class="w-4 h-4" />
                  Email
                </label>
                <input
                  v-model="form.customerEmail"
                  type="email"
                  class="form-input"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
          </div>

          <!-- Vehículos -->
          <div class="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <h3 class="text-sm font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <Car class="w-4 h-4" />
              Vehículos
            </h3>
            <div class="space-y-3">
              <div v-for="(vehicle, index) in form.vehicles" :key="index" class="grid grid-cols-12 gap-2">
                <!-- Placa - Más ancho -->
                <div class="col-span-7">
                  <input
                    v-model="vehicle.licensePlate"
                    type="text"
                    required
                    :readonly="mode === 'edit'"
                    :class="mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''"
                    class="form-input text-sm"
                    placeholder="ABC-123"
                    maxlength="10"
                  />
                </div>

                <!-- Tipo de vehículo -->
                <div class="col-span-4">
                  <select
                    v-model="vehicle.vehicleType"
                    required
                    :disabled="mode === 'edit'"
                    :class="mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''"
                    class="form-input text-sm"
                  >
                    <option value="">Tipo</option>
                    <option value="Carro">🚗 Carro</option>
                    <option value="Moto">🏍️ Moto</option>
                    <option value="Camión">🚚 Camión</option>
                  </select>
                </div>

                <!-- Botón eliminar -->
                <div class="col-span-1 flex items-center justify-center">
                  <button
                    v-if="form.vehicles.length > 1 && mode === 'create'"
                    type="button"
                    @click="removeVehicle(index)"
                    class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    title="Eliminar vehículo"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                v-if="mode === 'create'"
                type="button"
                @click="addVehicle"
                class="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                <Plus class="w-4 h-4" />
                Agregar vehículo
              </button>
            </div>
          </div>

          <!-- Fechas y Monto -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="form-group">
              <label class="form-label">
                <Calendar class="w-4 h-4" />
                Fecha de Inicio
              </label>
              <input
                v-model="form.startDate"
                type="date"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <CalendarCheck class="w-4 h-4" />
                Fecha de Fin
              </label>
              <input
                v-model="form.endDate"
                type="date"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <DollarSign class="w-4 h-4" />
                Monto Mensual
              </label>
              <input
                v-model.number="form.amount"
                type="number"
                required
                min="0"
                step="0.01"
                class="form-input"
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- Estado (solo en edit) -->
          <div v-if="mode === 'edit'" class="form-group">
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="relative">
                <input
                  v-model="form.isActive"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-emerald-500 transition-colors"></div>
                <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-md"></div>
              </div>
              <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Mensualidad activa
              </span>
            </label>
          </div>
        </form>

        <!-- Footer Actions -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 sticky bottom-0">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmit"
            class="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Save class="w-4 h-4" />
            {{ mode === 'create' ? 'Crear' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  CreditCard, X, UserCircle, User, FileText, Phone, Mail,
  Car, Calendar, CalendarCheck, DollarSign, Save, Plus, Trash2
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  mode: { type: String, default: 'create' },
  subscriptionData: { type: Object, default: null }
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
  isActive: true
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.mode === 'edit' && props.subscriptionData) {
      const mapVehicleType = (enumValue) => {
        const typeMap = { 0: 'Carro', 1: 'Moto', 2: 'Camión' }
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
        isActive: props.subscriptionData.isActive !== undefined ? props.subscriptionData.isActive : true
      }
    } else {
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
        isActive: true
      }
    }
  }
})

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

<style scoped>
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply flex items-center gap-2 text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all;
}

.modal-enter-active {
  transition: opacity 0.3s ease;
}

.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div {
  transform: scale(0.9) translateY(20px);
}
</style>

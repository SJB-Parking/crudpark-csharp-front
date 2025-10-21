<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ mode === 'create' ? 'Nuevo Operador' : 'Editar Operador' }}
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Nombre Completo
          </label>
          <input
            v-model="form.fullName"
            type="text"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese el nombre completo"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Nombre de Usuario
          </label>
          <input
            v-model="form.userName"
            type="text"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :placeholder="mode === 'edit' && form.userName ? form.userName : 'nombre.usuario'"
          />
          <p v-if="mode === 'edit'" class="text-xs text-gray-500 mt-1">
            Actual: {{ form.userName || 'No especificado' }}
          </p>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Correo Electrónico
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div class="mb-4" v-if="mode === 'create'">
          <label class="block text-gray-700 text-sm font-medium mb-2">
            Contraseña
          </label>
          <input
            v-model="form.password"
            type="password"
            :required="mode === 'create'"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese la contraseña"
          />
        </div>

        <div class="mb-6" v-if="mode === 'edit'">
          <label class="flex items-center">
            <input
              v-model="form.isActive"
              type="checkbox"
              class="mr-2 h-4 w-4 text-blue-600"
            />
            <span class="text-gray-700 text-sm font-medium">Activo</span>
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
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar' }}
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
    default: 'create', // 'create' or 'edit'
  },
  operatorData: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const loading = ref(false)
const form = ref({
  fullName: '',
  userName: '',
  email: '',
  password: '',
  isActive: true,
})

// Reset or populate form when modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.mode === 'edit' && props.operatorData) {
        form.value = {
          fullName: props.operatorData.fullName || '',
          // Check both userName (camelCase) and username (lowercase)
          userName: props.operatorData.userName || props.operatorData.username || '',
          email: props.operatorData.email || '',
          password: '',
          isActive: props.operatorData.isActive !== undefined ? props.operatorData.isActive : true,
        }
      } else {
        // Reset form for create mode
        form.value = {
          fullName: '',
          userName: '',
          email: '',
          password: '',
          isActive: true,
        }
      }
    }
  }
)

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  const payload = { ...form.value }
  
  // Backend expects 'username' in lowercase, not 'userName'
  if (payload.userName) {
    payload.username = payload.userName
    delete payload.userName
  }
  
  if (props.mode === 'edit') {
    payload.id = props.operatorData.id
    // Don't send password if it's empty in edit mode
    if (!payload.password) {
      delete payload.password
    }
  }
  
  emit('submit', payload)
}
</script>

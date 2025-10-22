<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        @click.stop
      >
        <!-- Header -->
        <div class="relative px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-2xl">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
              <User class="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">
                {{ mode === 'create' ? 'Nuevo Operador' : 'Editar Operador' }}
              </h2>
              <p class="text-sm text-gray-600">
                {{ mode === 'create' ? 'Registra un nuevo usuario' : 'Actualiza la información' }}
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
        <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
          <!-- Nombre Completo -->
          <div class="form-group">
            <label class="form-label">
              <UserCircle class="w-4 h-4" />
              Nombre Completo
            </label>
            <input
              v-model="form.fullName"
              type="text"
              required
              class="form-input"
              placeholder="Juan Pérez González"
            />
          </div>

          <!-- Nombre de Usuario -->
          <div class="form-group">
            <label class="form-label">
              <AtSign class="w-4 h-4" />
              Nombre de Usuario
              <span v-if="mode === 'edit'" class="ml-1 text-xs text-gray-400">(no editable)</span>
            </label>
            <div class="relative group">
              <input
                v-model="form.userName"
                type="text"
                required
                :disabled="mode === 'edit'"
                :class="[
                  'form-input',
                  mode === 'edit' ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : ''
                ]"
                :placeholder="mode === 'edit' && form.userName ? form.userName : 'nombre.usuario'"
              />
              <!-- Tooltip -->
              <div
                v-if="mode === 'edit'"
                class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg z-10"
              >
                <Lock class="w-3 h-3 inline mr-1" />
                El nombre de usuario no se puede modificar
                <!-- Flecha del tooltip -->
                <div class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>

          <!-- Correo Electrónico -->
          <div class="form-group">
            <label class="form-label">
              <Mail class="w-4 h-4" />
              Correo Electrónico
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="form-input"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <!-- Contraseña (solo en create) -->
          <div class="form-group" v-if="mode === 'create'">
            <label class="form-label">
              <Lock class="w-4 h-4" />
              Contraseña
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :required="mode === 'create'"
                class="form-input pr-10"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
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
                Operador activo
              </span>
            </label>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              {{ loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { User, X, UserCircle, AtSign, Mail, Lock, Eye, EyeOff, Save, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  mode: { type: String, default: 'create' },
  operatorData: { type: Object, default: null }
})

const emit = defineEmits(['close', 'submit'])

const loading = ref(false)
const showPassword = ref(false)
const form = ref({
  fullName: '',
  userName: '',
  email: '',
  password: '',
  isActive: true
})

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    showPassword.value = false
    if (props.mode === 'edit' && props.operatorData) {
      form.value = {
        fullName: props.operatorData.fullName || '',
        userName: props.operatorData.userName || props.operatorData.username || '',
        email: props.operatorData.email || '',
        password: '',
        isActive: props.operatorData.isActive !== undefined ? props.operatorData.isActive : true
      }
    } else {
      form.value = {
        fullName: '',
        userName: '',
        email: '',
        password: '',
        isActive: true
      }
    }
  }
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  const payload = { ...form.value }

  if (payload.userName) {
    payload.username = payload.userName
    delete payload.userName
  }

  if (props.mode === 'edit') {
    payload.id = props.operatorData.id
    if (!payload.password) {
      delete payload.password
    }
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
  @apply w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all;
}

.form-hint {
  @apply text-xs text-gray-500 mt-1;
}

/* Modal transitions */
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

<template>
  <aside
    :class="[
      'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
      'text-white transition-all duration-300 ease-in-out',
      'flex flex-col shadow-2xl relative border-r border-white/5',
      isOpen ? 'w-72' : 'w-20'
    ]"
    style="min-height: 100vh;"
  >
    <!-- Decorative gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>

    <!-- Logo Section -->
    <div class="relative p-6 border-b border-white/10 backdrop-blur-xl">
      <div class="flex items-center gap-4 overflow-hidden">
        <!-- Logo con efecto glow -->
        <div class="relative flex-shrink-0 group">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-transform">
            <ParkingCircle class="w-7 h-7" />
          </div>
        </div>

        <transition name="slide-fade">
          <div v-if="isOpen" class="flex-1">
            <h1 class="text-2xl font-black tracking-tight">
              <span class="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CrudPark
              </span>
            </h1>
            <p class="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              Sistema de Gestión
            </p>
          </div>
        </transition>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-custom">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item group relative block"
        :class="{ 'active': route.path === item.path }"
      >
        <!-- Background glow effect -->
        <div v-if="route.path === item.path" class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl blur-sm"></div>

        <div class="nav-item-content relative">
          <!-- Icon container -->
          <div class="nav-icon-wrapper">
            <div class="nav-icon-bg"></div>
            <component :is="item.icon" class="nav-icon" />
          </div>

          <transition name="slide-fade">
            <span v-if="isOpen" class="nav-text">{{ item.name }}</span>
          </transition>

          <!-- Hover effect line -->
          <div class="nav-hover-line"></div>
        </div>

        <!-- Active indicator -->
        <div v-if="route.path === item.path" class="active-indicator">
          <div class="active-indicator-glow"></div>
        </div>
      </RouterLink>
    </nav>

    <!-- User Section -->
    <div class="relative p-4 border-t border-white/10 backdrop-blur-xl">
      <div
        class="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all cursor-pointer group border border-white/5"
        :class="{ 'justify-center': !isOpen }"
      >
        <div class="relative flex-shrink-0">
          <!-- Avatar con efecto glow -->
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div class="relative w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center text-sm font-bold shadow-xl ring-2 ring-white/20">
            OP
          </div>
          <!-- Status indicator -->
          <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-lg">
            <div class="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        <transition name="slide-fade">
          <div v-if="isOpen" class="flex-1 min-w-0">
            <p class="text-sm font-bold truncate">Operador</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              <p class="text-xs text-emerald-400 font-medium">En línea</p>
            </div>
          </div>
        </transition>

        <transition name="fade">
          <ChevronRight v-if="isOpen" class="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </transition>
      </div>
    </div>

    <!-- Toggle Button -->
    <button
      @click="toggleSidebar"
      class="absolute -right-3.5 top-24 w-7 h-7 bg-gradient-to-br from-slate-800 to-slate-900 hover:from-blue-600 hover:to-cyan-600 rounded-full shadow-xl flex items-center justify-center border-2 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:scale-110 group z-50"
    >
      <ChevronLeft
        class="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
        :class="{ 'rotate-180': !isOpen }"
      />
    </button>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  CreditCard,
  DollarSign,
  Users,
  FileBarChart,
  ParkingCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'

const route = useRoute()
const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Mensualidades', path: '/mensualidades', icon: CreditCard },
  { name: 'Tarifas', path: '/tarifas', icon: DollarSign },
  { name: 'Operadores', path: '/operadores', icon: Users },
  { name: 'Reportes', path: '/reportes', icon: FileBarChart },
]
</script>

<style scoped>
/* Navigation Item Styles */
.nav-item {
  @apply transition-all duration-200 cursor-pointer;
}

.nav-item-content {
  @apply flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200;
}

.nav-item:hover .nav-item-content {
  @apply bg-white/5 backdrop-blur-sm transform translate-x-1;
}

.nav-item.active .nav-item-content {
  @apply bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm;
}

/* Icon wrapper with background */
.nav-icon-wrapper {
  @apply relative flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200;
}

.nav-icon-bg {
  @apply absolute inset-0 bg-white/5 rounded-xl transition-all duration-200;
}

.nav-item:hover .nav-icon-bg {
  @apply bg-white/10 scale-110;
}

.nav-item.active .nav-icon-bg {
  @apply bg-gradient-to-br from-blue-500/20 to-cyan-500/20 scale-110;
}

.nav-icon {
  @apply relative w-5 h-5 transition-all duration-200;
}

.nav-item:hover .nav-icon {
  @apply scale-110;
}

.nav-item.active .nav-icon {
  @apply text-blue-400 scale-110;
}

/* Navigation text */
.nav-text {
  @apply text-sm font-semibold whitespace-nowrap text-slate-200 transition-colors;
}

.nav-item:hover .nav-text {
  @apply text-white;
}

.nav-item.active .nav-text {
  @apply text-white;
}

/* Hover effect line */
.nav-hover-line {
  @apply absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-r-full transition-all duration-200;
}

.nav-item:hover .nav-hover-line {
  @apply h-8 opacity-50;
}

/* Active indicator */
.active-indicator {
  @apply absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-blue-500 via-blue-400 to-cyan-500 rounded-r-full;
}

.active-indicator-glow {
  @apply absolute inset-0 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-r-full blur-sm;
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom Scrollbar */
.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  @apply bg-slate-700/30 rounded-full;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-600/50;
}
</style>

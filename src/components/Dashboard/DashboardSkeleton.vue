<template>
  <div class="space-y-8">
    <!-- Metrics Skeletons -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      <div
        v-for="i in 5"
        :key="i"
        class="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div class="animate-pulse space-y-4">
          <!-- Icon skeleton -->
          <div class="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>

          <!-- Text skeletons -->
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 animate-shimmer"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Charts Skeletons -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="i in 2"
        :key="i"
        class="bg-white rounded-2xl shadow-lg p-6"
      >
        <div class="animate-pulse space-y-4">
          <!-- Chart header skeleton -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
            <div class="flex-1 space-y-2">
              <div class="h-5 bg-gray-200 rounded w-1/3"></div>
              <div class="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>

          <!-- Chart body skeleton -->
          <div class="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-end justify-around p-4 gap-2">
            <div
              v-for="bar in 7"
              :key="bar"
              class="bg-gray-300 rounded-t w-full animate-pulse"
              :style="{ height: `${Math.random() * 60 + 40}%` }"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer skeleton -->
    <section class="bg-white rounded-2xl shadow-lg p-6">
      <div class="animate-pulse flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-200 rounded w-24"></div>
            <div class="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-200 rounded w-32"></div>
            <div class="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

<script setup lang="ts">
import { useOptionsStore } from "src/stores/options.store"
import { storeToRefs } from "pinia"
import { RouterLink } from "vue-router"

const optionsStore = useOptionsStore()
const { isDark } = storeToRefs(optionsStore)
</script>

<template>
  <div class="max-w-xl w-full mx-auto p-8">
    <h1 class="text-xl font-bold mb-4">Настройки</h1>

    <div class="space-y-6">
      <div>
        <h3 class="font-semibold mb-2">Интерфейс</h3>
        <label class="flex items-center gap-2">
          <input
            v-model="isDark"
            type="checkbox"
            class="rounded"
          />
          Тёмная тема
        </label>
      </div>
    </div>
    <RouterLink to="/side-panel">
      <button
        class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Главная
      </button>
    </RouterLink>
  </div>
</template>
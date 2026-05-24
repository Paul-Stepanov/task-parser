<script setup lang="ts">
import { RouterLink } from "vue-router"
import { useTheme } from "@/composables/useTheme"

const { isDark, toggleDark } = useTheme()
</script>

<template>
  <header class="border-b bg-white dark:bg-gray-900">
    <div class="flex items-center justify-between px-4 py-3">
      <RouterLink to="/side-panel">
        <div class="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Logo"
            class="w-6 h-6"
          />
          <h1 class="font-semibold text-sm">Task Parser</h1>
        </div>
      </RouterLink>
      <div class="flex items-center gap-1">
        <button
          class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Переключить тему"
          @click="toggleDark"
        >
          <span
            v-if="isDark"
            class="text-sm"
          >
            🌙
          </span>
          <span
            v-else
            class="text-sm"
          >
            ☀️
          </span>
        </button>
        <!-- Иконка настроек на side-panel -->
        <RouterLink
          to="/options-page"
          class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Настройки"
        >
          <span class="text-sm">⚙️</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

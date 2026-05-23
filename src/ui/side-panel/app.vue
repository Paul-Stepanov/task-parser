<script setup lang="ts">
import { onMounted } from "vue"
import { useTheme } from "@/composables/useTheme"

const { applyTheme, mode } = useTheme()

onMounted(() => {
  applyTheme(mode.value)
})
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <RouterView />
  </div>
</template>
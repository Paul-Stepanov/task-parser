<script setup lang="ts">
import { RouterLink } from "vue-router"
</script>

<template>
  <div class="p-4">
    <h1 class="text-lg font-semibold">Task Parser</h1>
    <p class="mt-2 text-sm text-muted-foreground">
      Откройте задачу на портале Битрикс24 и нажмите «Парсить».
    </p>
    <RouterLink to="/options-page">
      <button
        class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Настройки
      </button>
    </RouterLink>
  </div>
</template>
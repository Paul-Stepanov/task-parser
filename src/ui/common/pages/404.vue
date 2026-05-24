<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()
</script>

<template>
  <div class="p-4 text-center">
    <h1 class="text-2xl font-bold">404</h1>
    <p class="mt-2">Страница не найдена</p>
    <button
      class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      @click="router.push('/')"
    >
      На главную
    </button>
  </div>
</template>

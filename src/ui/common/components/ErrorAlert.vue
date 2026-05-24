<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div
    class="p-3 bg-red-50 text-red-800 rounded text-sm dark:bg-red-900/30 dark:text-red-300"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { version } from "../../../../package.json"
</script>

<template>
  <footer class="border-t bg-white dark:bg-gray-900 mt-auto">
    <div class="px-4 py-2 text-center text-xs text-gray-500 dark:text-gray-400">
      Task Parser v{{ version }}
    </div>
  </footer>
</template>

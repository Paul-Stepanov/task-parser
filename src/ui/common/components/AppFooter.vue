<script setup lang="ts">
const version = __VERSION__
</script>

<template>
  <footer
    class="border-t mt-auto"
    style="background-color: var(--background)"
  >
    <div
      class="px-4 py-2 text-center text-xs"
      style="color: var(--muted-foreground)"
    >
      Task Parser v{{ version }}
    </div>
  </footer>
</template>

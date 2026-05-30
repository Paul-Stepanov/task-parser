<script setup lang="ts">
const version = __VERSION__
</script>

<template>
  <footer
    class="border-t mt-auto"
    style="border-color: var(--border); background-color: var(--background)"
  >
    <div
      class="px-4 py-2 text-center text-xs tracking-wide"
      style="color: var(--muted-foreground)"
    >
      v{{ version }}
    </div>
  </footer>
</template>
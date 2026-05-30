<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div
    class="p-3 rounded-lg text-sm flex items-start gap-2"
    style="
      background-color: color-mix(in srgb, var(--destructive) 8%, transparent);
      color: var(--destructive);
      border: 1px solid color-mix(in srgb, var(--destructive) 20%, transparent);
    "
  >
    <svg
      class="w-4 h-4 shrink-0 mt-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
      />
      <line
        x1="15"
        y1="9"
        x2="9"
        y2="15"
      />
      <line
        x1="9"
        y1="9"
        x2="15"
        y2="15"
      />
    </svg>
    <span>{{ message }}</span>
  </div>
</template>
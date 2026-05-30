<script setup lang="ts">
import { useToast } from "@/composables/useToast"

const { toasts } = useToast()
</script>

<template>
  <div
    class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
  >
    <TransitionGroup
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="transform translate-x-4 opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-4 opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md text-sm font-medium pointer-events-auto min-w-[200px] max-w-[320px]"
        :class="{
          'bg-[var(--success)] text-white': toast.type === 'success',
          'bg-[var(--destructive)] text-white': toast.type === 'error',
          'bg-[var(--accent)] text-white': toast.type === 'info',
        }"
      >
        <!-- Success icon -->
        <svg
          v-if="toast.type === 'success'"
          class="w-4 h-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <!-- Error icon -->
        <svg
          v-else-if="toast.type === 'error'"
          class="w-4 h-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
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
        <!-- Info icon -->
        <svg
          v-else
          class="w-4 h-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />
          <line
            x1="12"
            y1="16"
            x2="12"
            y2="12"
          />
          <line
            x1="12"
            y1="8"
            x2="12.01"
            y2="8"
          />
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>
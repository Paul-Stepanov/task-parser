<script setup lang="ts">
import { RouterLink } from "vue-router"
import { useTheme } from "@/composables/useTheme"

const { isDark, toggleDark } = useTheme()
</script>

<template>
  <header
    class="border-b backdrop-blur-sm sticky top-0 z-10"
    style="
      background-color: color-mix(in srgb, var(--background) 85%, transparent);
      border-color: var(--border);
    "
  >
    <div class="flex items-center justify-between px-4 py-2.5">
      <RouterLink
        to="/side-panel"
        class="flex items-center gap-2 group"
      >
        <div
          class="w-7 h-7 rounded-lg flex items-center justify-center"
          style="background-color: var(--primary)"
        >
          <svg
            class="w-4 h-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 11 12 14 22 4" />
            <path
              d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
            />
          </svg>
        </div>
        <span
          class="font-semibold text-sm tracking-tight"
          style="color: var(--foreground)"
        >
          Task Parser
        </span>
      </RouterLink>

      <div class="flex items-center gap-0.5">
        <button
          class="p-2 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95"
          style="color: var(--muted-foreground)"
          title="Переключить тему"
          @click="toggleDark"
        >
          <!-- Moon icon (shown in light mode to switch to dark) -->
          <svg
            v-if="!isDark"
            class="w-[18px] h-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <!-- Sun icon (shown in dark mode to switch to light) -->
          <svg
            v-else
            class="w-[18px] h-[18px]"
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
              r="5"
            />
            <line
              x1="12"
              y1="1"
              x2="12"
              y2="3"
            />
            <line
              x1="12"
              y1="21"
              x2="12"
              y2="23"
            />
            <line
              x1="4.22"
              y1="4.22"
              x2="5.64"
              y2="5.64"
            />
            <line
              x1="18.36"
              y1="18.36"
              x2="19.78"
              y2="19.78"
            />
            <line
              x1="1"
              y1="12"
              x2="3"
              y2="12"
            />
            <line
              x1="21"
              y1="12"
              x2="23"
              y2="12"
            />
            <line
              x1="4.22"
              y1="19.78"
              x2="5.64"
              y2="18.36"
            />
            <line
              x1="18.36"
              y1="5.64"
              x2="19.78"
              y2="4.22"
            />
          </svg>
        </button>

        <RouterLink
          to="/options-page"
          class="p-2 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95"
          style="color: var(--muted-foreground)"
          title="Настройки"
        >
          <svg
            class="w-[18px] h-[18px]"
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
              r="3"
            />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
            />
          </svg>
        </RouterLink>
      </div>
    </div>
  </header>
</template>
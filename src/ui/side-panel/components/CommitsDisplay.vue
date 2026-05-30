<script setup lang="ts">
import { useGitLabStore } from "@/stores/gitlab.store"
import { computed } from "vue"

const gitlabStore = useGitLabStore()
const commitsData = computed(() => gitlabStore.commitsData)
</script>

<template>
  <div
    v-if="commitsData"
    class="flex flex-col gap-2 animate-fade-in"
  >
    <!-- Branch badge -->
    <div
      class="px-3 py-2 rounded-lg flex items-center gap-2"
      style="background-color: color-mix(in srgb, var(--warning) 10%, transparent)"
    >
      <svg
        class="w-3.5 h-3.5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="color: var(--warning)"
      >
        <line
          x1="6"
          y1="3"
          x2="6"
          y2="15"
        />
        <circle
          cx="18"
          cy="6"
          r="3"
        />
        <circle
          cx="6"
          cy="18"
          r="3"
        />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
      <span
        class="text-sm font-mono font-medium"
        style="color: var(--foreground)"
      >
        {{ commitsData.branch }}
      </span>
      <span
        class="text-xs ml-auto"
        style="color: var(--muted-foreground)"
      >
        {{ commitsData.totalCount }} коммитов
      </span>
    </div>

    <!-- Commits list -->
    <div
      class="max-h-52 overflow-y-auto flex flex-col gap-1"
      style="scrollbar-gutter: stable"
    >
      <div
        v-for="commit in commitsData.commits"
        :key="commit.id"
        class="px-3 py-2 rounded-lg border transition-colors duration-150"
        style="border-color: var(--border)"
      >
        <p
          class="text-xs font-medium leading-snug"
          style="color: var(--foreground)"
        >
          {{ commit.title }}
        </p>
        <p
          class="text-xs mt-1 font-mono flex items-center gap-1.5"
          style="color: var(--muted-foreground)"
        >
          <span>{{ commit.author_name }}</span>
          <span style="color: var(--border)">·</span>
          <span>{{
            new Date(commit.created_at).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "short",
            })
          }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
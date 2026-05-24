<script setup lang="ts">
import { useGitLabStore } from "@/stores/gitlab.store"
import { computed } from "vue"

const gitlabStore = useGitLabStore()
const commitsData = computed(() => gitlabStore.commitsData)
</script>

<template>
  <div
    v-if="commitsData"
    class="space-y-2"
  >
    <div class="p-2 bg-orange-50 dark:bg-orange-900/30 rounded text-sm">
      <span class="font-medium">Ветка:</span> {{ commitsData.branch }}
      <span class="text-gray-500 ml-2">
        ({{ commitsData.totalCount }} коммитов)
      </span>
    </div>

    <div class="max-h-48 overflow-y-auto space-y-1">
      <div
        v-for="commit in commitsData.commits"
        :key="commit.id"
        class="p-2 border rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <p class="font-medium">{{ commit.title }}</p>
        <p class="text-gray-500">
          {{ commit.author_name }} &bull;
          {{ new Date(commit.created_at).toLocaleDateString("ru-RU") }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTaskStore } from "@/stores/task.store"
import { computed } from "vue"

const taskStore = useTaskStore()
const task = computed(() => taskStore.currentTask)
</script>

<template>
  <div
    v-if="task"
    class="space-y-3"
  >
    <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">
      <h3 class="font-semibold text-sm">{{ task.taskTitle }}</h3>
      <p class="text-xs text-gray-500 mt-1">
        ID: {{ task.taskId || "N/A" }}
      </p>
    </div>

    <details
      v-for="(tab, name) in task.tabs"
      :key="name"
      class="border rounded"
    >
      <summary class="p-2 cursor-pointer text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
        {{ name }}
      </summary>
      <div class="p-2 text-xs whitespace-pre-wrap border-t">
        {{ tab.content }}
      </div>
    </details>
  </div>
</template>
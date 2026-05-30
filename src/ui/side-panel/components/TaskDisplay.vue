<script setup lang="ts">
import { useTaskStore } from "@/stores/task.store"
import { computed } from "vue"

const taskStore = useTaskStore()
const task = computed(() => taskStore.currentTask)
</script>

<template>
  <div
    v-if="task"
    class="flex flex-col gap-2 animate-fade-in"
  >
    <!-- Task title card -->
    <div
      class="p-3 rounded-lg border"
      style="
        background-color: var(--card);
        border-color: var(--border);
        box-shadow: var(--shadow-sm);
      "
    >
      <h3 class="font-semibold text-sm leading-snug">
        {{ task.taskTitle }}
      </h3>
      <p
        class="text-xs mt-1 font-mono"
        style="color: var(--muted-foreground)"
      >
        #{{ task.taskId || "N/A" }}
      </p>
    </div>

    <!-- Tabs as collapsible sections -->
    <div class="flex flex-col gap-1.5">
      <details
        v-for="(tab, name) in task.tabs"
        :key="name"
        class="rounded-lg border overflow-hidden group"
        style="
          background-color: var(--card);
          border-color: var(--border);
        "
      >
        <summary
          class="px-3 py-2.5 cursor-pointer text-sm font-medium flex items-center transition-colors duration-150"
          style="color: var(--foreground)"
        >
          {{ name }}
        </summary>
        <div
          class="px-3 pb-3 text-xs whitespace-pre-wrap leading-relaxed border-t"
          style="
            border-color: var(--border);
            color: var(--muted-foreground);
          "
        >
          {{ tab.content }}
        </div>
      </details>
    </div>
  </div>
</template>
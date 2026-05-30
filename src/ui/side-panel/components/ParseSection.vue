<script setup lang="ts">
import BaseButton from "@/ui/common/components/BaseButton.vue"
import { useTaskStore } from "@/stores/task.store"
import TaskDisplay from "./TaskDisplay.vue"

const taskStore = useTaskStore()

async function handleParse() {
  await taskStore.parseTaskFromCurrentTab()
}
</script>

<template>
  <section class="flex flex-col gap-3">
    <BaseButton
      :loading="taskStore.isParsing"
      class="w-full"
      @click="handleParse"
    >
      <template v-if="!taskStore.isParsing">
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 11 12 14 22 4" />
          <path
            d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
          />
        </svg>
        Парсить задачу
      </template>
      <template v-else>
        Парсинг...
      </template>
    </BaseButton>

    <Transition name="section">
      <TaskDisplay v-if="taskStore.hasTask" />
    </Transition>

    <p
      v-if="taskStore.parseError"
      class="text-sm flex items-center gap-1.5"
      style="color: var(--destructive)"
    >
      <svg
        class="w-4 h-4 shrink-0"
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
      {{ taskStore.parseError }}
    </p>
  </section>
</template>
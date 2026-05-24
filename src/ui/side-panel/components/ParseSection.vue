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
  <section class="space-y-3">
    <BaseButton
      :disabled="taskStore.isParsing"
      class="w-full"
      @click="handleParse"
    >
      {{ taskStore.isParsing ? "Парсинг..." : "Парсить задачу" }}
    </BaseButton>

    <TaskDisplay v-if="taskStore.hasTask" />

    <p
      v-if="taskStore.parseError"
      class="text-sm text-red-500"
    >
      {{ taskStore.parseError }}
    </p>
  </section>
</template>
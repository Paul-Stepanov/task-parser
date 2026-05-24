<script setup lang="ts">
import BaseButton from "@/ui/common/components/BaseButton.vue"
import { useTaskStore } from "@/stores/task.store"
import { usePromptsStore } from "@/stores/prompts.store"
import { useGitLabStore } from "@/stores/gitlab.store"
import PromptPreview from "./PromptPreview.vue"

const taskStore = useTaskStore()
const promptsStore = usePromptsStore()
const gitlabStore = useGitLabStore()

function handleGenerateReport() {
  if (!taskStore.currentTask) return
  promptsStore.generateReportPrompt(
    taskStore.currentTask,
    gitlabStore.commitsData,
  )
}

function handleGenerateEstimate() {
  if (!taskStore.currentTask) return
  promptsStore.generateEstimatePrompt(taskStore.currentTask)
}
</script>

<template>
  <section class="space-y-2">
    <BaseButton
      class="w-full"
      variant="success"
      @click="handleGenerateReport"
    >
      Промпт для отчета{{ gitlabStore.hasCommits ? " (с коммитами)" : "" }}
    </BaseButton>

    <BaseButton
      class="w-full"
      variant="secondary"
      @click="handleGenerateEstimate"
    >
      Промпт для оценки
    </BaseButton>

    <PromptPreview v-if="promptsStore.currentPrompt" />

    <p
      v-if="promptsStore.error"
      class="text-xs text-red-500"
    >
      {{ promptsStore.error }}
    </p>
  </section>
</template>
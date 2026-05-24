<script setup lang="ts">
import { ref } from "vue"
import BaseButton from "@/ui/common/components/BaseButton.vue"
import { useTaskStore } from "@/stores/task.store"
import { usePromptsStore } from "@/stores/prompts.store"
import { useGitLabStore } from "@/stores/gitlab.store"
import PromptPreview from "./PromptPreview.vue"

const taskStore = useTaskStore()
const promptsStore = usePromptsStore()
const gitlabStore = useGitLabStore()

const showAdditionalContext = ref(false)

function toggleAdditionalContext() {
  showAdditionalContext.value = !showAdditionalContext.value
  if (!showAdditionalContext.value) {
    promptsStore.additionalContext = ""
  }
}

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
      variant="outline"
      @click="toggleAdditionalContext"
    >
      {{
        showAdditionalContext
          ? "Убрать доп. информацию"
          : "Добавить доп. информацию"
      }}
    </BaseButton>

    <textarea
      v-if="showAdditionalContext"
      v-model="promptsStore.additionalContext"
      class="w-full rounded border border-gray-300 bg-white p-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
      rows="3"
      placeholder="Введите дополнительную информацию для промпта..."
    />

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

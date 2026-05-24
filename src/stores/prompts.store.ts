import { defineStore } from "pinia"
import { ref } from "vue"
import type { GeneratedPrompt } from "@/types/prompts"
import type { Bitrix24TaskData } from "@/types/bitrix24"
import type { GitLabCommitsData } from "@/types/gitlab"
import {
  createReportSystemPrompt,
  createReportUserPrompt,
  createEstimateSystemPrompt,
  createEstimateUserPrompt,
} from "@/utils/prompts"

export const usePromptsStore = defineStore("prompts", () => {
  const currentPrompt = ref<GeneratedPrompt | null>(null)
  const error = ref<string | null>(null)
  const additionalContext = ref("")

  function generateReportPrompt(
    taskData: Bitrix24TaskData,
    commitsData?: GitLabCommitsData | null,
  ) {
    error.value = null

    try {
      currentPrompt.value = {
        type: "report",
        systemPrompt: createReportSystemPrompt(),
        userPrompt: createReportUserPrompt(
          taskData,
          commitsData,
          additionalContext.value,
        ),
        timestamp: new Date().toISOString(),
        taskId: taskData.taskId || "",
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Ошибка генерации промпта"
    }
  }

  function generateEstimatePrompt(taskData: Bitrix24TaskData) {
    error.value = null

    try {
      currentPrompt.value = {
        type: "estimate",
        systemPrompt: createEstimateSystemPrompt(),
        userPrompt: createEstimateUserPrompt(taskData, additionalContext.value),
        timestamp: new Date().toISOString(),
        taskId: taskData.taskId || "",
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Ошибка генерации промпта"
    }
  }

  function clearPrompt() {
    currentPrompt.value = null
    error.value = null
  }

  return {
    currentPrompt,
    error,
    additionalContext,
    generateReportPrompt,
    generateEstimatePrompt,
    clearPrompt,
  }
})

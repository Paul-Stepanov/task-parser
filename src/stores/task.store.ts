import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Bitrix24TaskData } from "@/types/bitrix24"

export const useTaskStore = defineStore("task", () => {
  const currentTask = ref<Bitrix24TaskData | null>(null)
  const isParsing = ref(false)
  const parseError = ref<string | null>(null)

  const hasTask = computed(() => currentTask.value !== null)
  const taskId = computed(() => currentTask.value?.taskId ?? null)

  async function parseTaskFromCurrentTab() {
    isParsing.value = true
    parseError.value = null

    try {
      const response: {
        success: boolean
        data?: Bitrix24TaskData
        error?: string
      } = await chrome.runtime.sendMessage({ action: "parseTask" })

      if (response?.success && response.data) {
        currentTask.value = response.data
      } else {
        parseError.value = response?.error || "Ошибка парсинга задачи"
      }
    } catch (error) {
      parseError.value =
        error instanceof Error ? error.message : "Неизвестная ошибка"
    } finally {
      isParsing.value = false
    }
  }

  function clearTask() {
    currentTask.value = null
    parseError.value = null
  }

  return {
    currentTask,
    isParsing,
    parseError,
    hasTask,
    taskId,
    parseTaskFromCurrentTab,
    clearTask,
  }
})
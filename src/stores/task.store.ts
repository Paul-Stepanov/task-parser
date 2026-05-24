import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Bitrix24TaskData } from "@/types/bitrix24"
import { useToast } from "@/composables/useToast"

export const useTaskStore = defineStore("task", () => {
  const { success, error } = useToast()

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
        success("Задача успешно спарсена")
      } else {
        parseError.value = response?.error || "Ошибка парсинга задачи"
        error(parseError.value)
      }
    } catch (err) {
      parseError.value =
        err instanceof Error ? err.message : "Неизвестная ошибка"
      error(parseError.value)
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

<script setup lang="ts">
import { useTaskStore } from "@/stores/task.store"
import { usePromptsStore } from "@/stores/prompts.store"
import { useGitLabStore } from "@/stores/gitlab.store"
import { ref } from "vue"
import { RouterLink } from "vue-router"
import TaskDisplay from "../components/TaskDisplay.vue"
import CommitsDisplay from "../components/CommitsDisplay.vue"
import PromptPreview from "../components/PromptPreview.vue"

const taskStore = useTaskStore()
const promptsStore = usePromptsStore()
const gitlabStore = useGitLabStore()

const branchInput = ref("")

async function handleParse() {
  await taskStore.parseTaskFromCurrentTab()
}

async function handleFetchCommits() {
  if (!branchInput.value.trim()) return
  await gitlabStore.fetchCommits(branchInput.value.trim())
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

function handleClearAll() {
  taskStore.clearTask()
  promptsStore.clearPrompt()
  gitlabStore.clearCommits()
  branchInput.value = ""
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold">Task Parser</h1>
      <div class="flex items-center gap-3">
        <RouterLink
          to="/options-page"
          class="text-xs text-blue-600 hover:text-blue-700"
        >
          Настройки
        </RouterLink>
        <button
          v-if="taskStore.hasTask || gitlabStore.hasCommits"
          class="text-xs text-red-600 hover:text-red-700"
          @click="handleClearAll"
        >
          Очистить
        </button>
      </div>
    </div>

    <!-- Парсинг задачи -->
    <button
      :disabled="taskStore.isParsing"
      class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
      @click="handleParse"
    >
      {{ taskStore.isParsing ? "Парсинг..." : "Парсить задачу" }}
    </button>

    <!-- Данные задачи -->
    <TaskDisplay v-if="taskStore.hasTask" />

    <!-- GitLab секция -->
    <div
      v-if="taskStore.hasTask && gitlabStore.isConfigured"
      class="space-y-2 p-3 border rounded"
    >
      <h3 class="text-sm font-medium">GitLab коммиты</h3>

      <div class="flex gap-2">
        <input
          v-model="branchInput"
          type="text"
          placeholder="Название ветки"
          class="flex-1 px-3 py-1.5 border rounded text-sm"
          @keyup.enter="handleFetchCommits"
        />
        <button
          :disabled="gitlabStore.isLoadingCommits || !branchInput.trim()"
          class="px-3 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 text-sm"
          @click="handleFetchCommits"
        >
          {{ gitlabStore.isLoadingCommits ? "..." : "Загрузить" }}
        </button>
      </div>

      <p
        v-if="gitlabStore.commitsError"
        class="text-xs text-red-500"
      >
        {{ gitlabStore.commitsError }}
      </p>

      <CommitsDisplay v-if="gitlabStore.hasCommits" />
    </div>

    <!-- Генерация промптов -->
    <div
      v-if="taskStore.hasTask"
      class="space-y-2"
    >
      <button
        :disabled="promptsStore.isGenerating"
        class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
        @click="handleGenerateReport"
      >
        Промпт для отчета{{ gitlabStore.hasCommits ? " (с коммитами)" : "" }}
      </button>

      <button
        :disabled="promptsStore.isGenerating"
        class="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
        @click="handleGenerateEstimate"
      >
        Промпт для оценки
      </button>
    </div>

    <!-- Результат -->
    <PromptPreview v-if="promptsStore.currentPrompt" />

    <!-- Ошибки -->
    <p
      v-if="taskStore.parseError"
      class="text-xs text-red-500"
    >
      {{ taskStore.parseError }}
    </p>
    <p
      v-if="promptsStore.error"
      class="text-xs text-red-500"
    >
      {{ promptsStore.error }}
    </p>
  </div>
</template>
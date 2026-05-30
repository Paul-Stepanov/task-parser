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
  <section class="flex flex-col gap-2">
    <!-- Additional context toggle -->
    <button
      class="w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors duration-150 flex items-center gap-2"
      style="
        border-color: var(--border);
        color: var(--muted-foreground);
        background-color: var(--card);
      "
      @click="toggleAdditionalContext"
    >
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-90': showAdditionalContext }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line
          x1="12"
          y1="5"
          x2="12"
          y2="19"
        />
        <line
          x1="5"
          y1="12"
          x2="19"
          y2="12"
        />
      </svg>
      {{
        showAdditionalContext
          ? "Убрать доп. информацию"
          : "Добавить доп. информацию"
      }}
    </button>

    <!-- Additional context textarea -->
    <Transition name="section">
      <textarea
        v-if="showAdditionalContext"
        v-model="promptsStore.additionalContext"
        class="w-full rounded-lg border px-3 py-2 text-sm resize-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--background)] focus:ring-[var(--ring)]"
        style="
          background-color: var(--card);
          border-color: var(--input);
          color: var(--foreground);
        "
        rows="3"
        placeholder="Введите дополнительную информацию для промпта..."
      />
    </Transition>

    <!-- Action buttons -->
    <div class="flex flex-col gap-1.5">
      <BaseButton
        class="w-full"
        variant="success"
        @click="handleGenerateReport"
      >
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          />
          <polyline points="14 2 14 8 20 8" />
          <line
            x1="16"
            y1="13"
            x2="8"
            y2="13"
          />
          <line
            x1="16"
            y1="17"
            x2="8"
            y2="17"
          />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        Промпт для отчета{{ gitlabStore.hasCommits ? " (с коммитами)" : "" }}
      </BaseButton>

      <BaseButton
        class="w-full"
        variant="secondary"
        @click="handleGenerateEstimate"
      >
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line
            x1="12"
            y1="20"
            x2="12"
            y2="10"
          />
          <line
            x1="18"
            y1="20"
            x2="18"
            y2="4"
          />
          <line
            x1="6"
            y1="20"
            x2="6"
            y2="16"
          />
        </svg>
        Промпт для оценки
      </BaseButton>
    </div>

    <Transition name="section">
      <PromptPreview
        v-if="promptsStore.currentPrompt"
        :key="promptsStore.currentPrompt.type"
      />
    </Transition>

    <p
      v-if="promptsStore.error"
      class="text-xs flex items-center gap-1"
      style="color: var(--destructive)"
    >
      <svg
        class="w-3 h-3 shrink-0"
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
      {{ promptsStore.error }}
    </p>
  </section>
</template>
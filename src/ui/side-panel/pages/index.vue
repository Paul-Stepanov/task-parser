<script setup lang="ts">
import BaseButton from "@/ui/common/components/BaseButton.vue"
import GitLabSection from "@/ui/side-panel/components/GitLabSection.vue"
import ParseSection from "@/ui/side-panel/components/ParseSection.vue"
import PromptsSection from "@/ui/side-panel/components/PromptsSection.vue"
import { useTaskStore } from "@/stores/task.store"
import { usePromptsStore } from "@/stores/prompts.store"
import { useGitLabStore } from "@/stores/gitlab.store"

const taskStore = useTaskStore()
const promptsStore = usePromptsStore()
const gitlabStore = useGitLabStore()

function handleClearAll() {
  taskStore.clearTask()
  promptsStore.clearPrompt()
  gitlabStore.clearCommits()
}
</script>

<template>
  <div class="flex flex-col gap-3 p-4">
    <!-- Title bar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="w-1.5 h-5 rounded-full"
          style="background-color: var(--primary)"
        />
        <h1
          class="text-base font-semibold tracking-tight"
          style="color: var(--foreground)"
        >
          Задача
        </h1>
      </div>
      <button
        v-if="taskStore.hasTask || gitlabStore.hasCommits"
        class="text-xs px-2.5 py-1 rounded-md transition-colors duration-150 flex items-center gap-1"
        style="
          color: var(--muted-foreground);
          background-color: var(--muted);
        "
        @click="handleClearAll"
      >
        <svg
          class="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          />
        </svg>
        Очистить
      </button>
    </div>

    <!-- Sections with transitions -->
    <TransitionGroup
      name="section"
      tag="div"
      class="flex flex-col gap-3"
    >
      <ParseSection key="parse" />
      <GitLabSection
        v-if="taskStore.hasTask"
        key="gitlab"
      />
      <PromptsSection
        v-if="taskStore.hasTask"
        key="prompts"
      />
    </TransitionGroup>
  </div>
</template>
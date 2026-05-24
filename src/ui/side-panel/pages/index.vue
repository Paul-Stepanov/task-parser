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
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold">Task Parser</h1>
      <BaseButton
        v-if="taskStore.hasTask || gitlabStore.hasCommits"
        variant="destructive"
        class="text-xs"
        @click="handleClearAll"
      >
        Очистить
      </BaseButton>
    </div>

    <!-- Секции -->
    <ParseSection />
    <GitLabSection v-if="taskStore.hasTask" />
    <PromptsSection v-if="taskStore.hasTask" />
  </div>
</template>

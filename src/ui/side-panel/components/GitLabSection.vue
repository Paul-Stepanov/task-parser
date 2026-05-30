<script setup lang="ts">
import BaseButton from "@/ui/common/components/BaseButton.vue"
import BaseInput from "@/ui/common/components/BaseInput.vue"
import { ref } from "vue"
import { useGitLabStore } from "@/stores/gitlab.store"
import CommitsDisplay from "./CommitsDisplay.vue"

const gitlabStore = useGitLabStore()
const branchInput = ref("")

async function handleFetchCommits() {
  if (!branchInput.value.trim()) return
  await gitlabStore.fetchCommits(branchInput.value.trim())
}
</script>

<template>
  <section
    v-if="gitlabStore.isConfigured"
    class="flex flex-col gap-3 p-3 rounded-lg border animate-fade-in"
    style="
      background-color: var(--card);
      border-color: var(--border);
      box-shadow: var(--shadow-sm);
    "
  >
    <!-- Section header -->
    <div class="flex items-center gap-2">
      <div
        class="w-5 h-5 rounded flex items-center justify-center"
        style="background-color: var(--warning)"
      >
        <svg
          class="w-3 h-3 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"
          />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-medium leading-tight">GitLab коммиты</h3>
        <p
          v-if="gitlabStore.settings.projectName"
          class="text-xs truncate font-mono"
          style="color: var(--muted-foreground)"
        >
          {{ gitlabStore.settings.projectName }}
        </p>
      </div>
    </div>

    <!-- Branch input -->
    <div class="flex gap-2">
      <BaseInput
        v-model="branchInput"
        placeholder="Название ветки"
        class="flex-1"
        @keyup.enter="handleFetchCommits"
      />
      <BaseButton
        :loading="gitlabStore.isLoadingCommits"
        :disabled="!branchInput.trim()"
        variant="secondary"
        @click="handleFetchCommits"
      >
        Загрузить
      </BaseButton>
    </div>

    <p
      v-if="gitlabStore.commitsError"
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
      {{ gitlabStore.commitsError }}
    </p>

    <Transition name="section">
      <CommitsDisplay v-if="gitlabStore.hasCommits" />
    </Transition>
  </section>
</template>
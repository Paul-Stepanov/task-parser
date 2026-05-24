<script setup lang="ts">
import BaseButton from "@/ui/common/components/BaseButton.vue"
import BaseInput from "@/ui/common/components/BaseInput.vue"
import { ref, watch } from "vue"
import { useGitLabStore } from "@/stores/gitlab.store"
import CommitsDisplay from "./CommitsDisplay.vue"

const gitlabStore = useGitLabStore()
const branchInput = ref(gitlabStore.settings.defaultBranch || "")

watch(
  () => gitlabStore.settings.defaultBranch,
  (newBranch) => {
    if (newBranch && !branchInput.value) {
      branchInput.value = newBranch
    }
  },
)

async function handleFetchCommits() {
  if (!branchInput.value.trim()) return
  await gitlabStore.fetchCommits(branchInput.value.trim())
}
</script>

<template>
  <section
    v-if="gitlabStore.isConfigured"
    class="space-y-3 p-3 border rounded"
  >
    <h3 class="text-sm font-medium">
      GitLab коммиты
      <span
        v-if="gitlabStore.settings.projectName"
        class="text-gray-500 font-normal"
      >
        — {{ gitlabStore.settings.projectName }}
      </span>
    </h3>

    <div class="flex gap-2">
      <BaseInput
        v-model="branchInput"
        placeholder="Название ветки"
        class="flex-1"
        @keyup.enter="handleFetchCommits"
      />
      <BaseButton
        :disabled="gitlabStore.isLoadingCommits || !branchInput.trim()"
        variant="secondary"
        @click="handleFetchCommits"
      >
        {{ gitlabStore.isLoadingCommits ? "..." : "Загрузить" }}
      </BaseButton>
    </div>

    <p
      v-if="gitlabStore.commitsError"
      class="text-xs text-red-500"
    >
      {{ gitlabStore.commitsError }}
    </p>

    <CommitsDisplay v-if="gitlabStore.hasCommits" />
  </section>
</template>
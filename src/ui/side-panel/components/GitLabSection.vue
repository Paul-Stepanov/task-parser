<script setup lang="ts">
import BaseButton from "@/ui/common/components/BaseButton.vue"
import BaseInput from "@/ui/common/components/BaseInput.vue"
import BaseSelect from "@/ui/common/components/BaseSelect.vue"
import { computed, onMounted, ref } from "vue"
import { useGitLabStore } from "@/stores/gitlab.store"
import CommitsDisplay from "./CommitsDisplay.vue"

const gitlabStore = useGitLabStore()
const branchInput = ref("feature/")

const hasCredentials = computed(
  () =>
    gitlabStore.settings.enabled &&
    gitlabStore.settings.token &&
    gitlabStore.settings.gitlabUrl,
)

const groupOptions = computed(() =>
  gitlabStore.groups.map((g) => ({
    value: g.id,
    label: g.full_name || g.name,
  })),
)

const projectOptions = computed(() =>
  gitlabStore.projects.map((p) => ({
    value: p.id,
    label: p.name,
  })),
)

onMounted(async () => {
  if (hasCredentials.value && gitlabStore.groups.length === 0) {
    await gitlabStore.loadGroups()
  }
})

async function handleGroupChange(value: string | number | undefined) {
  if (!value) {
    gitlabStore.clearGroupSelection()
    return
  }
  const groupId = typeof value === "number" ? value : Number(value)
  gitlabStore.selectGroup(groupId)
  await gitlabStore.loadProjects()
}

function handleProjectChange(value: string | number | undefined) {
  if (!value) {
    gitlabStore.clearProjectSelection()
    return
  }
  const projectId = typeof value === "number" ? value : Number(value)
  gitlabStore.selectProject(projectId)
}

async function handleFetchCommits() {
  if (!branchInput.value.trim()) return
  await gitlabStore.fetchCommits(branchInput.value.trim())
}
</script>

<template>
  <section
    v-if="hasCredentials"
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
        <h3 class="text-sm font-medium leading-tight">GitLab</h3>
      </div>
    </div>

    <!-- Group selector -->
    <div>
      <BaseSelect
        :model-value="gitlabStore.settings.groupId"
        :options="groupOptions"
        placeholder="Выберите группу..."
        :disabled="gitlabStore.isLoadingGroups"
        @update:model-value="handleGroupChange"
      />
      <p
        v-if="gitlabStore.isLoadingGroups"
        class="text-xs mt-1.5 flex items-center gap-1.5"
        style="color: var(--muted-foreground)"
      >
        <svg
          class="w-3 h-3 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        Загрузка групп...
      </p>
      <p
        v-if="gitlabStore.groupsError"
        class="text-xs mt-1.5"
        style="color: var(--destructive)"
      >
        {{ gitlabStore.groupsError }}
      </p>
    </div>

    <!-- Project selector -->
    <div v-if="gitlabStore.settings.groupId">
      <BaseSelect
        :model-value="gitlabStore.settings.projectId"
        :options="projectOptions"
        placeholder="Выберите проект..."
        :disabled="gitlabStore.isLoadingProjects"
        @update:model-value="handleProjectChange"
      />
      <p
        v-if="gitlabStore.isLoadingProjects"
        class="text-xs mt-1.5 flex items-center gap-1.5"
        style="color: var(--muted-foreground)"
      >
        <svg
          class="w-3 h-3 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        Загрузка проектов...
      </p>
      <p
        v-if="gitlabStore.projectsError"
        class="text-xs mt-1.5"
        style="color: var(--destructive)"
      >
        {{ gitlabStore.projectsError }}
      </p>
    </div>

    <!-- Branch input -->
    <div
      v-if="gitlabStore.settings.projectId"
      class="flex gap-2"
    >
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
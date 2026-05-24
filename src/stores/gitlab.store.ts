import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useBrowserSyncStorage } from "@/composables/useBrowserStorage"
import type { GitLabSettings, GitLabCommitsData } from "@/types/gitlab"
import { createGitLabAPI } from "@/utils/gitlab-api"

export const useGitLabStore = defineStore("gitlab", () => {
  const { data: settings } = useBrowserSyncStorage<GitLabSettings>(
    "gitlab-settings",
    {
      token: "",
      repositoryUrl: "",
      projectId: undefined,
      defaultBranch: "main",
      enabled: false,
    },
  )

  const commitsData = ref<GitLabCommitsData | null>(null)
  const isLoadingCommits = ref(false)
  const commitsError = ref<string | null>(null)

  const isConfigured = computed(
    () => !!(settings.value.token && settings.value.repositoryUrl),
  )
  const hasCommits = computed(
    () =>
      commitsData.value !== null && commitsData.value.commits.length > 0,
  )

  async function fetchCommits(branch: string, since?: Date) {
    if (!isConfigured.value) {
      commitsError.value = "GitLab не настроен. Проверьте настройки."
      return
    }

    isLoadingCommits.value = true
    commitsError.value = null

    try {
      const api = await createGitLabAPI({
        token: settings.value.token,
        repositoryUrl: settings.value.repositoryUrl,
        projectId: settings.value.projectId,
      })

      commitsData.value = await api.getCommitsData(branch, since)
    } catch (error) {
      commitsError.value =
        error instanceof Error
          ? error.message
          : "Ошибка загрузки коммитов"
    } finally {
      isLoadingCommits.value = false
    }
  }

  function clearCommits() {
    commitsData.value = null
    commitsError.value = null
  }

  return {
    settings,
    isConfigured,
    commitsData,
    isLoadingCommits,
    commitsError,
    hasCommits,
    fetchCommits,
    clearCommits,
  }
})
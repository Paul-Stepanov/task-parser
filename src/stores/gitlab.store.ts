import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useBrowserLocalStorage } from "@/composables/useBrowserStorage"
import type {
  GitLabSettings,
  GitLabCommitsData,
  GitLabGroup,
  GitLabProject,
} from "@/types/gitlab"
import { createGitLabAPI } from "@/utils/gitlab-api"

export const useGitLabStore = defineStore("gitlab", () => {
  const { data: settings } = useBrowserLocalStorage<GitLabSettings>(
    "gitlab-settings",
    {
      token: "",
      gitlabUrl: "",
      groupId: undefined,
      groupName: undefined,
      projectId: undefined,
      projectName: undefined,
      defaultBranch: "",
      enabled: false,
    },
  )

  const groups = ref<GitLabGroup[]>([])
  const projects = ref<GitLabProject[]>([])
  const isLoadingGroups = ref(false)
  const isLoadingProjects = ref(false)
  const groupsError = ref<string | null>(null)
  const projectsError = ref<string | null>(null)

  const commitsData = ref<GitLabCommitsData | null>(null)
  const isLoadingCommits = ref(false)
  const commitsError = ref<string | null>(null)

  const isConfigured = computed(
    () =>
      !!(settings.value.token && settings.value.gitlabUrl && settings.value.projectId),
  )
  const hasCommits = computed(
    () => commitsData.value !== null && commitsData.value.commits.length > 0,
  )

  async function loadGroups() {
    if (!settings.value.token || !settings.value.gitlabUrl) return

    isLoadingGroups.value = true
    groupsError.value = null

    try {
      const api = await createGitLabAPI({
        token: settings.value.token,
        gitlabUrl: settings.value.gitlabUrl,
      })

      groups.value = await api.getGroups()
    } catch (error) {
      groupsError.value =
        error instanceof Error ? error.message : "Ошибка загрузки групп"
    } finally {
      isLoadingGroups.value = false
    }
  }

  async function loadProjects() {
    if (!settings.value.groupId) return

    isLoadingProjects.value = true
    projectsError.value = null

    try {
      const api = await createGitLabAPI({
        token: settings.value.token,
        gitlabUrl: settings.value.gitlabUrl,
      })

      projects.value = await api.getProjectsByGroup(settings.value.groupId)
    } catch (error) {
      projectsError.value =
        error instanceof Error ? error.message : "Ошибка загрузки проектов"
    } finally {
      isLoadingProjects.value = false
    }
  }

  function selectGroup(groupId: number) {
    const group = groups.value.find((g) => g.id === groupId)
    settings.value.groupId = groupId
    settings.value.groupName = group?.name
    settings.value.projectId = undefined
    settings.value.projectName = undefined
    projects.value = []
  }

  function selectProject(projectId: number) {
    const project = projects.value.find((p) => p.id === projectId)
    settings.value.projectId = projectId
    settings.value.projectName = project?.name

    if (project?.default_branch) {
      settings.value.defaultBranch = project.default_branch
    }
  }

  function clearGroupSelection() {
    settings.value.groupId = undefined
    settings.value.groupName = undefined
    settings.value.projectId = undefined
    settings.value.projectName = undefined
    projects.value = []
  }

  function clearProjectSelection() {
    settings.value.projectId = undefined
    settings.value.projectName = undefined
  }

  async function fetchCommits(branch: string) {
    if (!isConfigured.value) {
      commitsError.value = "GitLab не настроен. Проверьте настройки."
      return
    }

    isLoadingCommits.value = true
    commitsError.value = null

    try {
      const api = await createGitLabAPI({
        token: settings.value.token,
        gitlabUrl: settings.value.gitlabUrl,
      })

      commitsData.value = await api.getCommitsData(
        settings.value.projectId!,
        branch,
      )
    } catch (error) {
      commitsError.value =
        error instanceof Error ? error.message : "Ошибка загрузки коммитов"
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
    groups,
    projects,
    isLoadingGroups,
    isLoadingProjects,
    groupsError,
    projectsError,
    isConfigured,
    commitsData,
    isLoadingCommits,
    commitsError,
    hasCommits,
    loadGroups,
    loadProjects,
    selectGroup,
    selectProject,
    clearGroupSelection,
    clearProjectSelection,
    fetchCommits,
    clearCommits,
  }
})
<script setup lang="ts">
import BaseInput from "@/ui/common/components/BaseInput.vue"
import BaseSelect from "@/ui/common/components/BaseSelect.vue"
import { useOptionsStore } from "src/stores/options.store"
import { useGitLabStore } from "@/stores/gitlab.store"
import { useGitLabValidation } from "@/composables/useGitLabValidation"
import { useToast } from "@/composables/useToast"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

const optionsStore = useOptionsStore()
const { isDark } = storeToRefs(optionsStore)

const gitlabStore = useGitLabStore()
const { success, error: showError } = useToast()

const token = computed(() => gitlabStore.settings.token)
const gitlabUrl = computed(() => gitlabStore.settings.gitlabUrl)

const { tokenError, urlError, isValid } = useGitLabValidation(token, gitlabUrl)

const testResult = ref<{ success: boolean; message: string } | null>(null)
const isTesting = ref(false)

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

const hasCredentials = computed(
  () =>
    gitlabStore.settings.token &&
    gitlabStore.settings.gitlabUrl &&
    isValid.value,
)

const isFullyConfigured = computed(
  () => gitlabStore.isConfigured && gitlabStore.settings.defaultBranch,
)

async function testConnection() {
  testResult.value = null
  isTesting.value = true
  gitlabStore.clearGroupSelection()
  gitlabStore.groups = []
  gitlabStore.projects = []

  try {
    const { createGitLabAPI } = await import("@/utils/gitlab-api")
    await createGitLabAPI({
      token: gitlabStore.settings.token,
      gitlabUrl: gitlabStore.settings.gitlabUrl,
    })

    testResult.value = {
      success: true,
      message: "Соединение успешно! Загрузка групп...",
    }
    success(testResult.value.message)

    await gitlabStore.loadGroups()

    if (gitlabStore.groups.length === 0) {
      testResult.value = {
        success: false,
        message: "Нет доступных групп для вашего токена.",
      }
      showError(testResult.value.message)
    }
  } catch (err) {
    testResult.value = {
      success: false,
      message: err instanceof Error ? err.message : "Ошибка подключения",
    }
    showError(testResult.value.message)
  } finally {
    isTesting.value = false
  }
}

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
</script>

<template>
  <div class="max-w-xl w-full mx-auto p-8">
    <h1 class="text-xl font-bold mb-6">Настройки</h1>

    <div class="space-y-6">
      <div>
        <h3 class="font-semibold mb-2">Интерфейс</h3>
        <label class="flex items-center gap-2">
          <input
            v-model="isDark"
            type="checkbox"
            class="rounded"
          />
          Тёмная тема
        </label>
      </div>

      <div>
        <h3 class="font-semibold mb-2">GitLab интеграция</h3>

        <label class="flex items-center gap-2 mb-4">
          <input
            v-model="gitlabStore.settings.enabled"
            type="checkbox"
            class="rounded"
          />
          Включить GitLab интеграцию
        </label>

        <template v-if="gitlabStore.settings.enabled">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">
                URL GitLab
              </label>
              <BaseInput
                v-model="gitlabStore.settings.gitlabUrl"
                type="url"
                placeholder="https://gitlab.company.com"
                :error="urlError"
              />
              <p
                v-if="!urlError"
                class="text-xs text-gray-500 mt-1"
              >
                Корневой адрес вашего GitLab сервера
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">
                Personal Access Token
              </label>
              <BaseInput
                v-model="gitlabStore.settings.token"
                type="password"
                placeholder="glpat-..."
                :error="tokenError"
              />
              <p
                v-if="!tokenError"
                class="text-xs text-gray-500 mt-1"
              >
                Токен с правами
                <code>read_api</code>
                и
                <code>read_repository</code>
              </p>
            </div>

            <button
              :disabled="isTesting || !hasCredentials"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
              @click="testConnection"
            >
              {{ isTesting ? "Проверка..." : "Проверить подключение" }}
            </button>

            <div
              v-if="testResult"
              :class="[
                'p-3 rounded text-sm',
                testResult.success
                  ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300',
              ]"
            >
              {{ testResult.message }}
            </div>

            <template v-if="gitlabStore.groups.length > 0">
              <div class="border-t pt-4 mt-4">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium mb-1">
                      Группа
                    </label>
                    <BaseSelect
                      :model-value="gitlabStore.settings.groupId"
                      :options="groupOptions"
                      placeholder="Выберите группу..."
                      :disabled="gitlabStore.isLoadingGroups"
                      @update:model-value="handleGroupChange"
                    />
                    <p
                      v-if="gitlabStore.isLoadingGroups"
                      class="text-xs text-gray-500 mt-1"
                    >
                      Загрузка групп...
                    </p>
                  </div>

                  <div v-if="gitlabStore.settings.groupId">
                    <label class="block text-sm font-medium mb-1">
                      Проект
                    </label>
                    <BaseSelect
                      :model-value="gitlabStore.settings.projectId"
                      :options="projectOptions"
                      placeholder="Выберите проект..."
                      :disabled="gitlabStore.isLoadingProjects"
                      @update:model-value="handleProjectChange"
                    />
                    <p
                      v-if="gitlabStore.isLoadingProjects"
                      class="text-xs text-gray-500 mt-1"
                    >
                      Загрузка проектов...
                    </p>
                    <p
                      v-if="gitlabStore.projectsError"
                      class="text-xs text-red-500 mt-1"
                    >
                      {{ gitlabStore.projectsError }}
                    </p>
                  </div>

                  <div v-if="gitlabStore.settings.projectId">
                    <label class="block text-sm font-medium mb-1">
                      Ветка по умолчанию
                    </label>
                    <BaseInput
                      v-model="gitlabStore.settings.defaultBranch"
                      type="text"
                      placeholder="main"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                      Автоматически подставляется при загрузке коммитов
                    </p>
                  </div>

                  <div
                    v-if="isFullyConfigured"
                    class="p-3 rounded text-sm bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  >
                    Настройка завершена: {{ gitlabStore.settings.groupName }} /
                    {{ gitlabStore.settings.projectName }}
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
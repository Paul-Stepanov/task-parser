<script setup lang="ts">
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
const repositoryUrl = computed(() => gitlabStore.settings.repositoryUrl)
const projectId = computed(() => gitlabStore.settings.projectId)

const { tokenError, urlError, projectIdError, isValid } =
  useGitLabValidation(token, repositoryUrl, projectId)

const testResult = ref<{ success: boolean; message: string } | null>(null)
const isTesting = ref(false)

async function testConnection() {
  testResult.value = null
  isTesting.value = true

  const { token, repositoryUrl } = gitlabStore.settings

  if (!token || !repositoryUrl) {
    testResult.value = {
      success: false,
      message: "Заполните токен и URL репозитория",
    }
    isTesting.value = false
    return
  }

  try {
    const { createGitLabAPI } = await import("@/utils/gitlab-api")
    await createGitLabAPI({
      token,
      repositoryUrl,
      projectId: gitlabStore.settings.projectId,
    })
    testResult.value = {
      success: true,
      message: "Соединение успешно! Токен валиден.",
    }
    success(testResult.value.message)
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
</script>

<template>
  <div class="max-w-xl w-full mx-auto p-8">
    <h1 class="text-xl font-bold mb-6">Настройки</h1>

    <div class="space-y-6">
      <!-- Интерфейс -->
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

      <!-- GitLab -->
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
                Personal Access Token
              </label>
              <input
                v-model="gitlabStore.settings.token"
                type="password"
                placeholder="glpat-..."
                class="w-full px-3 py-2 border rounded text-sm"
                :class="{
                  'border-red-500 focus:ring-red-500': tokenError,
                }"
              />
              <p
                v-if="tokenError"
                class="text-xs text-red-500 mt-1"
              >
                {{ tokenError }}
              </p>
              <p
                v-else
                class="text-xs text-gray-500 mt-1"
              >
                Токен с правами
                <code>read_api</code>
                и
                <code>read_repository</code>
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">
                URL репозитория
              </label>
              <input
                v-model="gitlabStore.settings.repositoryUrl"
                type="text"
                placeholder="https://gitlab.com/group/project"
                class="w-full px-3 py-2 border rounded text-sm"
                :class="{
                  'border-red-500 focus:ring-red-500': urlError,
                }"
              />
              <p
                v-if="urlError"
                class="text-xs text-red-500 mt-1"
              >
                {{ urlError }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">
                Project ID (опционально)
              </label>
              <input
                v-model.number="gitlabStore.settings.projectId"
                type="number"
                placeholder="123"
                class="w-full px-3 py-2 border rounded text-sm"
                :class="{
                  'border-red-500 focus:ring-red-500': projectIdError,
                }"
              />
              <p
                v-if="projectIdError"
                class="text-xs text-red-500 mt-1"
              >
                {{ projectIdError }}
              </p>
              <p
                v-else
                class="text-xs text-gray-500 mt-1"
              >
                Можно найти в настройках проекта GitLab
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">
                Ветка по умолчанию
              </label>
              <input
                v-model="gitlabStore.settings.defaultBranch"
                type="text"
                placeholder="main"
                class="w-full px-3 py-2 border rounded text-sm"
              />
            </div>

            <button
              :disabled="isTesting || !isValid"
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
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
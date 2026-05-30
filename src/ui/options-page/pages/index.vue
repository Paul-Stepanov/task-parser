<script setup lang="ts">
import BaseInput from "@/ui/common/components/BaseInput.vue"
import BaseSelect from "@/ui/common/components/BaseSelect.vue"
import BaseButton from "@/ui/common/components/BaseButton.vue"
import { useGitLabStore } from "@/stores/gitlab.store"
import { useGitLabValidation } from "@/composables/useGitLabValidation"
import { useToast } from "@/composables/useToast"
import { computed, ref } from "vue"

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

const isFullyConfigured = computed(() => gitlabStore.isConfigured)

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
  <div class="max-w-lg w-full mx-auto p-6">
    <!-- Page title -->
    <div class="flex items-center gap-3 mb-8">
      <div
        class="w-9 h-9 rounded-xl flex items-center justify-center"
        style="background-color: var(--primary)"
      >
        <svg
          class="w-5 h-5 text-white"
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
            r="3"
          />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
          />
        </svg>
      </div>
      <div>
        <h1 class="text-lg font-bold tracking-tight">Настройки</h1>
        <p
          class="text-xs"
          style="color: var(--muted-foreground)"
        >
          Конфигурация расширения
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-6">
      <!-- GitLab integration section -->
      <div
        class="p-5 rounded-xl border"
        style="
          background-color: var(--card);
          border-color: var(--border);
          box-shadow: var(--shadow-sm);
        "
      >
        <h3 class="font-semibold text-sm mb-4 flex items-center gap-2">
          <svg
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="color: var(--warning)"
          >
            <path
              d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"
            />
          </svg>
          GitLab интеграция
        </h3>

        <!-- Toggle -->
        <label
          class="flex items-center gap-3 mb-5 cursor-pointer group"
        >
          <div class="relative">
            <input
              v-model="gitlabStore.settings.enabled"
              type="checkbox"
              class="sr-only peer"
            />
            <div
              class="w-10 h-5.5 rounded-full transition-colors duration-200 peer-checked:bg-[var(--primary)]"
              style="background-color: var(--input)"
            />
            <div
              class="absolute left-0.5 top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-[18px] shadow-sm"
            />
          </div>
          <span
            class="text-sm"
            style="color: var(--foreground)"
          >
            Включить GitLab интеграцию
          </span>
        </label>

        <template v-if="gitlabStore.settings.enabled">
          <div class="flex flex-col gap-4">
            <!-- URL input -->
            <div>
              <label
                class="block text-sm font-medium mb-1.5"
                style="color: var(--foreground)"
              >
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
                class="text-xs mt-1.5"
                style="color: var(--muted-foreground)"
              >
                Корневой адрес вашего GitLab сервера
              </p>
            </div>

            <!-- Token input -->
            <div>
              <label
                class="block text-sm font-medium mb-1.5"
                style="color: var(--foreground)"
              >
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
                class="text-xs mt-1.5"
                style="color: var(--muted-foreground)"
              >
                Токен с правами
                <code
                  class="px-1 py-0.5 rounded text-xs font-mono"
                  style="
                    background-color: var(--muted);
                    color: var(--foreground);
                  "
                >
                  read_api
                </code>
                и
                <code
                  class="px-1 py-0.5 rounded text-xs font-mono"
                  style="
                    background-color: var(--muted);
                    color: var(--foreground);
                  "
                >
                  read_repository
                </code>
              </p>
            </div>

            <!-- Test connection -->
            <BaseButton
              :loading="isTesting"
              :disabled="!hasCredentials"
              @click="testConnection"
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
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Проверить подключение
            </BaseButton>

            <!-- Test result -->
            <Transition name="section">
              <div
                v-if="testResult"
                class="p-3 rounded-lg text-sm flex items-center gap-2"
                :style="{
                  backgroundColor: testResult.success
                    ? 'color-mix(in srgb, var(--success) 10%, transparent)'
                    : 'color-mix(in srgb, var(--destructive) 10%, transparent)',
                  color: testResult.success
                    ? 'var(--success)'
                    : 'var(--destructive)',
                  border: testResult.success
                    ? '1px solid color-mix(in srgb, var(--success) 20%, transparent)'
                    : '1px solid color-mix(in srgb, var(--destructive) 20%, transparent)',
                }"
              >
                <svg
                  v-if="testResult.success"
                  class="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 shrink-0"
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
                {{ testResult.message }}
              </div>
            </Transition>

            <!-- Group/Project selection -->
            <template v-if="gitlabStore.groups.length > 0">
              <div
                class="border-t pt-5 mt-1 flex flex-col gap-4"
                style="border-color: var(--border)"
              >
                <div>
                  <label
                    class="block text-sm font-medium mb-1.5"
                    style="color: var(--foreground)"
                  >
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
                </div>

                <div v-if="gitlabStore.settings.groupId">
                  <label
                    class="block text-sm font-medium mb-1.5"
                    style="color: var(--foreground)"
                  >
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

                <!-- Configuration complete -->
                <Transition name="section">
                  <div
                    v-if="isFullyConfigured"
                    class="p-3 rounded-lg flex items-center justify-between"
                    style="
                      background-color: color-mix(
                        in srgb,
                        var(--success) 10%,
                        transparent
                      );
                      border: 1px solid
                        color-mix(
                          in srgb,
                          var(--success) 20%,
                          transparent
                        );
                    "
                  >
                    <div
                      class="flex items-center gap-2 text-sm"
                      style="color: var(--success)"
                    >
                      <svg
                        class="w-4 h-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>
                        {{ gitlabStore.settings.groupName }} /
                        {{ gitlabStore.settings.projectName }}
                      </span>
                    </div>
                    <RouterLink
                      to="/side-panel"
                      class="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors duration-150"
                      style="background-color: var(--primary)"
                    >
                      Готово
                    </RouterLink>
                  </div>
                </Transition>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
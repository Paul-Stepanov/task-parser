import { computed, type ComputedRef } from "vue"

export function useGitLabValidation(
  token: ComputedRef<string>,
  repositoryUrl: ComputedRef<string>,
  projectId: ComputedRef<number | undefined>,
) {
  const tokenError = computed(() => {
    if (!token.value) {
      return null
    }

    if (!token.value.startsWith("glpat-")) {
      return "Токен должен начинаться с glpat-"
    }

    if (token.value.length < 20) {
      return "Токен слишком короткий (минимум 20 символов)"
    }

    return null
  })

  const urlError = computed(() => {
    if (!repositoryUrl.value) {
      return null
    }

    try {
      const url = new URL(repositoryUrl.value)

      if (!url.protocol.startsWith("http")) {
        return "URL должен начинаться с http:// или https://"
      }

      return null
    } catch {
      return "Некорректный формат URL"
    }
  })

  const projectIdError = computed(() => {
    if (projectId.value === undefined || projectId.value === null) {
      return null
    }

    if (isNaN(projectId.value) || projectId.value <= 0) {
      return "ID проекта должен быть положительным числом"
    }

    return null
  })

  const isValid = computed(
    () => !tokenError.value && !urlError.value && !projectIdError.value,
  )

  return {
    tokenError,
    urlError,
    projectIdError,
    isValid,
  }
}
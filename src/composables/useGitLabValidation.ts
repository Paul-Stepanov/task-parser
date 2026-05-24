import { computed, type ComputedRef } from "vue"

export function useGitLabValidation(
  token: ComputedRef<string>,
  gitlabUrl: ComputedRef<string>,
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
    if (!gitlabUrl.value) {
      return null
    }

    try {
      const url = new URL(gitlabUrl.value)

      if (!url.protocol.startsWith("http")) {
        return "URL должен начинаться с http:// или https://"
      }

      if (url.pathname !== "/" && url.pathname !== "") {
        return "Укажите корневой URL GitLab (например, https://gitlab.company.com)"
      }

      return null
    } catch {
      return "Некорректный формат URL"
    }
  })

  const isValid = computed(
    () => !tokenError.value && !urlError.value,
  )

  return {
    tokenError,
    urlError,
    isValid,
  }
}
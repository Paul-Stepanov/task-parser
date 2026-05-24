import { defineStore } from "pinia"
import { useTheme } from "src/composables/useTheme"

export const useOptionsStore = defineStore("options", () => {
  const { isDark, toggleDark } = useTheme()

  return {
    isDark,
    toggleDark,
  }
})
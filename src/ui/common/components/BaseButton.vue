<script setup lang="ts">
import { computed } from "vue"

export type ButtonVariant = "primary" | "secondary" | "destructive" | "success" | "outline"

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    disabled?: boolean
    type?: "button" | "submit" | "reset"
  }>(),
  {
    variant: "primary",
    disabled: false,
    type: "button",
  },
)

const classes = computed(() => {
  const base = "px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
  }

  return `${base} ${variantClasses[props.variant]}`
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
  >
    <slot />
  </button>
</template>
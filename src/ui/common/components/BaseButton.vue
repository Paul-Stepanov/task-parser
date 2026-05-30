<script setup lang="ts">
import { computed } from "vue"

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "success"
  | "outline"

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    disabled?: boolean
    loading?: boolean
    type?: "button" | "submit" | "reset"
  }>(),
  {
    variant: "primary",
    disabled: false,
    loading: false,
    type: "button",
  },
)

const classes = computed(() => {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]"

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-hover)] hover:shadow focus-visible:outline-[var(--accent)]",
    secondary:
      "bg-[var(--muted)] text-[var(--foreground)] hover:brightness-95 focus-visible:outline-[var(--muted-foreground)]",
    destructive:
      "bg-[var(--destructive)] text-white shadow-sm hover:bg-[var(--destructive-hover)] hover:shadow focus-visible:outline-[var(--destructive)]",
    success:
      "bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-hover)] hover:shadow focus-visible:outline-[var(--primary)]",
    outline:
      "border border-[var(--border)] text-[var(--foreground)] bg-transparent hover:bg-[var(--muted)] focus-visible:outline-[var(--muted-foreground)]",
  }

  return `${base} ${variantClasses[props.variant]}`
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
  >
    <svg
      v-if="loading"
      class="w-4 h-4 animate-spin"
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
    <slot />
  </button>
</template>
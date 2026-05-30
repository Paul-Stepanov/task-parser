<script setup lang="ts">
import { computed } from "vue"

export interface SelectOption {
  value: string | number
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | undefined
    options: SelectOption[]
    placeholder?: string
    disabled?: boolean
    error?: string | null
  }>(),
  {
    placeholder: "Выберите...",
    disabled: false,
    error: null,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | number | undefined]
}>()

const classes = computed(() => {
  const base =
    "w-full px-3 py-2 border rounded-lg text-sm transition-all duration-150 appearance-none bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--background)]"

  const errorClasses = props.error
    ? "border-[var(--destructive)] focus:ring-[var(--destructive)]"
    : "border-[var(--input)] focus:ring-[var(--ring)] focus:border-[var(--ring)]"

  const disabledClasses = props.disabled
    ? "opacity-50 cursor-not-allowed"
    : ""

  return `${base} ${errorClasses} ${disabledClasses}`
})

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit("update:modelValue", value ? value : undefined)
}
</script>

<template>
  <div class="relative">
    <select
      :value="modelValue ?? ''"
      :disabled="disabled"
      :class="classes"
      @change="onChange"
    >
      <option
        value=""
        disabled
      >
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <!-- Custom chevron -->
    <div
      class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      style="color: var(--muted-foreground)"
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
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
    <p
      v-if="error"
      class="text-xs mt-1.5 flex items-center gap-1"
      style="color: var(--destructive)"
    >
      <svg
        class="w-3 h-3 shrink-0"
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
          x1="12"
          y1="8"
          x2="12"
          y2="12"
        />
        <line
          x1="12"
          y1="16"
          x2="12.01"
          y2="16"
        />
      </svg>
      {{ error }}
    </p>
  </div>
</template>
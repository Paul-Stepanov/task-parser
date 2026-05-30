<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue: string | number | undefined
    type?: "text" | "password" | "email" | "number" | "url"
    placeholder?: string
    disabled?: boolean
    error?: string | null
  }>(),
  {
    type: "text",
    placeholder: "",
    disabled: false,
    error: null,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | number]
}>()

const classes = computed(() => {
  const base =
    "w-full px-3 py-2 border rounded-lg text-sm transition-all duration-150 bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--background)]"

  const errorClasses = props.error
    ? "border-[var(--destructive)] focus:ring-[var(--destructive)]"
    : "border-[var(--input)] focus:ring-[var(--ring)] focus:border-[var(--ring)]"

  const disabledClasses = props.disabled
    ? "opacity-50 cursor-not-allowed"
    : ""

  return `${base} ${errorClasses} ${disabledClasses}`
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (props.type === "number") {
    emit("update:modelValue", target.valueAsNumber || "")
  } else {
    emit("update:modelValue", target.value)
  }
}
</script>

<template>
  <div>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="classes"
      @input="onInput"
    />
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
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
    "w-full px-3 py-2 border rounded text-sm transition-colors appearance-none bg-no-repeat"

  const errorClasses = props.error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"

  const disabledClasses = props.disabled
    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500"
    : "bg-white dark:bg-gray-900"

  return `${base} ${errorClasses} ${disabledClasses}`
})

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit("update:modelValue", value ? value : undefined)
}
</script>

<template>
  <div>
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
    <p
      v-if="error"
      class="text-xs text-red-500 mt-1"
    >
      {{ error }}
    </p>
  </div>
</template>
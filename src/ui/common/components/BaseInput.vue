<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue: string | number
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
  const base = "w-full px-3 py-2 border rounded text-sm transition-colors"

  const errorClasses = props.error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"

  return `${base} ${errorClasses}`
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
      class="text-xs text-red-500 mt-1"
    >
      {{ error }}
    </p>
  </div>
</template>
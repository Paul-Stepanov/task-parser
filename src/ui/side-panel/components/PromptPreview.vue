<script setup lang="ts">
import { usePromptsStore } from "@/stores/prompts.store"
import { useToast } from "@/composables/useToast"
import { computed, ref } from "vue"
import BaseButton from "@/ui/common/components/BaseButton.vue"

const promptsStore = usePromptsStore()
const { success } = useToast()
const prompt = computed(() => promptsStore.currentPrompt)

const showSystem = ref(false)

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text)
  success("Скопировано в буфер обмена")
}

async function copyFullPrompt() {
  if (!prompt.value) return
  const full = `=== SYSTEM PROMPT ===\n${prompt.value.systemPrompt}\n\n=== USER PROMPT ===\n${prompt.value.userPrompt}`
  await copyToClipboard(full)
}
</script>

<template>
  <div
    v-if="prompt"
    class="space-y-3"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold">
        {{
          prompt.type === "report" ? "Промпт для отчета" : "Промпт для оценки"
        }}
      </h3>
      <div class="flex gap-2">
        <BaseButton
          variant="primary"
          class="text-xs"
          @click="copyFullPrompt"
        >
          Копировать всё
        </BaseButton>
        <BaseButton
          variant="outline"
          class="text-xs"
          @click="showSystem = !showSystem"
        >
          {{ showSystem ? "Скрыть system" : "Показать system" }}
        </BaseButton>
      </div>
    </div>

    <details
      v-if="showSystem"
      class="border rounded"
      open
    >
      <summary
        class="p-2 cursor-pointer text-sm font-medium bg-blue-50 dark:bg-blue-900/30"
      >
        System Prompt
      </summary>
      <div
        class="p-2 text-xs whitespace-pre-wrap border-t max-h-64 overflow-y-auto"
      >
        {{ prompt.systemPrompt }}
      </div>
    </details>

    <details
      class="border rounded"
      open
    >
      <summary
        class="p-2 cursor-pointer text-sm font-medium bg-green-50 dark:bg-green-900/30"
      >
        User Prompt
      </summary>
      <div
        class="p-2 text-xs whitespace-pre-wrap border-t max-h-96 overflow-y-auto"
      >
        {{ prompt.userPrompt }}
      </div>
    </details>
  </div>
</template>

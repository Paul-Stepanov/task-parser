<script setup lang="ts">
import { usePromptsStore } from "@/stores/prompts.store"
import { useToast } from "@/composables/useToast"
import { computed, ref } from "vue"
import BaseButton from "@/ui/common/components/BaseButton.vue"

const promptsStore = usePromptsStore()
const { success } = useToast()
const prompt = computed(() => promptsStore.currentPrompt)

const showSystem = ref(false)
const justCopied = ref(false)

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text)
  justCopied.value = true
  success("Скопировано в буфер обмена")
  setTimeout(() => {
    justCopied.value = false
  }, 2000)
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
    class="flex flex-col gap-2.5 animate-fade-in"
  >
    <!-- Header with actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="w-1.5 h-4 rounded-full"
          :style="{
            backgroundColor:
              prompt.type === 'report'
                ? 'var(--primary)'
                : 'var(--accent)',
          }"
        />
        <h3 class="text-sm font-semibold">
          {{
            prompt.type === "report"
              ? "Промпт для отчета"
              : "Промпт для оценки"
          }}
        </h3>
      </div>
      <div class="flex gap-1.5">
        <BaseButton
          variant="primary"
          class="text-xs"
          @click="copyFullPrompt"
        >
          <svg
            v-if="!justCopied"
            class="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect
              x="9"
              y="9"
              width="13"
              height="13"
              rx="2"
              ry="2"
            />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg
            v-else
            class="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {{ justCopied ? "Скопировано" : "Копировать всё" }}
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

    <!-- System prompt -->
    <details
      v-if="showSystem"
      class="rounded-lg border overflow-hidden"
      style="border-color: var(--border)"
      open
    >
      <summary
        class="px-3 py-2 cursor-pointer text-sm font-medium flex items-center"
        style="
          background-color: color-mix(
            in srgb,
            var(--accent) 8%,
            transparent
          );
          color: var(--accent);
        "
      >
        System Prompt
      </summary>
      <div
        class="p-3 text-xs whitespace-pre-wrap leading-relaxed border-t max-h-64 overflow-y-auto font-mono"
        style="
          border-color: var(--border);
          color: var(--muted-foreground);
          background-color: var(--card);
        "
      >
        {{ prompt.systemPrompt }}
      </div>
    </details>

    <!-- User prompt -->
    <details
      class="rounded-lg border overflow-hidden"
      style="border-color: var(--border)"
      open
    >
      <summary
        class="px-3 py-2 cursor-pointer text-sm font-medium flex items-center"
        style="
          background-color: color-mix(
            in srgb,
            var(--primary) 8%,
            transparent
          );
          color: var(--primary);
        "
      >
        User Prompt
      </summary>
      <div
        class="p-3 text-xs whitespace-pre-wrap leading-relaxed border-t max-h-96 overflow-y-auto font-mono"
        style="
          border-color: var(--border);
          color: var(--muted-foreground);
          background-color: var(--card);
        "
      >
        {{ prompt.userPrompt }}
      </div>
    </details>
  </div>
</template>
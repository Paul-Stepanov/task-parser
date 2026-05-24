export type PromptType = "estimate" | "report"

export interface GeneratedPrompt {
  type: PromptType
  systemPrompt: string
  userPrompt: string
  timestamp: string
  taskId: string
}
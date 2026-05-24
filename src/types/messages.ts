import type { Bitrix24TaskData } from "./bitrix24"
import type { GeneratedPrompt, PromptType } from "./prompts"

export interface ParseTaskResponse {
  success: boolean
  data?: Bitrix24TaskData
  error?: string
}

export interface GeneratePromptRequest {
  taskData: Bitrix24TaskData
  promptType: PromptType
}

export interface GeneratePromptResponse {
  success: boolean
  prompt?: GeneratedPrompt
  error?: string
}
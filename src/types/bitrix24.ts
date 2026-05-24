export interface Bitrix24TaskTab {
  content: string
  rawContent?: string
  elementId?: string
}

export interface Bitrix24TaskData {
  taskId: string | null
  taskTitle: string
  title: string
  url: string
  timestamp: string
  tabs: Record<string, Bitrix24TaskTab>
}

export interface Bitrix24ParserOptions {
  includeRawContent?: boolean
  maxContentLength?: number
}

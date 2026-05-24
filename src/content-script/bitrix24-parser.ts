import type { Bitrix24TaskData } from "@/types/bitrix24"
import { BITRIX24_SELECTORS } from "./selectors"
import { extractTextContent, findElement, findTaskScope } from "./dom-utils"

export class Bitrix24TaskParser {
  detectBitrix24Page(): boolean {
    const hostname = window.location.hostname
    const url = window.location.href

    const isBitrix24Domain =
      hostname.includes("bitrix24.ru") ||
      hostname.includes("bitrix24.com") ||
      hostname.includes("onpeak.ru")

    const isTaskPage =
      url.includes("/tasks/task/view/") || url.includes("IFRAME=Y")

    return isBitrix24Domain && isTaskPage
  }

  extractTaskId(): string | null {
    const urlMatch = window.location.href.match(/\/tasks\/task\/view\/(\d+)/)
    if (urlMatch) return urlMatch[1]

    const element = document.querySelector("[data-bx-task-id]")
    return element?.getAttribute("data-bx-task-id") || null
  }

  async parseTask(): Promise<Bitrix24TaskData> {
    const taskScope = findTaskScope()

    if (!taskScope) {
      throw new Error("Не удалось найти контейнер задачи на странице")
    }

    const taskData: Bitrix24TaskData = {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      taskId: this.extractTaskId(),
      taskTitle: "",
      tabs: {},
    }

    const titleElement = findElement(taskScope, BITRIX24_SELECTORS.title)
    if (titleElement) {
      taskData.taskTitle = extractTextContent(titleElement)
    }

    this.extractDescription(taskScope, taskData)
    this.extractComments(taskScope, taskData)
    this.extractHistory(taskScope, taskData)
    this.extractTime(taskScope, taskData)
    this.extractPlanning(taskScope, taskData)
    this.extractFiles(taskScope, taskData)
    this.extractSidebarInfo(taskScope, taskData)

    if (Object.keys(taskData.tabs).length === 0) {
      const fullContent = extractTextContent(taskScope)
      taskData.tabs["Полный контент"] = {
        content: fullContent,
        rawContent: taskScope.innerHTML.substring(0, 10000),
      }
    }

    return taskData
  }

  private extractDescription(scope: Element, taskData: Bitrix24TaskData): void {
    const element = findElement(scope, BITRIX24_SELECTORS.description)
    if (element) {
      taskData.tabs["Описание"] = {
        content: extractTextContent(element),
        rawContent: element.innerHTML.substring(0, 10000),
      }
    }
  }

  private extractComments(scope: Element, taskData: Bitrix24TaskData): void {
    let container = scope.querySelector(BITRIX24_SELECTORS.comments)
    if (!container) {
      container = document.querySelector(BITRIX24_SELECTORS.comments)
    }

    if (!container) return

    const comments: string[] = []
    const commentElements = Array.from(container.querySelectorAll(
      "[class*='comment-item'], [class*='comment-content'], [class*='comment-']",
    ))

    for (const element of commentElements) {
      const text = extractTextContent(element)
      if (text.length > 10) {
        comments.push(text)
      }
    }

    taskData.tabs["Комментарии"] = {
      content:
        comments.length > 0
          ? comments.join("\n\n")
          : extractTextContent(container),
      rawContent: container.innerHTML.substring(0, 10000),
      elementId: "task-comments-block",
    }
  }

  private extractHistory(scope: Element, taskData: Bitrix24TaskData): void {
    let container = findElement(scope, BITRIX24_SELECTORS.history)
    if (!container) {
      container = document.querySelector(BITRIX24_SELECTORS.history)
    }

    if (!container) return

    const entries: string[] = []
    const elements = Array.from(container.querySelectorAll(
      "tr, [class*='log-item'], [class*='history-item'], [class*='log-entry']",
    ))

    for (const element of elements) {
      const text = extractTextContent(element)
      if (text.length > 10) {
        entries.push(text)
      }
    }

    taskData.tabs["История"] = {
      content:
        entries.length > 0
          ? entries.join("\n")
          : extractTextContent(container),
      rawContent: container.innerHTML.substring(0, 10000),
      elementId: (container as Element).id || undefined,
    }
  }

  private extractTime(scope: Element, taskData: Bitrix24TaskData): void {
    let container = scope.querySelector(BITRIX24_SELECTORS.time)
    if (!container) {
      container = document.querySelector(BITRIX24_SELECTORS.time)
    }

    if (!container) return

    const entries: string[] = []
    const elements = Array.from(container.querySelectorAll(
      "tr, [class*='time-entry'], [class*='timeman']",
    ))

    for (const element of elements) {
      const text = extractTextContent(element)
      if (text.length > 5) {
        entries.push(text)
      }
    }

    taskData.tabs["Время"] = {
      content:
        entries.length > 0
          ? entries.join("\n")
          : extractTextContent(container),
      rawContent: container.innerHTML.substring(0, 10000),
      elementId: "task-time-block",
    }
  }

  private extractPlanning(scope: Element, taskData: Bitrix24TaskData): void {
    const container = findElement(scope, BITRIX24_SELECTORS.planning)
    if (container) {
      taskData.tabs["Планирование"] = {
        content: extractTextContent(container),
        rawContent: container.innerHTML.substring(0, 10000),
      }
    }
  }

  private extractFiles(scope: Element, taskData: Bitrix24TaskData): void {
    let container = findElement(scope, BITRIX24_SELECTORS.files)
    if (!container) {
      container = document.querySelector(BITRIX24_SELECTORS.files)
    }

    if (!container) return

    const files: string[] = []
    const fileElements = Array.from(container.querySelectorAll(
      "a[href*='download'], [class*='file-item']",
    ))

    for (const element of fileElements) {
      const fileName =
        element.textContent?.trim() || element.getAttribute("title") || ""
      if (fileName.length > 0) {
        files.push(fileName)
      }
    }

    if (files.length > 0) {
      taskData.tabs["Файлы"] = {
        content: files.join("\n"),
        rawContent: container.innerHTML.substring(0, 10000),
      }
    }
  }

  private extractSidebarInfo(scope: Element, taskData: Bitrix24TaskData): void {
    const sidebar = findElement(scope, BITRIX24_SELECTORS.sidebar)
    if (!sidebar) return

    const info: string[] = []

    const statusElement = findElement(sidebar, BITRIX24_SELECTORS.status)
    if (statusElement) {
      info.push(`Статус: ${extractTextContent(statusElement)}`)
    }

    const deadlineElement = findElement(sidebar, BITRIX24_SELECTORS.deadline)
    if (deadlineElement) {
      info.push(`Срок: ${extractTextContent(deadlineElement)}`)
    }

    const creatorElement = findElement(sidebar, BITRIX24_SELECTORS.creator)
    if (creatorElement) {
      info.push(`Автор: ${extractTextContent(creatorElement)}`)
    }

    if (info.length > 0) {
      taskData.tabs["Информация"] = {
        content: info.join("\n"),
        rawContent: sidebar.innerHTML.substring(0, 10000),
      }
    }
  }
}
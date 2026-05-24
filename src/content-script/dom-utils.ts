import { BITRIX24_SELECTORS } from "./selectors"

export function extractTextContent(element: Element): string {
  const cloned = element.cloneNode(true) as Element

  for (const selector of BITRIX24_SELECTORS.unwanted.split(", ")) {
    cloned.querySelectorAll(selector).forEach((el) => el.remove())
  }

  return cloned.textContent?.trim().replace(/\s+/g, " ") || ""
}

export function findElement(
  scope: Element | Document,
  selectorList: string,
): Element | null {
  for (const selector of selectorList.split(", ")) {
    try {
      const element = scope.querySelector(selector)
      if (element) return element
    } catch {
      continue
    }
  }
  return null
}

export function findTaskScope(): Element | null {
  for (const selector of BITRIX24_SELECTORS.taskScope) {
    const element = document.querySelector(selector)
    if (element) return element
  }

  const allElements = Array.from(document.querySelectorAll("*"))
  const candidates: Array<{
    element: Element
    textLength: number
    priority: number
  }> = []

  for (const element of allElements) {
    if (["HTML", "BODY", "HEAD"].includes(element.tagName)) continue

    const text = element.textContent?.trim() || ""
    const id = element.id || ""
    const className = element.className?.toString() || ""

    const isTaskRelated =
      id.includes("task") ||
      className.includes("task") ||
      (text.length > 100 &&
        [
          "Задача #",
          "Комментарии",
          "История",
          "Время",
          "План",
          "Исполнитель",
          "Срок",
        ].some((keyword) => text.includes(keyword)))

    if (!isTaskRelated) continue

    let priority = 0
    if (
      id &&
      (id.includes("detail") || id.includes("view") || id.includes("edit"))
    ) {
      priority += 100
    }
    if (
      className &&
      (className.includes("detail") ||
        className.includes("view") ||
        className.includes("edit"))
    ) {
      priority += 50
    }

    candidates.push({ element, textLength: text.length, priority })
  }

  candidates.sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority
    return b.textLength - a.textLength
  })

  const best = candidates.find((c) => c.textLength > 500)
  return best?.element || document.body
}
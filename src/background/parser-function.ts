export default function parseBitrix24Task(): Promise<{
  success: boolean
  data?: Record<string, unknown>
  error?: string
  debugInfo?: Record<string, unknown>
}> {
  return new Promise((resolve) => {
    const hostname = window.location.hostname
    const url = window.location.href

    const isBitrix24 =
      hostname.includes("bitrix24.ru") ||
      hostname.includes("bitrix24.com") ||
      hostname.includes("onpeak.ru")

    const isTaskPage =
      url.includes("/tasks/task/view/") || url.includes("IFRAME=Y")

    if (!isBitrix24 || !isTaskPage) {
      resolve({
        success: false,
        error: "Not a Bitrix24 task page",
      })
      return
    }

    // Ищем iframe с задачей Bitrix24
    const taskIframe = document.querySelector(
      'iframe[src*="IFRAME=Y&IFRAME_TYPE=SIDE_SLIDER"]',
    ) as HTMLIFrameElement | null

    if (!taskIframe) {
      resolve({
        success: false,
        error:
          "Не найден iframe с задачей. Убедитесь, что задача открыта в side panel.",
        debugInfo: {
          url: window.location.href,
          title: document.title,
          iframeCount: document.querySelectorAll("iframe").length,
          iframes: Array.from(document.querySelectorAll("iframe")).map(
            (iframe) => ({
              src: iframe.src,
              id: iframe.id,
              className: iframe.className,
            }),
          ),
        },
      })
      return
    }

    // Вспомогательная функция: извлечение чистого текста
    function extractTextContent(element: Element): string {
      if (!element) return ""
      const cloned = element.cloneNode(true) as Element
      const unwantedSelectors = [
        "script",
        "style",
        "button",
        "input",
        "select",
        ".ui-btn",
        ".btn",
        '[class*="button"]',
        ".toolbar",
        ".control-panel",
      ]
      for (const selector of unwantedSelectors) {
        for (const el of Array.from(cloned.querySelectorAll(selector))) {
          el.remove()
        }
      }
      return cloned.textContent?.trim().replace(/\s+/g, " ") || ""
    }

    // Вспомогательная функция: поиск элемента по нескольким селекторам
    function findEl(
      scope: Element | Document,
      selectors: string[],
    ): Element | null {
      for (const sel of selectors) {
        try {
          const el = scope.querySelector(sel)
          if (el) return el
        } catch {
          // invalid selector — skip
        }
      }
      return null
    }

    // Извлечение ID задачи из родительской страницы
    function extractTaskId(): string | null {
      const urlMatch = window.location.href.match(/\/tasks\/task\/view\/(\d+)/)
      if (urlMatch) return urlMatch[1]
      const element = document.querySelector("[data-bx-task-id]")
      if (element) return element.getAttribute("data-bx-task-id")
      return null
    }

    // Извлечение заголовка задачи
    function extractTaskTitle(iframeDoc: Document): string {
      const titleSelectors = [
        ".task-popup-pagetitle-item",
        "h1",
        ".task-title",
        '[class*="title"]',
      ]

      // Сначала ищем в iframe
      for (const sel of titleSelectors) {
        const el = iframeDoc.querySelector(sel)
        if (el) {
          const text = extractTextContent(el)
          if (text.length > 5) return text
        }
      }

      // Затем на главной странице
      const mainSelectors = ["h1", "[data-bx-task-id]", ".task-title"]
      for (const sel of mainSelectors) {
        const el = document.querySelector(sel)
        if (el) {
          const text = extractTextContent(el)
          if (text.length > 5) return text
        }
      }

      return `Задача #${extractTaskId()}`
    }

    // Поиск контейнера задачи в iframe
    function findTaskScope(iframeDoc: Document): Element {
      const scopeSelectors = [
        "#tasks-iframe-popup-scope",
        ".task-detail-main",
        '[id*="task-detail"]',
        ".bx-task-detail-container",
        ".task-card-detail",
        ".main-ui-item-edit-container",
        ".task-detail",
        ".task-view",
      ]

      for (const sel of scopeSelectors) {
        const el = iframeDoc.querySelector(sel)
        if (el) return el
      }

      // Расширенный поиск: ищем элементы связанные с задачей
      const allElements = iframeDoc.querySelectorAll("*")
      const candidates: { element: Element; textLength: number }[] = []

      for (const el of Array.from(allElements)) {
        if (["HTML", "BODY", "HEAD"].includes(el.tagName)) continue
        const text = el.textContent?.trim() || ""
        const id = el.id || ""
        const className =
          typeof el.className === "string" ? el.className : ""

        if (
          id.includes("task") ||
          className.includes("task") ||
          (text.length > 200 &&
            (text.includes("Задача #") ||
              text.includes("Комментарии") ||
              text.includes("История") ||
              text.includes("Время") ||
              text.includes("План") ||
              text.includes("Исполнитель") ||
              text.includes("Срок")))
        ) {
          candidates.push({ element: el, textLength: text.length })
        }
      }

      candidates.sort((a, b) => b.textLength - a.textLength)
      const best = candidates.find((item) => item.textLength > 500)
      return best ? best.element : iframeDoc.body
    }

    // Сбор данных из всех табов
    function collectAllTabData(
      iframeDoc: Document,
    ): Record<string, unknown> {
      const taskScope = findTaskScope(iframeDoc)
      const taskId = extractTaskId()
      const taskTitle = extractTaskTitle(iframeDoc)

      const taskData: Record<string, unknown> = {
        taskId,
        taskTitle,
        title: document.title,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        tabs: {},
      }

      const tabs: Record<string, { content: string; rawContent?: string; elementId?: string }> = {}

      // Описание
      const descSelectors = [
        "#task-detail-description",
        ".task-description",
        '[class*="description"]',
      ]
      const descEl = findEl(taskScope, descSelectors)
      if (descEl) {
        const content = extractTextContent(descEl)
        if (content.length > 10) {
          tabs["Описание"] = {
            content,
            rawContent: descEl.innerHTML.substring(0, 10000),
          }
        }
      }

      // Комментарии
      const commentsSelectors = [
        "#task-comments-block",
        ".task-comments-container",
        '[id*="comments"]',
        '[class*="comment"]',
      ]
      const commentsEl = findEl(taskScope, commentsSelectors)
      if (commentsEl) {
        const content = extractTextContent(commentsEl)
        if (content.length > 10) {
          tabs["Комментарии"] = {
            content,
            rawContent: commentsEl.innerHTML.substring(0, 10000),
            elementId: commentsEl.id,
          }
        }
      }

      // Время
      const timeSelectors = [
        "#task-time-block",
        '[id*="time"]',
        '[class*="timeman"]',
        '[class*="time"]',
      ]
      const timeEl = findEl(taskScope, timeSelectors)
      if (timeEl) {
        const content = extractTextContent(timeEl)
        if (content.length > 5) {
          tabs["Время"] = {
            content,
            rawContent: timeEl.innerHTML.substring(0, 10000),
            elementId: timeEl.id,
          }
        }
      }

      // Файлы
      const filesSelectors = [
        "#task-files-block",
        '[class*="files"]',
        '[class*="disk"]',
      ]
      const filesEl = findEl(taskScope, filesSelectors)
      if (filesEl) {
        const fileItems = filesEl.querySelectorAll(
          'a[href*="download"], [class*="file-item"]',
        )
        if (fileItems.length > 0) {
          const files = Array.from(fileItems)
            .map((el) => el.textContent?.trim() || el.getAttribute("title") || "")
            .filter((text) => text.length > 0)
          if (files.length > 0) {
            tabs["Файлы"] = {
              content: files.join("\n"),
              rawContent: filesEl.innerHTML.substring(0, 10000),
            }
          }
        } else {
          const content = extractTextContent(filesEl)
          if (content.length > 10) {
            tabs["Файлы"] = {
              content,
              rawContent: filesEl.innerHTML.substring(0, 10000),
            }
          }
        }
      }

      // Fallback: если ничего не найдено — берём весь контент
      if (Object.keys(tabs).length === 0) {
        const fullContent = extractTextContent(taskScope)
        tabs["Полный контент"] = {
          content: fullContent.substring(0, 3000),
          rawContent: taskScope.innerHTML.substring(0, 5000),
        }
      }

      taskData.tabs = tabs
      return taskData
    }

    // Ожидание загрузки iframe и получение доступа к contentDocument
    async function waitForIframeAccess(): Promise<Document | null> {
      const maxWaitTime = 15000
      const startTime = Date.now()

      return new Promise((checkResolve) => {
        function checkAccess() {
          try {
            const iframeDoc =
              taskIframe!.contentDocument ||
              (taskIframe!.contentWindow?.document as Document | null | undefined)
            if (iframeDoc && iframeDoc.readyState === "complete") {
              checkResolve(iframeDoc)
              return
            }
          } catch {
            // Cross-origin error — продолжаем ждать
          }

          if (Date.now() - startTime > maxWaitTime) {
            checkResolve(null)
            return
          }

          setTimeout(checkAccess, 500)
        }
        checkAccess()
      })
    }

    // Запуск парсинга
    waitForIframeAccess()
      .then((iframeDoc) => {
        if (!iframeDoc) {
          resolve({
            success: false,
            error:
              "Не удалось получить доступ к iframe после 15 секунд ожидания",
          })
          return
        }

        const taskData = collectAllTabData(iframeDoc)
        resolve({ success: true, data: taskData })
      })
      .catch((error) => {
        resolve({
          success: false,
          error: `Ошибка при парсинге: ${error instanceof Error ? error.message : "Unknown error"}`,
        })
      })
  })
}
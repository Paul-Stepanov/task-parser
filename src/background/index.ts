import parseBitrix24Task from "./parser-function"

// Open side panel when user clicks the extension icon
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id !== undefined) {
    await chrome.sidePanel.open({ tabId: tab.id })
  }
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "parseTask") {
    handleParseTask()
      .then((result) => sendResponse(result))
      .catch((error) => {
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      })
    return true // async response
  }
})

async function handleParseTask() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  })

  if (!tab?.id) {
    return { success: false, error: "Нет активной вкладки" }
  }

  if (
    !tab.url ||
    tab.url.startsWith("chrome://") ||
    tab.url.startsWith("chrome-extension://")
  ) {
    return { success: false, error: "Невозможно парсить системные страницы" }
  }

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: parseBitrix24Task,
  })

  const result = results[0]?.result

  if (!result) {
    return { success: false, error: "Не удалось получить данные со страницы" }
  }

  return result
}

self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}

console.info("Task Parser background script loaded")

export {}

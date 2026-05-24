export async function sendMessageToActiveTab<T = unknown>(
  action: string,
  data?: unknown,
): Promise<T | null> {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  })

  if (!tab?.id) {
    throw new Error("Нет активной вкладки")
  }

  const response = await chrome.tabs.sendMessage(tab.id, { action, data })
  return response as T | null
}
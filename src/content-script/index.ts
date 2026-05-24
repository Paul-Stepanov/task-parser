import { Bitrix24TaskParser } from "./bitrix24-parser"

console.info("content-script loaded")

const parser = new Bitrix24TaskParser()

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "parseTask") {
    if (!parser.detectBitrix24Page()) {
      sendResponse({ success: false, error: "Not a Bitrix24 task page" })
      return true
    }

    parser
      .parseTask()
      .then((data) => {
        sendResponse({ success: true, data })
      })
      .catch((error) => {
        const msg =
          error instanceof Error ? error.message : "Unknown parse error"
        sendResponse({ success: false, error: msg })
      })

    return true // async response
  }
})
import { ref } from "vue"

export type ToastType = "success" | "error" | "info"

export interface Toast {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const show = (message: string, type: ToastType = "info") => {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 3000)
  }

  const success = (message: string) => show(message, "success")
  const error = (message: string) => show(message, "error")
  const info = (message: string) => show(message, "info")

  return {
    toasts,
    show,
    success,
    error,
    info,
  }
}
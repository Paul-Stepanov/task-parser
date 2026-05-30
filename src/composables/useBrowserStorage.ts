import { ref, watch, nextTick, toRaw } from "vue"
import { debounce } from "lodash-es"

function mergeDeep(
  defaults: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const output = { ...defaults }

  Object.keys(defaults).forEach((key) => {
    const defaultValue = defaults[key]
    const sourceValue = source?.[key]

    if (isObject(defaultValue) && sourceValue != null) {
      output[key] = mergeDeep(
        defaultValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>,
      )
    } else if (checkType(defaultValue, sourceValue)) {
      output[key] = sourceValue
    } else {
      output[key] = defaultValue
      const isNumberStringConversion =
        (typeof sourceValue === "number" && typeof defaultValue === "string") ||
        (typeof sourceValue === "string" && typeof defaultValue === "number")
      if (!isNumberStringConversion) {
        console.warn("Type mismatch", key, sourceValue, "(expected", typeof defaultValue, ")")
      }
    }
  })

  return output
}

function checkType(defaultValue: unknown, value: unknown): boolean {
  const isDefaultUndefined = defaultValue === undefined
  const isNullOrUndefined = value === null || value === undefined
  const isStrictTypeMatch =
    typeof value === typeof defaultValue &&
    Array.isArray(value) === Array.isArray(defaultValue)

  const isNumberStringConversion =
    (typeof value === "number" && typeof defaultValue === "string") ||
    (typeof value === "string" && typeof defaultValue === "number")

  return isDefaultUndefined || isNullOrUndefined || isStrictTypeMatch || isNumberStringConversion
}

function isObject(value: unknown): boolean {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

export function useBrowserSyncStorage<T>(key: string, defaultValue: T) {
  return useBrowserStorage(key, defaultValue, "sync")
}

export function useBrowserLocalStorage<T>(key: string, defaultValue: T) {
  return useBrowserStorage(key, defaultValue, "local")
}

function useBrowserStorage<T>(
  key: string,
  defaultValue: T,
  storageType: "sync" | "local" = "sync",
) {
  const data = ref<T>(defaultValue)
  const isUpdatingFromStorage = ref(true)
  const defaultIsObject = isObject(defaultValue)
  const promise = new Promise((resolve) => {
    chrome.storage[storageType].get(key, async (result) => {
      if (result?.[key] !== undefined) {
        if (defaultIsObject && isObject(result[key])) {
          data.value = mergeDeep(
            defaultValue as Record<string, unknown>,
            result[key] as Record<string, unknown>,
          ) as T
        } else if (checkType(defaultValue, result[key])) {
          data.value = result[key]
        }
      }
      await nextTick()
      isUpdatingFromStorage.value = false
      resolve(data)
    })
  })

  const debouncedWrite = debounce((newValue: T) => {
    if (checkType(defaultValue, newValue)) {
      chrome.storage[storageType].set({ [key]: toRaw(newValue) })
    } else {
      console.error("not updating " + key + ": type mismatch")
    }
  }, 500)

  function flush() {
    debouncedWrite.flush()
  }

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", flush)
  }

  watch(
    data,
    (newValue) => {
      if (!isUpdatingFromStorage.value) {
        debouncedWrite(newValue)
      }
    },
    { deep: true, flush: "post" },
  )

  chrome.storage[storageType].onChanged.addListener(async function (changes) {
    if (changes?.[key]) {
      isUpdatingFromStorage.value = true
      const { newValue } = changes[key]
      if (defaultIsObject && isObject(newValue) && isObject(data.value)) {
        const merged = mergeDeep(
          defaultValue as Record<string, unknown>,
          newValue as Record<string, unknown>,
        )
        const current = data.value as Record<string, unknown>
        const target = merged as Record<string, unknown>

        Object.keys(target).forEach((k) => {
          if (current[k] !== target[k]) {
            current[k] = target[k]
          }
        })

        Object.keys(current).forEach((k) => {
          if (!(k in target)) {
            delete current[k]
          }
        })
      } else {
        data.value = newValue
      }
      await nextTick()
      isUpdatingFromStorage.value = false
    }
  })

  return { data, promise }
}
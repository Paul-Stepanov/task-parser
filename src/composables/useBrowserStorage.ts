import { ref, watch, nextTick, toRaw } from "vue"
import { debounce } from "lodash-es"

function mergeDeep(defaults: any, source: any): any {
  // Merge the default options with the stored options
  const output = { ...defaults } // Start with defaults

  Object.keys(defaults).forEach((key) => {
    const defaultValue = defaults[key]
    const sourceValue = source?.[key]

    if (isObject(defaultValue) && sourceValue != null) {
      // Recursively merge nested objects
      output[key] = mergeDeep(defaultValue, sourceValue)
    } else if (checkType(defaultValue, sourceValue)) {
      output[key] = sourceValue
    } else {
      // If the type is different, use the default value
      output[key] = defaultValue
      // Only warn for actual type mismatches, not number/string conversion
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

function checkType(defaultValue: any, value: any): boolean {
  // Check if the value type is the same type as the default value or null
  // Chrome storage stores numbers as strings, so we allow number <-> string conversion

  // IMPORTANT: Allow overriding undefined default with any real value from storage
  // This fixes the issue where stored data from previous sessions gets rejected
  const isDefaultUndefined = defaultValue === undefined
  const isNullOrUndefined = value === null || value === undefined
  const isStrictTypeMatch =
    typeof value === typeof defaultValue &&
    Array.isArray(value) == Array.isArray(defaultValue)

  // Allow number <-> string conversion (chrome.storage limitation)
  const isNumberStringConversion =
    (typeof value === "number" && typeof defaultValue === "string") ||
    (typeof value === "string" && typeof defaultValue === "number")

  return isDefaultUndefined || isNullOrUndefined || isStrictTypeMatch || isNumberStringConversion
}

function isObject(value: any): boolean {
  return value !== null && value instanceof Object && !Array.isArray(value)
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
  // Blocking setting storage if it is updating from storage
  let isUpdatingFromStorage = true
  const defaultIsObject = isObject(defaultValue)
  // Initialize storage with the value from chrome.storage
  const promise = new Promise((resolve) => {
    chrome.storage[storageType].get(key, async (result) => {
      if (result?.[key] !== undefined) {
        if (defaultIsObject && isObject(result[key])) {
          data.value = mergeDeep(defaultValue, result[key])
        } else if (checkType(defaultValue, result[key])) {
          data.value = result[key]
        }
      }
      await nextTick()
      isUpdatingFromStorage = false
      resolve(data)
    })
  })

  // Watch for changes in the storage and update chrome.storage (debounced)
  const debouncedWrite = debounce((newValue: T) => {
    if (checkType(defaultValue, newValue)) {
      chrome.storage[storageType].set({ [key]: toRaw(newValue) })
    } else {
      console.error("not updating " + key + ": type mismatch")
    }
  }, 500)

  watch(
    data,
    (newValue) => {
      if (!isUpdatingFromStorage) {
        debouncedWrite(newValue)
      }
    },
    { deep: true, flush: "post" },
  )

  // Add the onChanged listener here
  chrome.storage[storageType].onChanged.addListener(async function (changes) {
    if (changes?.[key]) {
      isUpdatingFromStorage = true
      const { newValue } = changes[key]
      if (defaultIsObject && isObject(newValue) && isObject(data.value)) {
        const merged = mergeDeep(defaultValue, newValue)
        const current = data.value as Record<string, any>
        const target = merged as Record<string, any>

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
      isUpdatingFromStorage = false
    }
  })

  return { data, promise }
}

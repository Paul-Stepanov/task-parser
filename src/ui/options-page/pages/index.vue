<script setup lang="ts">
import { useOptionsStore } from "src/stores/options.store"
import { storeToRefs } from "pinia"

const optionsStore = useOptionsStore()
const { isDark, profile, others } = storeToRefs(optionsStore)
</script>

<template>
  <div class="max-w-xl w-full mx-auto p-8">
    <h1 class="text-xl font-bold mb-4">Настройки</h1>

    <div class="space-y-6">
      <div>
        <h3 class="font-semibold mb-2">Интерфейс</h3>
        <label class="flex items-center gap-2">
          <input v-model="isDark" type="checkbox" class="rounded" />
          Тёмная тема
        </label>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Профиль</h3>
        <div class="space-y-2">
          <label class="block">
            <span class="text-sm text-gray-600">Имя</span>
            <input
              v-model="profile.name"
              type="text"
              class="w-full border rounded px-3 py-1.5 mt-1"
            />
          </label>
          <label class="block">
            <span class="text-sm text-gray-600">Возраст</span>
            <input
              v-model="profile.age"
              type="number"
              class="w-full border rounded px-3 py-1.5 mt-1"
            />
          </label>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Прочее</h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2">
            <input v-model="others.awesome" type="checkbox" class="rounded" />
            Awesome Feature
          </label>
          <label class="block">
            <span class="text-sm text-gray-600">Счётчик</span>
            <input
              v-model="others.counter"
              type="number"
              class="w-full border rounded px-3 py-1.5 mt-1"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
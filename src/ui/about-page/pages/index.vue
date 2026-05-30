<script setup lang="ts">
import { RouterLink } from "vue-router"

const version = __VERSION__
const githubUrl = __GITHUB_URL__
</script>

<template>
  <div class="max-w-lg w-full mx-auto p-6">
    <!-- Page title -->
    <div class="flex items-center gap-3 mb-8">
      <div
        class="w-9 h-9 rounded-xl flex items-center justify-center"
        style="background-color: var(--primary)"
      >
        <svg
          class="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
          />
          <line
            x1="12"
            y1="16"
            x2="12"
            y2="12"
          />
          <line
            x1="12"
            y1="8"
            x2="12.01"
            y2="8"
          />
        </svg>
      </div>
      <div>
        <h1 class="text-lg font-bold tracking-tight">О приложении</h1>
        <p
          class="text-xs"
          style="color: var(--muted-foreground)"
        >
          Bitrix24 Task Parser v{{ version }}
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-5">
      <!-- What is this -->
      <section
        class="p-5 rounded-xl border"
        style="
          background-color: var(--card);
          border-color: var(--border);
          box-shadow: var(--shadow-sm);
        "
      >
        <h3 class="font-semibold text-sm mb-3 flex items-center gap-2">
          <svg
            class="w-4 h-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="color: var(--primary)"
          >
            <polyline points="9 11 12 14 22 4" />
            <path
              d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
            />
          </svg>
          Что это?
        </h3>
        <p
          class="text-sm leading-relaxed"
          style="color: var(--muted-foreground)"
        >
          Расширение для парсинга задач из Bitrix24 и генерации структурированных
          промптов для AI-ассистентов. Извлекает название, описание, комментарии, затраченное время и другие поля задачи — и формирует готовый промпт для работы с
          ИИ.
        </p>
      </section>

      <!-- How to use -->
      <section
        class="p-5 rounded-xl border"
        style="
          background-color: var(--card);
          border-color: var(--border);
          box-shadow: var(--shadow-sm);
        "
      >
        <h3 class="font-semibold text-sm mb-3 flex items-center gap-2">
          <svg
            class="w-4 h-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="color: var(--accent)"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Как пользоваться
        </h3>
        <ol
          class="flex flex-col gap-3 text-sm"
          style="color: var(--muted-foreground)"
        >
          <li class="flex items-start gap-3">
            <span
              class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style="
                background-color: var(--primary);
                color: white;
              "
            >
              1
            </span>
            <span>
              Откройте задачу в Bitrix24 — перейдите на страницу нужной задачи
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span
              class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style="
                background-color: var(--primary);
                color: white;
              "
            >
              2
            </span>
            <span>
              Нажмите на иконку расширения в панели браузера — откроется боковая
              панель
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span
              class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style="
                background-color: var(--primary);
                color: white;
              "
            >
              3
            </span>
            <span>
              Нажмите кнопку <strong style="color: var(--foreground)">«Парсить задачу»</strong>
              — расширение извлечёт данные из открытой страницы. 

              Задача должна быть открыта в режиме фрейма (выезжает с правой стороны экрана)
            </span>
          </li>
          <li class="flex items-start gap-3">
            <span
              class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style="
                background-color: var(--primary);
                color: white;
              "
            >
              4
            </span>
            <span>
              Скопируйте сгенерированный промпт кнопкой
              <strong style="color: var(--foreground)">«Скопировать»</strong>
              и вставьте в AI-ассистент
            </span>
          </li>
        </ol>
      </section>

      <!-- GitLab setup -->
      <section
        class="p-5 rounded-xl border"
        style="
          background-color: var(--card);
          border-color: var(--border);
          box-shadow: var(--shadow-sm);
        "
      >
        <h3 class="font-semibold text-sm mb-3 flex items-center gap-2">
          <svg
            class="w-4 h-4 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="color: var(--warning)"
          >
            <path
              d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"
            />
          </svg>
          Настройка GitLab
        </h3>
        <div
          class="flex flex-col gap-3 text-sm"
          style="color: var(--muted-foreground)"
        >
          <p class="leading-relaxed">
            Для подключения GitLab-коммитов к задаче:
          </p>
          <ol class="flex flex-col gap-2.5">
            <li class="flex items-start gap-3">
              <span
                class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style="
                  background-color: var(--primary);
                  color: white;
                "
              >
                1
              </span>
              <span>
                Перейдите в
                <RouterLink
                  to="/options-page"
                  class="font-medium underline underline-offset-2"
                  style="color: var(--primary)"
                >
                  Настройки
                </RouterLink>
                и включите GitLab-интеграцию
              </span>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style="
                  background-color: var(--primary);
                  color: white;
                "
              >
                2
              </span>
              <span>
                Укажите URL вашего GitLab-сервера
                (например,
                <code
                  class="px-1 py-0.5 rounded text-xs font-mono"
                  style="
                    background-color: var(--muted);
                    color: var(--foreground);
                  "
                >
                  https://gitlab.company.com
                </code>
                )
              </span>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style="
                  background-color: var(--primary);
                  color: white;
                "
              >
                3
              </span>
              <span>
                Создайте Personal Access Token с правами
                <code
                  class="px-1 py-0.5 rounded text-xs font-mono"
                  style="
                    background-color: var(--muted);
                    color: var(--foreground);
                  "
                >
                  read_api
                </code>
                и
                <code
                  class="px-1 py-0.5 rounded text-xs font-mono"
                  style="
                    background-color: var(--muted);
                    color: var(--foreground);
                  "
                >
                  read_repository
                </code>
              </span>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style="
                  background-color: var(--primary);
                  color: white;
                "
              >
                4
              </span>
              <span>
                Вставьте токен и проверьте подключение
              </span>
            </li>
          </ol>
          <p
            class="text-xs mt-1 leading-relaxed"
            style="color: var(--muted-foreground)"
          >
            После настройки к промпту можно будет автоматически добавить коммиты
            из связанных GitLab-репозиториев.
            Нужно будет выбрать группу и проект из удаленного репозитория, после чего, указать название смерженной в мастер ветки с выполненной фичей.
          </p>
        </div>
      </section>

      <!-- Links & contacts -->
      <section
        class="p-5 rounded-xl border"
        style="
          background-color: var(--card);
          border-color: var(--border);
          box-shadow: var(--shadow-sm);
        "
      >
        <h3 class="font-semibold text-sm mb-3 flex items-center gap-2">
          <svg
            class="w-4 h-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="color: var(--accent)"
          >
            <path
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
            />
            <polyline points="15 3 21 3 21 9" />
            <line
              x1="10"
              y1="14"
              x2="21"
              y2="3"
            />
          </svg>
          Ссылки
        </h3>
        <div class="flex flex-col gap-2">
          <a
            :href="githubUrl"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2.5 p-2.5 rounded-lg text-sm transition-colors duration-150"
            style="color: var(--foreground)"
          >
            <svg
              class="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              style="color: var(--muted-foreground)"
            >
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
            <span>GitHub</span>
            <svg
              class="w-3 h-3 ml-auto"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color: var(--muted-foreground)"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
          <a
            :href="`${githubUrl}/issues`"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2.5 p-2.5 rounded-lg text-sm transition-colors duration-150"
            style="color: var(--foreground)"
          >
            <svg
              class="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color: var(--muted-foreground)"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              />
            </svg>
            <span>Сообщить о проблеме</span>
            <svg
              class="w-3 h-3 ml-auto"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="color: var(--muted-foreground)"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>
      </section>

      <!-- Back button -->
      <RouterLink
        to="/side-panel"
        class="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
        style="
          background-color: var(--primary);
          color: white;
        "
      >
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        На главную
      </RouterLink>
    </div>
  </div>
</template>
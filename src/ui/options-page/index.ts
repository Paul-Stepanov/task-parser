import { pinia } from "src/utils/pinia"
import { appRouter } from "src/utils/router"
import { createApp } from "vue"
import App from "./app.vue"
import "./index.css"

appRouter.addRoute({
  path: "/",
  redirect: "/options-page",
})

const app = createApp(App).use(pinia).use(appRouter)

app.mount("#app")

export default app
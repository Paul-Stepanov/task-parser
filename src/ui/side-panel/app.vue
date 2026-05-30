<script setup lang="ts">
import AppHeader from "@/ui/common/components/AppHeader.vue"
import AppFooter from "@/ui/common/components/AppFooter.vue"
import ToastContainer from "@/ui/common/components/ToastContainer.vue"
</script>

<template>
  <div
    class="flex flex-col min-h-screen"
    style="background-color: var(--background); color: var(--foreground)"
  >
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
    <ToastContainer />
  </div>
</template>

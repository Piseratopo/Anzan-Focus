<template>
  <div class="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
    <AppHeader />

    <main class="w-full pt-16 bg-background flex-1">
      <div class="flex flex-col w-full max-w-[1366px] mx-auto px-md md:px-lg py-md md:py-lg space-y-lg">
        <div class="flex flex-col space-y-xs">
          <h1 class="font-display-lg text-3xl md:text-4xl text-on-surface">Practice History</h1>
          <p class="font-body-md text-on-surface-variant text-sm md:text-base">
            View previous calculation logs and performance statistics.
          </p>
        </div>

        <div class="bg-surface-container-lowest p-lg md:p-xl rounded-2xl border border-dashed border-surface-variant flex flex-col items-center justify-center text-center space-y-xs py-xl">
          <span class="material-symbols-outlined text-3xl text-outline-variant">history</span>
          <h3 class="font-title-md text-base md:text-lg text-on-surface">No Recorded Sessions Yet</h3>
          <p class="font-label-sm text-xs text-on-surface-variant max-w-sm">
            Complete your first mental math practice session to start seeing your statistics here.
          </p>
          <NuxtLink 
            to="/practice"
            class="mt-xs px-md py-xs rounded-full bg-primary text-on-primary font-label-md text-sm shadow-md hover:bg-primary/90 transition-all"
          >
            Start Practice Now
          </NuxtLink>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// History Page
</script>


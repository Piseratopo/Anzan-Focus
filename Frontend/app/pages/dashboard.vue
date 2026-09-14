<template>
  <div class="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
    <AppHeader />

    <main class="w-full pt-16 bg-background flex-1">
      <div class="flex flex-col w-full max-w-[1366px] mx-auto px-md md:px-lg py-md md:py-lg space-y-lg">
        <!-- Welcome Banner -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-sm border-b border-surface-variant/40 pb-md">
          <div class="flex flex-col space-y-xs">
            <h1 class="font-display-lg text-3xl md:text-4xl text-on-surface">Dashboard</h1>
            <p class="font-body-md text-on-surface-variant text-sm md:text-base">
              Welcome to your Anzan Focus training center.
            </p>
          </div>

          <NuxtLink 
            to="/settings" 
            class="px-md py-xs rounded-full bg-primary text-on-primary font-title-md text-sm flex items-center gap-xs shadow-md hover:bg-primary/90 transition-all active:scale-95"
          >
            <span class="material-symbols-outlined text-[16px]">settings</span>
            <span>Configure Settings</span>
          </NuxtLink>
        </div>

        <!-- Quick Launch Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-md md:gap-lg">
          <!-- Practice Card -->
          <NuxtLink 
            to="/practice"
            class="bg-surface-container-lowest p-lg rounded-2xl border border-surface-variant/40 hover:border-primary/50 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between space-y-md"
          >
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-xl">bolt</span>
              </div>
              <span class="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
            <div>
              <h2 class="font-title-md text-base md:text-lg text-on-surface mb-xs">Daily Practice</h2>
              <p class="font-label-sm text-xs text-on-surface-variant">
                Sharpen mental math speed, precision, and focus with custom calculation drills.
              </p>
            </div>
          </NuxtLink>

          <!-- Settings Card -->
          <NuxtLink 
            to="/settings"
            class="bg-surface-container-lowest p-lg rounded-2xl border border-surface-variant/40 hover:border-primary/50 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between space-y-md"
          >
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-secondary-container/50 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-xl">tune</span>
              </div>
              <span class="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
            </div>
            <div>
              <h2 class="font-title-md text-base md:text-lg text-on-surface mb-xs">Session Parameters</h2>
              <p class="font-label-sm text-xs text-on-surface-variant">
                Adjust speed, operands, number ranges, and calculation operations.
              </p>
            </div>
          </NuxtLink>

          <!-- History Card -->
          <div class="bg-surface-container-lowest p-lg rounded-2xl border border-surface-variant/40 shadow-sm flex flex-col justify-between space-y-md opacity-80">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-xl bg-tertiary-container/30 text-tertiary flex items-center justify-center">
                <span class="material-symbols-outlined text-xl">history</span>
              </div>
              <span class="font-label-sm text-[10px] bg-surface-container-high px-sm py-0.5 rounded-full text-on-surface-variant">Coming soon</span>
            </div>
            <div>
              <h2 class="font-title-md text-base md:text-lg text-on-surface mb-xs">Session History</h2>
              <p class="font-label-sm text-xs text-on-surface-variant">
                Track your speed improvements, accuracy trends, and streaks over time.
              </p>
            </div>
          </div>
        </div>

        <!-- Dashboard Placeholder Area -->
        <div class="w-full bg-surface-container-lowest p-lg md:p-xl rounded-2xl border border-dashed border-surface-variant flex flex-col items-center justify-center text-center space-y-xs py-xl">
          <span class="material-symbols-outlined text-3xl text-outline-variant">analytics</span>
          <h3 class="font-title-md text-base md:text-lg text-on-surface">Activity & Stats Dashboard</h3>
          <p class="font-label-sm text-xs text-on-surface-variant max-w-sm">
            Complete practice sessions to unlock insights, heatmaps, and calculation speed metrics.
          </p>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Dashboard Page
</script>


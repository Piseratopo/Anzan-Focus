<template>
  <header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border-b border-surface-variant/40">
    <div class="h-16 max-w-[1366px] mx-auto px-lg flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/dashboard" class="flex items-center gap-sm group">
        <div class="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-primary/10">
          <svg class="w-5 h-5 text-primary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-dasharray="4 4" stroke-width="6"></circle>
            <circle cx="50" cy="50" fill="currentColor" r="20"></circle>
            <path d="M50 15 L50 35 M50 65 L50 85 M15 50 L35 50 M65 50 L85 50" stroke="currentColor" stroke-width="6"></path>
          </svg>
        </div>
        <span class="font-headline-lg text-title-md text-on-surface tracking-tight">Anzan Focus</span>
      </NuxtLink>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center gap-xl">
        <NuxtLink 
          to="/dashboard" 
          class="font-label-md transition-colors"
          :class="route.path === '/dashboard' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink 
          to="/practice" 
          class="font-label-md transition-colors"
          :class="route.path === '/practice' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'"
        >
          Practice
        </NuxtLink>
        <NuxtLink 
          to="/history" 
          class="font-label-md transition-colors"
          :class="route.path === '/history' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'"
        >
          History
        </NuxtLink>
        <NuxtLink 
          to="/settings" 
          class="font-label-md transition-colors"
          :class="route.path === '/settings' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'"
        >
          Settings
        </NuxtLink>
      </nav>

      <!-- Right Action & Profile -->
      <div class="flex items-center gap-md">
        <div class="w-8 h-8 rounded-full bg-surface-container-high ring-1 ring-surface-variant/80 flex items-center justify-center text-primary font-medium text-xs shadow-sm overflow-hidden">
          <span class="material-symbols-outlined text-[20px]">person</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
</script>


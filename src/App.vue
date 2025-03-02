<template>
    <div class="min-h-screen flex flex-col">
      <header class="py-4 px-6 bg-white dark:bg-surface-dark shadow-sm flex justify-between items-center">
        <h1 class="text-xl font-bold text-primary-light dark:text-primary-dark">Excel Analyzer</h1>
        <ThemeToggle />
      </header>
      
      <main class="flex-1 container mx-auto px-4 py-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      
      <footer class="py-3 px-6 bg-white dark:bg-surface-dark text-center text-sm text-gray-500 dark:text-gray-400">
        Excel Analyzer © {{ new Date().getFullYear() }}
      </footer>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import ThemeToggle from './components/ThemeToggle.vue';
  import { useThemeStore } from './stores/themeStore';
  
  const themeStore = useThemeStore();
  
  onMounted(() => {
    // Применяем сохраненную тему при загрузке приложения
    themeStore.initTheme();
  });
  </script>
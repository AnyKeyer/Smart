import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false);

  function toggleTheme() {
    isDark.value = !isDark.value;
    updateTheme();
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  }

  function initTheme() {
    // Проверяем сохраненную тему или системные предпочтения
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    isDark.value = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    updateTheme();
  }

  function updateTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return { isDark, toggleTheme, initTheme };
});
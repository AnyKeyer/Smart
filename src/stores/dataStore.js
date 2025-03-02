import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDataStore = defineStore('data', () => {
  // Исходные данные из Excel-файла
  const rawData = ref([]);
  
  // Текущая выбранная запись для отображения
  const currentIndex = ref(0);
  
  // Установка данных из Excel
  function setRawData(data) {
    rawData.value = data;
    currentIndex.value = 0;
  }
  
  // Отфильтрованные данные (добавлено)
  const filteredData = computed(() => {
    return rawData.value;
  });
  
  // Получение текущего элемента
  const currentItem = computed(() => {
    if (rawData.value.length === 0) return null;
    return rawData.value[currentIndex.value];
  });
  
  // Методы для навигации
  function nextItem() {
    if (currentIndex.value < rawData.value.length - 1) {
      currentIndex.value++;
      return true;
    }
    return false;
  }
  
  function prevItem() {
    if (currentIndex.value > 0) {
      currentIndex.value--;
      return true;
    }
    return false;
  }
  
  // Вспомогательные функции
  const totalItems = computed(() => rawData.value.length);
  const hasItems = computed(() => rawData.value.length > 0);
  const isLastItem = computed(() => currentIndex.value === rawData.value.length - 1);
  const isFirstItem = computed(() => currentIndex.value === 0);
  
  return {
    rawData,
    filteredData, // Добавлено
    currentIndex,
    currentItem,
    setRawData,
    nextItem,
    prevItem,
    totalItems,
    hasItems,
    isLastItem,
    isFirstItem
  };
});
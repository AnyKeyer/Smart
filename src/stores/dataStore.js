import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useDataStore = defineStore('data', () => {
  // Исходные данные из Excel-файла
  const rawData = ref([]);
  
  // Текущая выбранная запись для отображения
  const currentIndex = ref(0);
  
  // Отфильтрованные данные - важно чтобы это был ref, а не computed
  const filteredDataArray = ref([]);
  
  // Установка данных из Excel
  function setRawData(data) {
    rawData.value = data;
    filteredDataArray.value = [...data]; 
    currentIndex.value = 0;
    
    // Импортируем и применяем фильтры после загрузки данных
    // Важно делать это здесь, а не в useFilterStore, чтобы избежать циклической зависимости
    import('./filterStore').then(({ useFilterStore }) => {
      const filterStore = useFilterStore();
      filterStore.applyFiltersToData();
    }).catch(err => {
      console.error('Ошибка при импорте filterStore:', err);
    });
  }
  
  // Установка отфильтрованных данных (вызывается из filterStore)
  function setFilteredData(data) {
    // Создаем новый массив и проверяем, что он не undefined
    const newData = Array.isArray(data) ? [...data] : [];
    
    // Используем прямую мутацию ref объекта для максимальной реактивности
    filteredDataArray.value = newData;
    
    // Сбрасываем индекс, если он вышел за границы после фильтрации
    if (currentIndex.value >= filteredDataArray.value.length && filteredDataArray.value.length > 0) {
      currentIndex.value = 0;
    }
    
    console.log('Обновлены отфильтрованные данные:', filteredDataArray.value.length, 'записей');
  }
  
  // Публичный доступ к отфильтрованным данным
  const filteredData = computed(() => filteredDataArray.value);
  
  // Получение текущего элемента
  const currentItem = computed(() => {
    if (filteredDataArray.value.length === 0) return null;
    return filteredDataArray.value[currentIndex.value];
  });
  
  // Методы для навигации по данным
  function nextItem() {
    if (currentIndex.value < filteredDataArray.value.length - 1) {
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
  const filteredCount = computed(() => filteredDataArray.value.length);
  const hasItems = computed(() => rawData.value.length > 0);
  const isLastItem = computed(() => currentIndex.value === filteredDataArray.value.length - 1);
  const isFirstItem = computed(() => currentIndex.value === 0);
  
  // Функция для отладки состояния
  function debug() {
    console.log('DataStore debug:', {
      rawDataCount: rawData.value.length,
      filteredDataCount: filteredDataArray.value.length,
      currentIndex: currentIndex.value,
      currentItemExists: currentItem.value !== null
    });
  }
  
  return {
    rawData,
    filteredData,
    currentIndex,
    currentItem,
    setRawData,
    setFilteredData,
    nextItem,
    prevItem,
    totalItems,
    filteredCount,
    hasItems,
    isLastItem,
    isFirstItem,
    debug
  };
});
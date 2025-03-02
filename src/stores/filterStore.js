import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useDataStore } from './dataStore';

export const useFilterStore = defineStore('filter', () => {
  // Структура для хранения фильтров
  const filters = ref({});
  
  // Инициализация фильтров из localStorage
  function initFilters() {
    try {
      const savedFilters = localStorage.getItem('filters');
      if (savedFilters) {
        filters.value = JSON.parse(savedFilters);
      }
    } catch (error) {
      console.error('Ошибка при загрузке фильтров:', error);
    }
  }
  
  // Сохранение фильтров
  function saveFilters() {
    try {
      localStorage.setItem('filters', JSON.stringify(filters.value));
    } catch (error) {
      console.error('Ошибка при сохранении фильтров:', error);
    }
  }
  
  // Установка фильтра для конкретного поля
  function setFilter(column, operator, value) {
    filters.value[column] = { operator, value };
    saveFilters();
  }
  
  // Удаление фильтра
  function removeFilter(column) {
    delete filters.value[column];
    saveFilters();
  }
  
  // Очистка всех фильтров
  function clearFilters() {
    filters.value = {};
    saveFilters();
  }
  
  // Получение отфильтрованных данных
  const filteredData = computed(() => {
    const dataStore = useDataStore();
    
    // Если фильтров нет, возвращаем все данные
    if (Object.keys(filters.value).length === 0) {
      return dataStore.rawData;
    }
    
    // Применяем фильтры
    return dataStore.rawData.filter(item => {
      // Проверяем каждый фильтр
      for (const [column, filter] of Object.entries(filters.value)) {
        const itemValue = item[column];
        
        // Пропускаем, если значение не определено
        if (itemValue === undefined) continue;
        
        // Применяем оператор фильтра
        switch (filter.operator) {
          case 'eq': // равно
            if (itemValue != filter.value) return false;
            break;
          case 'gt': // больше
            if (!(itemValue > filter.value)) return false;
            break;
          case 'lt': // меньше
            if (!(itemValue < filter.value)) return false;
            break;
          case 'gte': // больше или равно
            if (!(itemValue >= filter.value)) return false;
            break;
          case 'lte': // меньше или равно
            if (!(itemValue <= filter.value)) return false;
            break;
          case 'contains': // содержит (для строк)
            if (typeof itemValue !== 'string' || !itemValue.includes(filter.value)) return false;
            break;
        }
      }
      
      // Если все фильтры прошли, включаем запись
      return true;
    });
  });
  
  return {
    filters,
    initFilters,
    setFilter,
    removeFilter,
    clearFilters,
    filteredData
  };
});
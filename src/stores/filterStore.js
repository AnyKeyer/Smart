import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useDataStore } from './dataStore';
import { useKnownWalletsStore } from './knownWalletsStore';

export const useFilterStore = defineStore('filter', () => {
  // Структура для хранения фильтров
  const filters = ref({});
  
  // Флаг для исключения известных кошельков
  const excludeKnownWallets = ref(true);
  
  // Инициализация фильтров из localStorage или переданных фильтров
  function initFilters(savedFilters = null) {
    try {
      if (savedFilters) {
        filters.value = savedFilters;
      } else {
        const localStorageFilters = localStorage.getItem('filters');
        if (localStorageFilters) {
          filters.value = JSON.parse(localStorageFilters);
        }
      }
      
      // Загружаем настройку исключения известных кошельков
      const savedExcludeKnownWallets = localStorage.getItem('excludeKnownWallets');
      if (savedExcludeKnownWallets !== null) {
        excludeKnownWallets.value = JSON.parse(savedExcludeKnownWallets);
      }
      
      // После инициализации фильтров, обновляем данные
      applyFiltersToData();
    } catch (error) {
      console.error('Ошибка при загрузке фильтров:', error);
    }
  }
  
  // Обновление фильтров (для использования в FilterSelector и других компонентах)
  function updateFilters(newFilters) {
    filters.value = newFilters;
    saveFilters();
    
    // После обновления фильтров, обновляем данные
    applyFiltersToData();
  }
  
  // Функция для переключения исключения известных кошельков
  function toggleExcludeKnownWallets() {
    excludeKnownWallets.value = !excludeKnownWallets.value;
    localStorage.setItem('excludeKnownWallets', JSON.stringify(excludeKnownWallets.value));
    applyFiltersToData();
  }
  
  // Установка значения для исключения известных кошельков
  function setExcludeKnownWallets(value) {
    excludeKnownWallets.value = value;
    localStorage.setItem('excludeKnownWallets', JSON.stringify(excludeKnownWallets.value));
    applyFiltersToData();
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
    
    // После изменения фильтров, обновляем данные
    applyFiltersToData();
  }
  
  // Удаление фильтра
  function removeFilter(column) {
    delete filters.value[column];
    saveFilters();
    
    // После изменения фильтров, обновляем данные
    applyFiltersToData();
  }
  
  // Очистка всех фильтров
  function clearFilters() {
    filters.value = {};
    saveFilters();
    
    // После очистки фильтров, обновляем данные
    applyFiltersToData();
  }
  
  // Функция конвертации строковых значений в нужный формат
  function convertValue(value, column) {
    // Конвертация специальных форматов данных
    if (typeof value === 'string') {
      // Конвертируем строки с 'k' (1.2k -> 1200)
      if (/^\d+(\.\d+)?k$/.test(value)) {
        return parseFloat(value.replace('k', '')) * 1000;
      }
      
      // Конвертируем строки времени в минуты
      if (value.includes('minutes')) {
        return parseInt(value);
      } else if (value.includes('hour')) {
        const hours = value.includes('an hour') ? 1 : parseInt(value);
        return hours * 60;
      } else if (value.includes('day')) {
        const days = value.includes('a day') ? 1 : parseInt(value);
        return days * 24 * 60;
      }
      
      // Для дат
      if (/^[A-Za-z]{3} \d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
        return new Date(value);
      }
    }
    
    return value;
  }
  
  // Применение фильтров к данным
  function applyFiltersToData() {
    const dataStore = useDataStore();
    const knownWalletsStore = useKnownWalletsStore();
    
    // Если база не готова, пытаемся инициализировать
    if (!knownWalletsStore.dbReady) {
      knownWalletsStore.initDatabase().catch(error => {
        console.error('Ошибка при инициализации базы известных кошельков:', error);
      });
    }
    
    // Получаем исходные данные для фильтрации
    let dataToFilter = [...dataStore.rawData];
    
    // Сначала исключаем известные кошельки, если это необходимо
    if (excludeKnownWallets.value) {
      const startCount = dataToFilter.length;
      dataToFilter = dataToFilter.filter(item => {
        return !knownWalletsStore.isKnownWallet(item.wallet);
      });
      console.log(`Исключено ${startCount - dataToFilter.length} известных кошельков`);
    }
    
    // Если нет других фильтров, используем текущие данные
    if (Object.keys(filters.value).length === 0) {
      dataStore.setFilteredData(dataToFilter);
      return;
    }
    
    // Иначе применяем остальные фильтры
    const filteredResult = dataToFilter.filter(item => {
      // Проверяем каждый фильтр
      for (const [column, filter] of Object.entries(filters.value)) {
        const itemValue = item[column];
        
        // Пропускаем, если значение не определено
        if (itemValue === undefined || itemValue === null) continue;
        
        // Конвертируем значение элемента и значение фильтра если нужно
        const convertedItemValue = convertValue(itemValue, column);
        const convertedFilterValue = convertValue(filter.value, column);
        
        // Применяем оператор фильтра
        switch (filter.operator) {
          case 'eq': // равно
            if (convertedItemValue != convertedFilterValue) return false;
            break;
          case 'gt': // больше
            if (!(convertedItemValue > convertedFilterValue)) return false;
            break;
          case 'lt': // меньше
            if (!(convertedItemValue < convertedFilterValue)) return false;
            break;
          case 'gte': // больше или равно
            if (!(convertedItemValue >= convertedFilterValue)) return false;
            break;
          case 'lte': // меньше или равно
            if (!(convertedItemValue <= convertedFilterValue)) return false;
            break;
          case 'contains': // содержит (для строк)
            if (typeof convertedItemValue !== 'string' || !convertedItemValue.toLowerCase().includes(String(convertedFilterValue).toLowerCase())) return false;
            break;
        }
      }
      
      // Если все фильтры прошли, включаем запись
      return true;
    });
    
    // Передаем отфильтрованные данные
    dataStore.setFilteredData(filteredResult);
    console.log('Применены фильтры. Отфильтрованных данных:', filteredResult.length);
  }
  
  return {
    filters,
    excludeKnownWallets,
    initFilters,
    updateFilters,
    toggleExcludeKnownWallets,
    setExcludeKnownWallets,
    setFilter,
    removeFilter,
    clearFilters,
    applyFiltersToData
  };
});
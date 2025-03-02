<template>
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Фильтрация данных</h2>
      
      <div v-if="!dataStore.hasItems" class="text-center py-6">
        <p class="text-gray-500 dark:text-gray-400">Нет данных для фильтрации. Пожалуйста, загрузите файл.</p>
        <router-link to="/" class="btn btn-primary mt-4">Загрузить файл</router-link>
      </div>
      
      <div v-else>
        <!-- Активные фильтры -->
        <div v-if="hasActiveFilters" class="mb-6">
          <h3 class="text-lg font-medium mb-2">Активные фильтры</h3>
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="(filter, column) in filterStore.filters" 
              :key="column"
              class="inline-flex items-center bg-primary-light/10 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark px-3 py-1 rounded-full"
            >
              <span>{{ column }} {{ getOperatorText(filter.operator) }} {{ filter.value }}</span>
              <button 
                class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                @click="removeFilter(column)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <button 
              class="inline-flex items-center text-sm text-red-600 dark:text-red-400 px-3 py-1 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full"
              @click="clearFilters"
            >
              Очистить все фильтры
            </button>
          </div>
        </div>
        
        <!-- Создание нового фильтра -->
        <div class="bg-white dark:bg-surface-dark rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium mb-3">Добавить фильтр</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Выбор столбца -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Столбец</label>
              <select v-model="selectedColumn" class="input">
                <option value="">Выберите столбец</option>
                <option v-for="column in availableColumns" :key="column" :value="column">
                  {{ column }}
                </option>
              </select>
            </div>
            
            <!-- Выбор оператора -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Оператор</label>
              <select v-model="selectedOperator" class="input">
                <option value="">Выберите оператор</option>
                <option v-for="(text, op) in getOperators(selectedColumn)" :key="op" :value="op">
                  {{ text }}
                </option>
              </select>
            </div>
            
            <!-- Ввод значения -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Значение</label>
              <input type="text" v-model="filterValue" class="input" placeholder="Введите значение" />
            </div>
          </div>
          
          <div class="mt-4 flex justify-end">
            <button 
              class="btn btn-primary"
              @click="addFilter"
              :disabled="!canAddFilter"
            >
              Добавить фильтр
            </button>
          </div>
        </div>
        
        <!-- Статистика -->
        <div class="mt-6 bg-white dark:bg-surface-dark rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Отображено {{ filteredCount }} из {{ dataStore.totalItems }} записей
              </p>
            </div>
            
            <div class="flex space-x-3">
              <button 
                class="btn btn-secondary"
                @click="skipFilters"
              >
                Пропустить фильтрацию
              </button>
              
              <button 
                class="btn btn-primary"
                :disabled="filteredCount === 0"
                @click="applyFilters"
              >
                Применить фильтры
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDataStore } from '../stores/dataStore';
  import { useFilterStore } from '../stores/filterStore';
  
  const router = useRouter();
  const dataStore = useDataStore();
  const filterStore = useFilterStore();
  
  // Состояние для создания фильтра
  const selectedColumn = ref('');
  const selectedOperator = ref('');
  const filterValue = ref('');
  
  // Получаем доступные столбцы из данных
  const availableColumns = computed(() => {
    if (!dataStore.hasItems || !dataStore.rawData[0]) return [];
    return Object.keys(dataStore.rawData[0]);
  });
  
  // Проверка наличия активных фильтров
  const hasActiveFilters = computed(() => {
    return Object.keys(filterStore.filters).length > 0;
  });
  
  // Количество отфильтрованных записей
  const filteredCount = computed(() => {
    return filterStore.filteredData.length;
  });
  
  // Проверка возможности добавления фильтра
  const canAddFilter = computed(() => {
    return selectedColumn.value && selectedOperator.value && filterValue.value;
  });
  
  // Сброс выбора оператора при изменении столбца
  watch(selectedColumn, () => {
    selectedOperator.value = '';
  });
  
  // Определение доступных операторов в зависимости от типа данных
  function getOperators(column) {
    if (!column) return {};
    
    // Получаем тип данных в столбце
    const columnType = getColumnType(column);
    
    const baseOperators = {
      'eq': 'равно',
      'gt': 'больше',
      'lt': 'меньше',
      'gte': 'больше или равно',
      'lte': 'меньше или равно'
    };
    
    // Для строк добавляем оператор contains
    if (columnType === 'string') {
      return {
        'eq': 'равно',
        'contains': 'содержит'
      };
    }
    
    return baseOperators;
  }
  
  // Определение типа данных в столбце
  function getColumnType(column) {
    if (!dataStore.hasItems || !dataStore.rawData[0]) return 'string';
    
    const sampleValue = dataStore.rawData[0][column];
    
    if (typeof sampleValue === 'number') return 'number';
    if (typeof sampleValue === 'boolean') return 'boolean';
    return 'string';
  }
  
  // Получение текстового представления оператора
  function getOperatorText(operator) {
    const operators = {
      'eq': '=',
      'gt': '>',
      'lt': '<',
      'gte': '>=',
      'lte': '<=',
      'contains': 'содержит'
    };
    
    return operators[operator] || operator;
  }
  
  // Добавление фильтра
  function addFilter() {
    if (!canAddFilter.value) return;
    
    // Преобразуем значение в соответствии с типом
    let value = filterValue.value;
    const columnType = getColumnType(selectedColumn.value);
    
    if (columnType === 'number') {
      value = parseFloat(value);
      if (isNaN(value)) {
        alert('Пожалуйста, введите числовое значение');
        return;
      }
    } else if (columnType === 'boolean') {
      value = value.toLowerCase() === 'true';
    }
    
    // Устанавливаем фильтр
    filterStore.setFilter(selectedColumn.value, selectedOperator.value, value);
    
    // Сбрасываем поля
    selectedColumn.value = '';
    selectedOperator.value = '';
    filterValue.value = '';
  }
  
  // Удаление фильтра
  function removeFilter(column) {
    filterStore.removeFilter(column);
  }
  
  // Очистка всех фильтров
  function clearFilters() {
    filterStore.clearFilters();
  }
  
  // Пропуск фильтрации и переход к анализу
  function skipFilters() {
    router.push('/analysis');
  }
  
  // Применение фильтров и переход к анализу
  function applyFilters() {
    if (filteredCount.value === 0) {
      alert('Нет записей, удовлетворяющих фильтрам. Измените критерии фильтрации.');
      return;
    }
    
    router.push('/analysis');
  }
  </script>
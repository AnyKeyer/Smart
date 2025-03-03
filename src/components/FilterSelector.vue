<template>
  <div class="space-y-4">
    <!-- Отображение активных фильтров -->
    <div v-if="activeFilters.length > 0" class="mb-4">
      <h3 class="text-lg font-medium mb-2 dark:text-white">Active Filters</h3>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="filter in activeFilters" 
          :key="filter.column"
          class="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full"
        >
          <span>{{ filter.column }} {{ getOperatorSymbol(filter.operator) }} {{ filter.value }}</span>
          <button 
            class="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            @click="removeFilter(filter.column)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <button 
          v-if="activeFilters.length > 0"
          class="inline-flex items-center text-sm text-red-600 dark:text-red-400 px-3 py-1 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full"
          @click="clearAllFilters"
        >
          Clear All Filters
        </button>
      </div>
    </div>
    
    <!-- Форма для создания нового фильтра -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-medium mb-3 dark:text-white">Add Filter</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Выбор колонки -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Column</label>
          <select 
            v-model="selectedColumn" 
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select column</option>
            <option v-for="column in columns" :key="column.name" :value="column.name">
              {{ column.name }}
            </option>
          </select>
        </div>
        
        <!-- Выбор оператора -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Operator</label>
          <select 
            v-model="selectedOperator"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            :disabled="!selectedColumn"
          >
            <option value="">Select operator</option>
            <option v-for="op in availableOperators" :key="op.value" :value="op.value">
              {{ op.label }}
            </option>
          </select>
        </div>
        
        <!-- Ввод значения -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value</label>
          <input 
            v-model="filterValue" 
            type="text" 
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            :disabled="!selectedOperator"
            :placeholder="getInputPlaceholder"
          />
        </div>
      </div>
      
      <div class="mt-4 flex justify-end">
        <button 
          @click="addFilter"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canAddFilter"
        >
          Add Filter
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'FilterSelector',
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    savedFilters: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['filters-changed'],
  setup(props, { emit }) {
    // Локальное состояние фильтров
    const filters = ref({...props.savedFilters});
    
    // Форма для создания нового фильтра
    const selectedColumn = ref('');
    const selectedOperator = ref('');
    const filterValue = ref('');
    
    // Watch for changes to savedFilters prop
    watch(() => props.savedFilters, (newFilters) => {
      if (newFilters && Object.keys(newFilters).length > 0) {
        filters.value = {...newFilters};
      }
    }, { immediate: true });
    
    // Определяем доступные операторы в зависимости от типа колонки
    const availableOperators = computed(() => {
      if (!selectedColumn.value) return [];
      
      const column = props.columns.find(col => col.name === selectedColumn.value);
      if (!column) return [];
      
      const type = column.type;
      
      // Базовые операторы для числовых значений
      const numericOperators = [
        { value: 'eq', label: 'Equals (=)' },
        { value: 'gt', label: 'Greater than (>)' },
        { value: 'lt', label: 'Less than (<)' },
        { value: 'gte', label: 'Greater than or equal (>=)' },
        { value: 'lte', label: 'Less than or equal (<=)' }
      ];
      
      // Операторы для строк
      const stringOperators = [
        { value: 'eq', label: 'Equals (=)' },
        { value: 'contains', label: 'Contains' }
      ];
      
      // Операторы для дат
      const dateOperators = [
        { value: 'eq', label: 'Equals (=)' },
        { value: 'gt', label: 'After (>)' },
        { value: 'lt', label: 'Before (<)' }
      ];
      
      // Возвращаем операторы в зависимости от типа
      if (type === 'float' || type === 'integer') {
        return numericOperators;
      } else if (type === 'datetime') {
        return dateOperators;
      } else {
        return stringOperators;
      }
    });
    
    // Получаем плейсхолдер в зависимости от типа колонки
    const getInputPlaceholder = computed(() => {
      if (!selectedColumn.value) return "Enter value";
      
      const column = props.columns.find(col => col.name === selectedColumn.value);
      if (!column) return "Enter value";
      
      const type = column.type;
      
      // Примеры данных для плейсхолдеров
      if (props.data && props.data.length > 0) {
        // Находим первое непустое значение в данных для этой колонки
        const exampleItem = props.data.find(item => 
          item && 
          selectedColumn.value in item && 
          item[selectedColumn.value] !== null && 
          item[selectedColumn.value] !== undefined
        );
        
        if (exampleItem) {
          const exampleValue = exampleItem[selectedColumn.value];
          
          // Форматируем пример в зависимости от типа
          switch (type) {
            case 'float':
              return `e.g. ${typeof exampleValue === 'number' ? exampleValue.toFixed(1) : '10.5'}`;
            case 'integer':
              return `e.g. ${typeof exampleValue === 'number' ? Math.round(exampleValue) : '42'}`;
            case 'datetime':
              return `e.g. ${exampleValue || 'Jan 01 00:00:00'}`;
            default:
              return `e.g. ${exampleValue || 'search text'}`;
          }
        }
      }
      
      // Если нет примеров из данных, используем дефолтные значения
      switch (type) {
        case 'float':
          return "e.g. 12.5";
        case 'integer':
          return "e.g. 100";
        case 'datetime':
          return "e.g. Jan 01 00:00:00";
        default:
          return "Enter text...";
      }
    });
    
    // Проверяем, можно ли добавить фильтр
    const canAddFilter = computed(() => {
      return selectedColumn.value && selectedOperator.value && filterValue.value;
    });
    
    // Активные фильтры для отображения
    const activeFilters = computed(() => {
      return Object.entries(filters.value).map(([column, filter]) => ({
        column,
        operator: filter.operator,
        value: filter.value
      }));
    });
    
    // Очищаем значения при изменении колонки
    watch(selectedColumn, () => {
      selectedOperator.value = '';
      filterValue.value = '';
    });
    
    // Добавление фильтра
    function addFilter() {
      if (!canAddFilter.value) return;
      
      // Добавляем новый фильтр
      filters.value = {
        ...filters.value,
        [selectedColumn.value]: {
          operator: selectedOperator.value,
          value: filterValue.value
        }
      };
      
      // Оповещаем родительский компонент об изменении фильтров
      emit('filters-changed', filters.value);
      
      // Сбрасываем форму
      selectedColumn.value = '';
      selectedOperator.value = '';
      filterValue.value = '';
    }
    
    // Удаление фильтра
    function removeFilter(column) {
      const updatedFilters = {...filters.value};
      delete updatedFilters[column];
      filters.value = updatedFilters;
      
      // Оповещаем родительский компонент об изменении фильтров
      emit('filters-changed', filters.value);
    }
    
    // Очистка всех фильтров
    function clearAllFilters() {
      filters.value = {};
      
      // Оповещаем родительский компонент об изменении фильтров
      emit('filters-changed', filters.value);
    }
    
    // Получение символа оператора для отображения
    function getOperatorSymbol(operator) {
      const symbols = {
        'eq': '=',
        'gt': '>',
        'lt': '<',
        'gte': '≥',
        'lte': '≤',
        'contains': 'contains'
      };
      return symbols[operator] || operator;
    }
    
    return {
      filters,
      selectedColumn,
      selectedOperator,
      filterValue,
      availableOperators,
      getInputPlaceholder,
      canAddFilter,
      activeFilters,
      addFilter,
      removeFilter,
      clearAllFilters,
      getOperatorSymbol
    };
  }
};
</script>
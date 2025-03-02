<template>
    <div class="w-full">
      <div 
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-light dark:hover:border-primary-dark transition-colors"
        :class="{ 'bg-gray-50 dark:bg-gray-800': isDragging }"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
        @click="triggerFileInput"
      >
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept=".xlsx,.xls,.csv"
          @change="onFileSelected"
        />
        
        <div v-if="isLoading" class="flex flex-col items-center justify-center">
          <div class="w-12 h-12 border-4 border-primary-light dark:border-primary-dark border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-gray-600 dark:text-gray-300">Обработка файла...</p>
        </div>
        
        <div v-else class="flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h4 class="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            {{ selectedFile ? selectedFile.name : 'Выберите Excel-файл' }}
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ selectedFile ? `${formatFileSize(selectedFile.size)}` : 'Перетащите файл сюда или нажмите для выбора' }}
          </p>
        </div>
      </div>
      
      <div v-if="error" class="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
        <p>{{ error }}</p>
      </div>
      
      <div v-if="selectedFile && !isLoading" class="mt-4 flex justify-center">
        <button 
          class="btn btn-primary mr-3"
          @click="processFile"
          :disabled="isLoading"
        >
          Анализировать файл
        </button>
        <button 
          class="btn btn-secondary"
          @click="resetFile"
          :disabled="isLoading"
        >
          Сбросить
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, inject } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDataStore } from '../stores/dataStore';
  import { useFilterStore } from '../stores/filterStore';
  import { parseExcelFile } from '../utils/excelParser';
  
  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['file-loaded', 'error']);
  
  const router = useRouter();
  const dataStore = useDataStore();
  const filterStore = useFilterStore();
  
  const fileInput = ref(null);
  const selectedFile = ref(null);
  const isLoading = ref(false);
  const isDragging = ref(false);
  const error = ref(null);
  
  function triggerFileInput() {
    if (props.disabled || isLoading.value) return;
    fileInput.value.click();
  }
  
  function onDragOver(event) {
    if (props.disabled || isLoading.value) return;
    isDragging.value = true;
  }
  
  function onDragLeave() {
    isDragging.value = false;
  }
  
  function onDrop(event) {
    if (props.disabled || isLoading.value) return;
    isDragging.value = false;
    
    const files = event.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  }
  
  function onFileSelected(event) {
    if (props.disabled || isLoading.value) return;
    
    const files = event.target.files;
    if (files.length) {
      handleFile(files[0]);
    }
  }
  
  function handleFile(file) {
    const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    
    // Проверка типа файла
    if (!validTypes.includes(file.type) && 
        !file.name.endsWith('.xlsx') && 
        !file.name.endsWith('.xls') && 
        !file.name.endsWith('.csv')) {
      error.value = 'Пожалуйста, выберите файл Excel (.xlsx, .xls) или CSV';
      emit('error', error.value);
      return;
    }
    
    selectedFile.value = file;
    error.value = null;
  }
  
  async function processFile() {
    if (!selectedFile.value || isLoading.value) return;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const data = await parseExcelFile(selectedFile.value);
      
      if (!data || data.length === 0) {
        throw new Error('Файл не содержит данных');
      }
      
      // Сохраняем данные в хранилище
      dataStore.setRawData(data);
      
      // Инициализируем фильтры из сохраненных ранее
      filterStore.initFilters();
      
      // Уведомляем о загрузке
      emit('file-loaded', data);
      
      // Переходим к фильтрам
      router.push('/filter');
    } catch (err) {
      console.error('Ошибка при обработке файла:', err);
      error.value = `Ошибка при обработке файла: ${err.message}`;
      emit('error', error.value);
    } finally {
      isLoading.value = false;
    }
  }
  
  function resetFile() {
    selectedFile.value = null;
    error.value = null;
    
    // Сбрасываем input для возможности повторного выбора того же файла
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
  
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  </script>
<template>
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-center dark:text-white">Excel Wallet Analyzer</h1>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 dark:text-white">Upload Excel File</h2>
          
          <FileUploader @file-loaded="handleFileLoaded" />
          
          <div class="mt-8 text-center" v-if="isFileLoaded">
            <p class="mb-4 text-green-600 dark:text-green-400">
              File loaded successfully! Found {{ totalRecords }} records.
            </p>
            
            <button 
              @click="proceedToFilter"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Proceed to Filters
            </button>
            
            <button 
              @click="proceedToAnalysis"
              class="ml-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none"
            >
              Skip Filters
            </button>
          </div>
        </div>
        
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 dark:text-white">About This Tool</h2>
          
          <div class="prose dark:prose-invert max-w-none">
            <p>
              This tool allows you to analyze wallet data from Excel spreadsheets. It helps you filter and review wallet data 
              to identify the most promising wallets based on different trading strategies.
            </p>
            
            <h3>Key Features:</h3>
            <ul>
              <li>Import Excel files with wallet trading data</li>
              <li>Apply filters to narrow down your analysis</li>
              <li>Review each wallet with detailed metrics</li>
              <li>Calculate strategy scores (Aggressive, Conservative, Universal)</li>
              <li>Export selected wallets for further analysis</li>
            </ul>
            
            <p>
              To get started, upload an Excel file containing wallet data with the required columns.
            </p>
          </div>
        </div>
        
        <div class="mt-4 text-right">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDataStore } from '@/stores/dataStore';
  import FileUploader from '@/components/FileUploader.vue';
  import ThemeToggle from '@/components/ThemeToggle.vue';
  
  export default {
    name: 'UploadView',
    components: {
      FileUploader,
      ThemeToggle
    },
    setup() {
      const router = useRouter();
      const dataStore = useDataStore();
      
      const isFileLoaded = computed(() => {
        return dataStore.rawData && Array.isArray(dataStore.rawData) && dataStore.rawData.length > 0;
      });
      
      const totalRecords = computed(() => {
        return dataStore.rawData && Array.isArray(dataStore.rawData) ? dataStore.rawData.length : 0;
      });
      
      const handleFileLoaded = (data) => {
        // Use setRawData instead of setData
        dataStore.setRawData(data);
      };
      
      const proceedToFilter = () => {
        router.push('/filter');
      };
      
      const proceedToAnalysis = () => {
        // Skip filters and go directly to analysis
        router.push('/analysis');
      };
      
      return {
        isFileLoaded,
        totalRecords,
        handleFileLoaded,
        proceedToFilter,
        proceedToAnalysis
      };
    }
  };
  </script>
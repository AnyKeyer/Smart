<template>
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-center dark:text-white">Filter Wallet Data</h1>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 dark:text-white">
            Apply Filters
            <span class="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({{ filteredCount }} of {{ totalCount }} wallets match current filters)
            </span>
          </h2>
          
          <FilterSelector 
            :columns="columns" 
            :data="data" 
            @filters-changed="handleFiltersChanged" 
            :saved-filters="savedFilters"
          />
          
          <div class="mt-8 text-center">
            <div class="mb-4">
              <label class="inline-flex items-center mr-4 dark:text-white">
                <input 
                  type="checkbox" 
                  v-model="saveFiltersForNextTime"
                  class="form-checkbox h-5 w-5 text-blue-600"
                >
                <span class="ml-2">Save filters for next session</span>
              </label>
            </div>
            
            <button 
              @click="goBack"
              class="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none mr-4"
            >
              Back
            </button>
            
            <button 
              @click="proceedToAnalysis"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              :disabled="filteredCount === 0"
            >
              Start Analysis
            </button>
          </div>
        </div>
        
        <div class="mt-4 text-right">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDataStore } from '@/stores/dataStore';
  import { useFilterStore } from '@/stores/filterStore';
  import FilterSelector from '@/components/FilterSelector.vue';
  import ThemeToggle from '@/components/ThemeToggle.vue';
  import { useStorageManager } from '@/utils/storageManager';
  
  export default {
    name: 'FilterView',
    components: {
      FilterSelector,
      ThemeToggle
    },
    setup() {
      const router = useRouter();
      const dataStore = useDataStore();
      const filterStore = useFilterStore();
      const { loadFilters, saveFilters } = useStorageManager();
      
      const saveFiltersForNextTime = ref(true);
      
      // Use rawData instead of data
      const data = computed(() => dataStore.rawData || []);
      const totalCount = computed(() => dataStore.rawData && Array.isArray(dataStore.rawData) ? dataStore.rawData.length : 0);
      
      // Assuming filteredData exists in dataStore or adding a fallback
      const filteredCount = computed(() => {
        if (dataStore.filteredData && Array.isArray(dataStore.filteredData)) {
          return dataStore.filteredData.length;
        }
        return 0;
      });
      
      // Get columns from the first data item
      const columns = computed(() => {
        if (!data.value || data.value.length === 0) return [];
        
        return Object.keys(data.value[0]).map(key => {
          // Determine the column type based on the first non-null value
          let type = 'string';
          for (const item of data.value) {
            if (item[key] !== null && item[key] !== undefined) {
              const val = item[key];
              if (typeof val === 'number') {
                type = Number.isInteger(val) ? 'integer' : 'float';
              } else if (val instanceof Date || !isNaN(new Date(val).getTime())) {
                type = 'datetime';
              }
              break;
            }
          }
          
          return {
            name: key,
            type: type
          };
        });
      });
      
      // Load saved filters
      const savedFilters = ref({});
      
      onMounted(() => {
        const loadedFilters = loadFilters();
        if (loadedFilters) {
          savedFilters.value = loadedFilters;
          // Apply saved filters if initFilters exists, otherwise fall back to other methods
          if (typeof filterStore.initFilters === 'function') {
            filterStore.initFilters(loadedFilters);
          } else if (typeof filterStore.updateFilters === 'function') {
            filterStore.updateFilters(loadedFilters);
          } else {
            console.warn('No appropriate method found to set filters in filterStore');
          }
          
          // Check if applyFilters exists on dataStore
          if (typeof dataStore.applyFilters === 'function') {
            dataStore.applyFilters(filterStore.filters || loadedFilters);
          }
        }
      });
      
      const handleFiltersChanged = (filters) => {
        // Try different possible method names that might exist in your filterStore
        if (typeof filterStore.updateFilters === 'function') {
          filterStore.updateFilters(filters);
        } else if (typeof filterStore.initFilters === 'function') {
          filterStore.initFilters(filters);
        } else {
          console.warn('No appropriate method found to update filters in filterStore');
        }
        
        // Check if applyFilters exists on dataStore
        if (typeof dataStore.applyFilters === 'function') {
          dataStore.applyFilters(filters);
        }
      };
      
      const proceedToAnalysis = () => {
        if (saveFiltersForNextTime.value) {
          saveFilters(filterStore.filters);
        } else {
          // Clear saved filters if not saving
          saveFilters(null);
        }
        
        router.push('/analysis');
      };
      
      const goBack = () => {
        router.push('/');
      };
      
      // Watch for data changes with proper null checking
      watch(() => dataStore.rawData, (newData) => {
        if (!newData || newData.length === 0) {
          // If there's no data, redirect to upload
          router.push('/');
        }
      }, { immediate: true });
      
      return {
        data,
        columns,
        totalCount,
        filteredCount,
        savedFilters,
        saveFiltersForNextTime,
        handleFiltersChanged,
        proceedToAnalysis,
        goBack
      };
    }
  };
  </script>
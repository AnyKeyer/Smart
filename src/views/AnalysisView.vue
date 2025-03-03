<template>
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold dark:text-white">Wallet Analysis</h1>
          
          <div>
            <button 
              @click="goBack"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none mr-2"
            >
              Back
            </button>
            
            <ThemeToggle />
          </div>
        </div>
        
        <div v-if="noData" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">
            No data to analyze. Please upload an Excel file with wallet data.
          </p>
          <button 
            @click="goToUpload"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Upload Data
          </button>
        </div>
        
        <div v-else-if="dataProcessed" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1">
          <div class="flex items-center justify-between px-6 py-3 border-b dark:border-gray-700">
            <h2 class="text-xl font-semibold dark:text-white">Wallets {{ currentIndex + 1 }} of {{ totalCards }}</h2>
            <!-- <div class="text-sm text-gray-500 dark:text-gray-400">
              Selected: {{ selectedCount }}
            </div> -->
          </div>
          
          <CardViewer :card-index="currentIndex" />
          
          <CardNavigation 
            :current-index="currentIndex" 
            @previous="currentIndex--" 
            @next="currentIndex++"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDataStore } from '@/stores/dataStore';
import { useResultsStore } from '@/stores/resultsStore';
import CardViewer from '@/components/CardViewer.vue';
import CardNavigation from '@/components/CardNavigation.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { useKnownWalletsStore } from '@/stores/knownWalletsStore';

export default {
  name: 'AnalysisView',
  components: {
    CardViewer,
    CardNavigation,
    ThemeToggle
  },
  setup() {
    const router = useRouter();
    const dataStore = useDataStore();
    const resultsStore = useResultsStore();
    
    const currentIndex = ref(0);
    const dataProcessed = ref(false);
    
    const noData = computed(() => !dataStore.filteredData || dataStore.filteredData.length === 0);
    const totalCards = computed(() => dataStore.filteredData ? dataStore.filteredData.length : 0);
    const selectedCount = computed(() => resultsStore.selectedWallets ? resultsStore.selectedWallets.length : 0);
    
    // Process data when component is mounted - используем только один watch
    watch(() => dataStore.filteredData, (newData) => {
      if (newData && newData.length > 0) {
        dataProcessed.value = true;
      } else {
        dataProcessed.value = false;
      }
    }, { immediate: true });
    
    const goBack = () => {
      router.push('/filter');
    };
    
    const goToUpload = () => {
      router.push('/');
    };
    
    return {
      currentIndex,
      noData,
      dataProcessed,
      totalCards,
      selectedCount,
      goBack,
      goToUpload
    };
  }
};
  </script>
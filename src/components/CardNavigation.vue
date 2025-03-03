<template>
  <div class="navigation-container w-full max-w-4xl mx-auto mt-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
    <!-- Navigation buttons -->
    <div class="flex space-x-2 justify-center md:justify-start">
      <button 
        @click="handlePrevious"
        class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isFirstCard"
      >
        Previous
      </button>
      
      <span class="flex items-center px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg">
        {{ currentIndex + 1 }} / {{ totalFilteredItems }}
      </span>
      
      <button 
        @click="handleNext"
        class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLastCard"
      >
        Next
      </button>
    </div>
    
    <!-- Action buttons -->
    <div class="flex space-x-2 justify-center md:justify-end flex-grow">
      <button 
        @click="handleAddWallet"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Add
      </button>
      
      <button 
        @click="handleSkipWallet"
        class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
      >
        Skip
      </button>
      
      <button 
        @click="handleFinishAnalysis"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Finish Analysis
      </button>
    </div>
  </div>
</template>

<script>
import { computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDataStore } from '@/stores/dataStore';
import { useResultsStore } from '@/stores/resultsStore';
import { useKnownWalletsStore } from '@/stores/knownWalletsStore';

export default {
  name: 'CardNavigation',
  props: {
    currentIndex: {
      type: Number,
      required: true
    },
    onPrevious: {
      type: Function,
      default: () => {}
    },
    onNext: {
      type: Function,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const router = useRouter();
    const dataStore = useDataStore();
    const resultsStore = useResultsStore();
    const knownWalletsStore = useKnownWalletsStore();
    
    // Использование вычисляемого свойства для получения количества элементов
    const totalFilteredItems = computed(() => dataStore.filteredCount);
    
    const isFirstCard = computed(() => props.currentIndex === 0);
    const isLastCard = computed(() => props.currentIndex === totalFilteredItems.value - 1);
    
    // Наблюдение за текущим элементом через вычисляемое свойство
    const currentWallet = computed(() => {
      const item = dataStore.filteredData[props.currentIndex];
      return item ? item.Wallet : null;
    });
    
    // Отладочная проверка при монтировании компонента
    onMounted(() => {
      console.log('CardNavigation mounted', {
        filteredCount: dataStore.filteredCount,
        currentIndex: props.currentIndex,
        totalFilteredItems: totalFilteredItems.value
      });
    });
    
    // Наблюдение за изменениями в отфильтрованных данных
    watch(() => dataStore.filteredCount, (newCount) => {
      console.log('CardNavigation: filteredCount changed to', newCount);
    });
    
    const handlePrevious = () => {
      if (!isFirstCard.value) {
        props.onPrevious();
      }
    };
    
    const handleNext = () => {
      if (!isLastCard.value) {
        props.onNext();
      }
    };
    
    const handleAddWallet = () => {
      if (currentWallet.value) {
        // Добавляем кошелек в результаты
        resultsStore.addWallet(currentWallet.value);
        
        // Добавляем кошелек в известные кошельки
        knownWalletsStore.addKnownWallet(currentWallet.value, 'Added manually');
        console.log('Wallet added to known wallets:', currentWallet.value);
      }
      
      if (!isLastCard.value) {
        props.onNext();
      } else {
        router.push('/results');
      }
    };
    
    const handleSkipWallet = () => {
      if (currentWallet.value) {
        // Добавляем пропущенный кошелек в известные кошельки
        knownWalletsStore.addKnownWallet(currentWallet.value, 'Skipped');
        console.log('Skipped wallet added to known wallets:', currentWallet.value);
      }
      
      if (!isLastCard.value) {
        props.onNext();
      } else {
        router.push('/results');
      }
    };
    
    const handleFinishAnalysis = () => {
      router.push('/results');
    };
    
    return {
      totalFilteredItems,
      isFirstCard,
      isLastCard,
      currentWallet,
      handlePrevious,
      handleNext,
      handleAddWallet,
      handleSkipWallet,
      handleFinishAnalysis
    };
  }
};
</script>
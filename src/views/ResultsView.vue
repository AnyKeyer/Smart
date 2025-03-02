<template>
    <div class="min-h-screen p-4 md:p-8 dark:bg-gray-900 bg-gray-100">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 dark:text-white text-gray-800">Результаты анализа</h1>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold dark:text-white text-gray-800">Сохраненные кошельки ({{ savedWallets.length }})</h2>
            <div class="flex space-x-3">
              <button 
                @click="copyAllWallets" 
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                :disabled="!savedWallets.length"
                :class="{ 'opacity-50 cursor-not-allowed': !savedWallets.length }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Копировать все
              </button>
              <button 
                @click="exportToExcel" 
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                :disabled="!savedWallets.length"
                :class="{ 'opacity-50 cursor-not-allowed': !savedWallets.length }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                Экспорт в Excel
              </button>
            </div>
          </div>
          
          <div v-if="notification" class="mb-4 p-3 rounded-md" :class="notificationStyle">
            {{ notification }}
          </div>
          
          <div v-if="!savedWallets.length" class="text-center py-12 dark:text-gray-400 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p class="text-lg font-medium mb-2">Нет сохраненных кошельков</p>
            <p>Вернитесь к просмотру карточек и добавьте интересующие вас кошельки</p>
            <button @click="goToAnalysis" class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Вернуться к анализу
            </button>
          </div>
          
          <div v-else class="border dark:border-gray-700 border-gray-200 rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      №
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Wallet
                    </th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(wallet, index) in savedWallets" :key="wallet" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ index + 1 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-800 dark:text-gray-200">
                      {{ wallet }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div class="flex justify-end space-x-2">
                        <button @click="copyWallet(wallet)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                          </svg>
                        </button>
                        <a 
                          :href="`https://solscan.io/account/${wallet}`" 
                          target="_blank" 
                          class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                          title="Просмотреть на Solscan"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                        <a 
                          :href="`https://gmgn.ai/sol/address/${wallet}`" 
                          target="_blank" 
                          class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          title="Просмотреть на GMGN"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                        <button 
                          @click="removeWallet(wallet)" 
                          class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Удалить"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between">
          <button 
            @click="goToAnalysis" 
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Вернуться к анализу
          </button>
          <button 
            @click="goToUpload" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Загрузить новый файл
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useResultsStore } from '../stores/resultsStore';
  import * as XLSX from 'xlsx';
  
  const router = useRouter();
  const resultsStore = useResultsStore();
  
  const savedWallets = ref([]);
  const notification = ref('');
  const notificationType = ref(''); // 'success', 'error'
  
  // Загружаем сохраненные кошельки из хранилища
  onMounted(() => {
    savedWallets.value = resultsStore.getSavedWallets();
  });
  
  // Вычисляемое свойство для стилей уведомления
  const notificationStyle = computed(() => {
    return {
      'bg-green-100 text-green-800 border-green-200': notificationType.value === 'success',
      'bg-red-100 text-red-800 border-red-200': notificationType.value === 'error'
    };
  });
  
  // Копирование одного кошелька
  const copyWallet = (wallet) => {
    navigator.clipboard.writeText(wallet)
      .then(() => {
        showNotification('Кошелек скопирован в буфер обмена', 'success');
      })
      .catch(() => {
        showNotification('Не удалось скопировать кошелек', 'error');
      });
  };
  
  // Копирование всех кошельков
  const copyAllWallets = () => {
    const walletsText = savedWallets.value.join('\n');
    navigator.clipboard.writeText(walletsText)
      .then(() => {
        showNotification('Все кошельки скопированы в буфер обмена', 'success');
      })
      .catch(() => {
        showNotification('Не удалось скопировать кошельки', 'error');
      });
  };
  
  // Экспорт в Excel
  const exportToExcel = () => {
    try {
      // Создаем рабочую книгу и лист
      const wb = XLSX.utils.book_new();
      
      // Преобразуем данные в формат для Excel
      const data = savedWallets.value.map(wallet => ({ Wallet: wallet }));
      
      // Создаем лист с данными
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Добавляем лист в книгу
      XLSX.utils.book_append_sheet(wb, ws, 'Wallets');
      
      // Генерируем имя файла с текущей датой/временем
      const fileName = `wallets_export_${new Date().toISOString().slice(0,10)}.xlsx`;
      
      // Записываем файл и предлагаем его скачать
      XLSX.writeFile(wb, fileName);
      
      showNotification('Файл успешно экспортирован', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Ошибка при экспорте файла', 'error');
    }
  };
  
  // Удаление кошелька из списка
  const removeWallet = (wallet) => {
    resultsStore.removeWallet(wallet);
    savedWallets.value = resultsStore.getSavedWallets();
    showNotification('Кошелек удален из списка', 'success');
  };
  
  // Показ уведомления
  const showNotification = (message, type) => {
    notification.value = message;
    notificationType.value = type;
    
    // Автоматически скрываем уведомление через 3 секунды
    setTimeout(() => {
      notification.value = '';
    }, 3000);
  };
  
  // Навигация к экрану анализа
  const goToAnalysis = () => {
    router.push('/analysis');
  };
  
  // Навигация к экрану загрузки
  const goToUpload = () => {
    router.push('/');
  };
  </script>
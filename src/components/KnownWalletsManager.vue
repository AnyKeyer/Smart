<template>
    <div class="known-wallets-manager">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
        <h2 class="text-xl font-semibold mb-4 dark:text-white">Known Wallets Manager</h2>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2 dark:text-white">Add Known Wallets</h3>
          
          <div class="mb-4">
            <textarea
              v-model="walletsInput"
              placeholder="Paste wallet addresses here, one per line"
              class="w-full h-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            ></textarea>
          </div>
          
          <div class="flex space-x-2">
            <button
              @click="addWallets"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              :disabled="!walletsInput.trim()"
            >
              Add Wallets
            </button>
            
            <button
              @click="importFromFile"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
            >
              Import from File
            </button>
            
            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              accept=".csv,.xlsx,.xls,.json,.txt"
              class="hidden"
            />
          </div>
        </div>
        
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-medium dark:text-white">Known Wallets ({{ knownWallets.length }})</h3>
            
            <div class="flex space-x-2">
              <button
                @click="exportWallets('csv')"
                class="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none text-sm"
                :disabled="!knownWallets.length"
              >
                Export CSV
              </button>
              
              <button
                @click="exportWallets('json')"
                class="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none text-sm"
                :disabled="!knownWallets.length"
              >
                Export JSON
              </button>
              
              <button
                @click="clearWallets"
                class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none text-sm"
                :disabled="!knownWallets.length"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div v-if="knownWallets.length" class="border dark:border-gray-700 rounded-lg overflow-hidden">
            <div class="max-h-64 overflow-y-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wallet</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Added</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  <tr v-for="wallet in knownWallets" :key="wallet.wallet">
                    <td class="px-6 py-2 text-sm font-mono text-gray-900 dark:text-gray-100">
                      {{ formatWalletAddress(wallet.wallet) }}
                    </td>
                    <td class="px-6 py-2 text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(wallet.dateAdded) }}
                    </td>
                    <td class="px-6 py-2 text-sm text-right">
                      <button
                        @click="removeWallet(wallet.wallet)"
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 border rounded-lg dark:border-gray-700">
            No known wallets added yet. Add wallets above to exclude them from analysis.
          </div>
        </div>
        
        <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div class="flex items-center">
            <label class="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                class="sr-only peer" 
                v-model="excludeKnownWallets"
                @change="toggleExcludeKnownWallets"
              >
              <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
              <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Exclude known wallets automatically when filtering
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useKnownWalletsStore } from '@/stores/knownWalletsStore';
  import { useFilterStore } from '@/stores/filterStore';
  
  export default {
    name: 'KnownWalletsManager',
    setup() {
      const knownWalletsStore = useKnownWalletsStore();
      const filterStore = useFilterStore();
      
      const walletsInput = ref('');
      const fileInput = ref(null);
      const excludeKnownWallets = ref(filterStore.excludeKnownWallets);
      
      const knownWallets = computed(() => knownWalletsStore.knownWallets);
      
      // Инициализация при монтировании
      onMounted(async () => {
        if (!knownWalletsStore.dbReady) {
          await knownWalletsStore.initDatabase();
        }
      });
      
      // Добавление кошельков из текстового поля
      const addWallets = async () => {
        const walletsText = walletsInput.value.trim();
        if (!walletsText) return;
        
        // Разбиваем по строкам и очищаем от пробелов
        const walletsList = walletsText
          .split(/[\n,]/)
          .map(wallet => wallet.trim())
          .filter(wallet => wallet); // Только непустые значения
        
        if (walletsList.length > 0) {
          await knownWalletsStore.addMultipleWallets(walletsList);
          walletsInput.value = '';
          
          // Обновляем фильтрацию, если исключение активно
          if (excludeKnownWallets.value) {
            filterStore.applyFiltersToData();
          }
        }
      };
      
      // Удаление кошелька
      const removeWallet = async (wallet) => {
        await knownWalletsStore.removeKnownWallet(wallet);
        
        // Обновляем фильтрацию, если исключение активно
        if (excludeKnownWallets.value) {
          filterStore.applyFiltersToData();
        }
      };
      
      // Очистка всех кошельков
      const clearWallets = async () => {
        if (confirm('Are you sure you want to remove all known wallets?')) {
          await knownWalletsStore.clearKnownWallets();
          
          // Обновляем фильтрацию, если исключение активно
          if (excludeKnownWallets.value) {
            filterStore.applyFiltersToData();
          }
        }
      };
      
      // Импорт из файла
      const importFromFile = () => {
        if (fileInput.value) {
          fileInput.value.click();
        }
      };
      
      // Обработка загруженного файла
      const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          let wallets = [];
          
          if (file.name.endsWith('.csv')) {
            // Парсинг CSV
            const content = e.target.result;
            const rows = content.split('\n');
            
            // Пропускаем первую строку, если это заголовок
            const startIndex = rows[0].toLowerCase().includes('wallet') ? 1 : 0;
            
            for (let i = startIndex; i < rows.length; i++) {
              const row = rows[i].trim();
              if (!row) continue;
              
              const columns = row.split(',');
              if (columns.length > 0 && columns[0]) {
                wallets.push({
                  wallet: columns[0].trim(),
                  description: columns.length > 1 ? columns[1].trim() : '',
                  dateAdded: columns.length > 2 ? columns[2].trim() : new Date().toISOString()
                });
              }
            }
          } else if (file.name.endsWith('.json')) {
            // Парсинг JSON
            try {
              const content = JSON.parse(e.target.result);
              if (Array.isArray(content)) {
                wallets = content.map(item => {
                  if (typeof item === 'string') {
                    return { wallet: item, description: '', dateAdded: new Date().toISOString() };
                  }
                  return {
                    wallet: item.wallet || '',
                    description: item.description || '',
                    dateAdded: item.dateAdded || new Date().toISOString()
                  };
                }).filter(item => item.wallet);
              }
            } catch (error) {
              console.error('Ошибка при парсинге JSON:', error);
              alert('Could not parse JSON file. Make sure it contains valid JSON array.');
              return;
            }
          } else if (file.name.endsWith('.txt')) {
            // Парсинг простого текстового файла (по строкам)
            const content = e.target.result;
            const lines = content.split('\n');
            
            wallets = lines
              .map(line => line.trim())
              .filter(line => line)
              .map(wallet => ({ 
                wallet, 
                description: '', 
                dateAdded: new Date().toISOString() 
              }));
          } else {
            alert('Unsupported file format. Please use CSV, JSON, or TXT files.');
            return;
          }
          
          if (wallets.length > 0) {
            const result = await knownWalletsStore.addMultipleWallets(wallets);
            
            // Обновляем фильтрацию, если исключение активно
            if (excludeKnownWallets.value) {
              filterStore.applyFiltersToData();
            }
            
            alert(`Successfully imported ${result.added} wallets. ${result.errors} duplicates skipped.`);
          } else {
            alert('No valid wallet addresses found in the file.');
          }
          
          // Сбрасываем input для возможности повторной загрузки того же файла
          event.target.value = null;
        };
        
        if (file.name.endsWith('.json') || file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
          reader.readAsText(file);
        } else {
          alert('Unsupported file format. Please use CSV, JSON, or TXT files.');
          event.target.value = null;
        }
      };
      
      // Экспорт кошельков
      const exportWallets = (format) => {
        if (!knownWallets.value.length) return;
        
        let content, filename, type;
        
        if (format === 'csv') {
          content = knownWalletsStore.exportKnownWalletsToCSV();
          filename = 'known-wallets.csv';
          type = 'text/csv';
        } else {
          content = knownWalletsStore.exportKnownWallets();
          filename = 'known-wallets.json';
          type = 'application/json';
        }
        
        // Создаем ссылку для скачивания
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(url);
      };
      
      // Форматирование адреса кошелька (сокращение для отображения)
      const formatWalletAddress = (address) => {
        if (!address || address.length < 10) return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      };
      
      // Форматирование даты
      const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString();
        } catch {
          return dateString;
        }
      };
      
      // Переключение исключения известных кошельков
      const toggleExcludeKnownWallets = () => {
        filterStore.setExcludeKnownWallets(excludeKnownWallets.value);
      };
      
      return {
        walletsInput,
        fileInput,
        knownWallets,
        excludeKnownWallets,
        addWallets,
        removeWallet,
        clearWallets,
        importFromFile,
        handleFileUpload,
        exportWallets,
        formatWalletAddress,
        formatDate,
        toggleExcludeKnownWallets
      };
    }
  };
  </script>
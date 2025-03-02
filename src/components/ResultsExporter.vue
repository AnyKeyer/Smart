<template>
    <div class="results-exporter w-full max-w-4xl mx-auto p-6 rounded-lg dark:bg-gray-800 bg-white shadow-lg">
      <h2 class="text-2xl font-bold mb-4 dark:text-white text-gray-800">Selected Wallets</h2>
      
      <div v-if="selectedWallets.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400">
        No wallets have been selected.
      </div>
      
      <div v-else>
        <!-- List of selected wallets -->
        <div class="max-h-96 overflow-y-auto mb-6 border dark:border-gray-700 rounded-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  #
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Wallet Address
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(wallet, index) in selectedWallets" :key="wallet">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ wallet }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="removeWallet(wallet)" 
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Export actions -->
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div class="relative flex-grow">
            <textarea 
              ref="textareaRef"
              readonly
              class="w-full h-24 p-3 border rounded-lg text-sm font-mono bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none resize-none"
              :value="walletsText"
            ></textarea>
            <div class="absolute top-2 right-2">
              <button 
                @click="copyToClipboard" 
                class="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                :class="{ 'bg-green-200 dark:bg-green-800': copied }"
              >
                <span v-if="copied">Copied!</span>
                <span v-else>Copy</span>
              </button>
            </div>
          </div>
          
          <div class="flex flex-col space-y-2">
            <button 
              @click="exportToExcel" 
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
            >
              Export to Excel
            </button>
            
            <button 
              @click="clearAllWallets" 
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Clear All
            </button>
            
            <button 
              @click="goBackToUpload" 
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useResultsStore } from '@/stores/resultsStore';
  import { useDataStore } from '@/stores/dataStore';
  
  export default {
    name: 'ResultsExporter',
    setup() {
      const router = useRouter();
      const resultsStore = useResultsStore();
      const dataStore = useDataStore();
      
      const textareaRef = ref(null);
      const copied = ref(false);
      
      const selectedWallets = computed(() => resultsStore.selectedWallets);
      
      const walletsText = computed(() => {
        return selectedWallets.value.join('\n');
      });
      
      const copyToClipboard = async () => {
        if (textareaRef.value) {
          try {
            await navigator.clipboard.writeText(walletsText.value);
            copied.value = true;
            setTimeout(() => {
              copied.value = false;
            }, 2000);
          } catch (err) {
            // Fallback for browsers that don't support clipboard API
            textareaRef.value.select();
            document.execCommand('copy');
            copied.value = true;
            setTimeout(() => {
              copied.value = false;
            }, 2000);
          }
        }
      };
      
      const exportToExcel = () => {
        // Get wallet data from the original dataset
        const walletData = dataStore.data.filter(item => 
          selectedWallets.value.includes(item.Wallet)
        );
        
        // Create a CSV string
        let csvContent = "";
        
        // Add headers
        if (walletData.length > 0) {
          const headers = Object.keys(walletData[0]);
          csvContent += headers.join(",") + "\n";
          
          // Add data rows
          walletData.forEach(item => {
            const values = headers.map(header => {
              const value = item[header];
              // Handle strings with commas by wrapping in quotes
              if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
              }
              return value;
            });
            csvContent += values.join(",") + "\n";
          });
        } else {
          // If no data, just export addresses
          csvContent = "Wallet\n" + selectedWallets.value.join("\n");
        }
        
        // Create a Blob with the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Create a download link and trigger download
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "selected_wallets.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
      const removeWallet = (wallet) => {
        resultsStore.removeWallet(wallet);
      };
      
      const clearAllWallets = () => {
        resultsStore.clearWallets();
      };
      
      const goBackToUpload = () => {
        // Clear data and navigate to upload page
        dataStore.clearData();
        resultsStore.clearWallets();
        router.push('/');
      };
      
      return {
        selectedWallets,
        walletsText,
        textareaRef,
        copied,
        copyToClipboard,
        exportToExcel,
        removeWallet,
        clearAllWallets,
        goBackToUpload
      };
    }
  };
  </script>
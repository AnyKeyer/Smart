<template>
    <div class="card-container w-full max-w-4xl mx-auto p-4 rounded-lg dark:bg-gray-800 bg-white shadow-lg">
      <h2 class="text-2xl font-bold mb-4 dark:text-white text-gray-800">Wallet Analysis</h2>
      
      <div v-if="currentCard" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Wallet and basic info -->
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg col-span-1 md:col-span-2">
          <h3 class="text-xl font-semibold dark:text-white text-gray-800 mb-2">{{ truncateWallet(currentCard.Wallet) }}</h3>
          <div class="flex space-x-4">
            <a :href="`https://solscan.io/account/${currentCard.Wallet}`" target="_blank" 
               class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
              Solscan
            </a>
            <a :href="`https://gmgn.ai/sol/address/${currentCard.Wallet}`" target="_blank"
               class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm">
              GMGN
            </a>
          </div>
        </div>
        
        <!-- Key metrics -->
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2 dark:text-gray-200 text-gray-700">Key Performance</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Win Rate (WR)</div>
              <div class="text-lg font-medium dark:text-white">{{ formatNumber(currentCard.WR, 2) }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Return on Investment</div>
              <div class="text-lg font-medium dark:text-white" :class="getColorClass(currentCard.ROI)">
                {{ formatNumber(currentCard.ROI, 2) }}%
              </div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">PNL</div>
              <div class="text-lg font-medium dark:text-white" :class="getColorClass(currentCard.PNL)">
                {{ formatNumber(currentCard.PNL, 3) }} SOL
              </div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Rockets</div>
              <div class="text-lg font-medium dark:text-white">{{ formatNumber(currentCard.Rockets * 100, 0) }}%</div>
            </div>
          </div>
        </div>
        
        <!-- ROI metrics -->
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2 dark:text-gray-200 text-gray-700">ROI Metrics</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Median ROI</div>
              <div class="text-lg font-medium dark:text-white" :class="getColorClass(currentCard['Median ROI'])">
                {{ formatNumber(currentCard['Median ROI'], 2) }}%
              </div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">AVG ROI</div>
              <div class="text-lg font-medium dark:text-white" :class="getColorClass(currentCard['AVG ROI'])">
                {{ formatNumber(currentCard['AVG ROI'], 2) }}%
              </div>
            </div>
          </div>
        </div>
  
        <!-- Trade metrics -->
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2 dark:text-gray-200 text-gray-700">Trade Metrics</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Fast Trades</div>
              <div class="text-lg font-medium dark:text-white">{{ currentCard['Fast Trades'] }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Fast Trades %</div>
              <div class="text-lg font-medium dark:text-white">{{ formatNumber(currentCard['Fast Trades %'] * 100, 0) }}%</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">AVG Trade Duration</div>
              <div class="text-lg font-medium dark:text-white">{{ currentCard['AVG Trade Duration'] }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Last Trade</div>
              <div class="text-lg font-medium dark:text-white">{{ formatDate(currentCard['Last Trade']) }}</div>
            </div>
          </div>
        </div>
        
        <!-- Portfolio metrics -->
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2 dark:text-gray-200 text-gray-700">Portfolio</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Balance</div>
              <div class="text-lg font-medium dark:text-white">{{ formatNumber(currentCard.Balance, 2) }} SOL</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Total Tokens</div>
              <div class="text-lg font-medium dark:text-white">{{ currentCard['Total Tokens'] }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">PF Tokens</div>
              <div class="text-lg font-medium dark:text-white">{{ currentCard['PF Tokens'] }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">% PF Trades</div>
              <div class="text-lg font-medium dark:text-white">{{ formatNumber(currentCard['% PF Trades'] * 100, 0) }}%</div>
            </div>
          </div>
        </div>
        
        <!-- Buy/Sell metrics -->
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2 dark:text-gray-200 text-gray-700">Buy/Sell Metrics</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Sold > Bought</div>
              <div class="text-lg font-medium dark:text-white">{{ currentCard['Sold > Bought'] }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Sold > Bought %</div>
              <div class="text-lg font-medium dark:text-white">{{ formatNumber(currentCard['Sold > Bought %'] * 100, 0) }}%</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">AVG Buy (SOL)</div>
              <div class="text-lg font-medium dark:text-white">{{ formatNumber(currentCard['AVG Buy (SOL)'], 3) }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Median SOL Buy</div>
              <div class="text-lg font-medium dark:text-white">{{ formatNumber(currentCard['Median Sol Buy'], 3) }}</div>
            </div>
          </div>
        </div>
        
        <!-- Market Cap metrics -->
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2 dark:text-gray-200 text-gray-700">Market Cap Metrics</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">AVG Mcap First Tx</div>
              <div class="text-lg font-medium dark:text-white">{{ currentCard['AVG Mcap First Tx'] }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">AVG Mcap Last Tx</div>
              <div class="text-lg font-medium dark:text-white">{{ currentCard['AVG Mcap Last Tx'] }}</div>
            </div>
          </div>
        </div>
        
        <!-- AI metrics and prediction -->
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2 dark:text-gray-200 text-gray-700">AI Analysis</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">AI Prediction</div>
              <div class="text-lg font-medium dark:text-white">{{ formatNumber(currentCard['ai prediction'] * 100, 2) }}%</div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Rug Premises</div>
              <div class="text-lg font-medium dark:text-white">{{ currentCard['rug premises'] }}</div>
            </div>
          </div>
        </div>
        
        <!-- Strategy Scores -->
        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg col-span-1 md:col-span-2">
          <h4 class="font-bold text-lg mb-2 dark:text-gray-200 text-gray-700">Strategy Scores</h4>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Aggressive</div>
              <div class="text-lg font-medium" :class="getStrategyColorClass(calculations.aggressiveStrategy, 3)">
                {{ formatNumber(calculations.aggressiveStrategy, 2) }}
              </div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Conservative</div>
              <div class="text-lg font-medium" :class="getStrategyColorClass(calculations.conservativeStrategy, 2)">
                {{ formatNumber(calculations.conservativeStrategy, 2) }}
              </div>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-600 dark:text-gray-300">Universal</div>
              <div class="text-lg font-medium" :class="getStrategyColorClass(calculations.universalStrategy, 3)">
                {{ formatNumber(calculations.universalStrategy, 2) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useDataStore } from '@/stores/dataStore';
  import { useResultsStore } from '@/stores/resultsStore';
  
  export default {
    name: 'CardViewer',
    props: {
      cardIndex: {
        type: Number,
        required: true
      }
    },
    setup(props) {
      const dataStore = useDataStore();
      const resultsStore = useResultsStore();
      
      const currentCard = computed(() => {
        return dataStore.filteredData[props.cardIndex] || null;
      });
      
      const calculations = computed(() => {
        if (!currentCard.value) return { 
          aggressiveStrategy: 0, 
          conservativeStrategy: 0, 
          universalStrategy: 0 
        };
        
        // Get normalized PNL (scale 0-1 based on all data)
        const pnlValues = dataStore.filteredData.map(item => item.PNL);
        const maxPnl = Math.max(...pnlValues);
        const minPnl = Math.min(...pnlValues);
        const pnlRange = maxPnl - minPnl;
        const pnlNorm = pnlRange === 0 ? 0 : (currentCard.value.PNL - minPnl) / pnlRange;
        
        // Convert AVG Trade Duration to minutes
        const durationText = currentCard.value['AVG Trade Duration'] || '';
        let durationMinutes = 60; // default
        
        if (durationText) {
          const match = durationText.match(/(\d+)\s*(\w+)/);
          if (match) {
            const value = parseInt(match[1]);
            const unit = match[2].toLowerCase();
            
            if (unit.includes('second')) {
              durationMinutes = value / 60;
            } else if (unit.includes('minute')) {
              durationMinutes = value;
            } else if (unit.includes('hour')) {
              durationMinutes = value * 60;
            } else if (unit.includes('day')) {
              durationMinutes = value * 1440;
            }
          }
        }
        
        // Calculate market cap growth (if values exist)
        let mcapGrowth = 0;
        const firstMcap = parseFloat(currentCard.value['AVG Mcap First Tx']?.replace(/[^\d.]/g, '')) || 0;
        const lastMcap = parseFloat(currentCard.value['AVG Mcap Last Tx']?.replace(/[^\d.]/g, '')) || 0;
        
        if (firstMcap > 0 && lastMcap > 0) {
          mcapGrowth = (lastMcap - firstMcap) / firstMcap;
          mcapGrowth = Math.min(Math.max(mcapGrowth, 0), 1); // Clamp between 0 and 1
        }
        
        // Calculate PF Tokens Score (normalized between 0-1)
        const pfTokensScore = Math.min(currentCard.value['PF Tokens'] / 100, 1);
        
        // Strategy calculations
        const aggressiveStrategy = 
          (currentCard.value.ROI * 0.35) + 
          (pnlNorm * 0.3) + 
          (currentCard.value.Rockets * 0.2) + 
          ((1 / durationMinutes) * 15);
        
        const conservativeStrategy = 
          (currentCard.value['Median ROI'] * 0.4) + 
          (currentCard.value.Rockets * 0.3) + 
          (pfTokensScore * 0.2) + 
          (mcapGrowth * 0.1);
        
        const universalStrategy = 
          (currentCard.value.ROI * 0.25) + 
          (currentCard.value['Median ROI'] * 0.2) + 
          (currentCard.value.Rockets * 0.2) + 
          (mcapGrowth * 0.15) + 
          ((1 / durationMinutes) * 0.1) + 
          (currentCard.value.WR * 0.1);
        
        return {
          aggressiveStrategy,
          conservativeStrategy,
          universalStrategy
        };
      });
      
      const formatNumber = (value, decimals = 2) => {
        if (value === undefined || value === null) return 'N/A';
        return Number(value).toFixed(decimals);
      };
      
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
          const date = new Date(dateString);
          return date.toLocaleString();
        } catch (e) {
          return dateString;
        }
      };
      
      const getColorClass = (value) => {
        if (value === undefined || value === null) return '';
        return value >= 0 ? 'text-green-500' : 'text-red-500';
      };
      
      const getStrategyColorClass = (value, threshold) => {
        if (value === undefined || value === null) return '';
        return value >= threshold ? 'text-green-500 dark:text-green-400' : 'text-yellow-500 dark:text-yellow-400';
      };
      
      const truncateWallet = (wallet) => {
        if (!wallet) return 'N/A';
        return `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`;
      };
      
      return {
        currentCard,
        calculations,
        formatNumber,
        formatDate,
        getColorClass,
        getStrategyColorClass,
        truncateWallet
      };
    }
  };
  </script>
<template>
  <div
    class="card-container w-full mx-auto p-4 rounded-lg dark:bg-gray-800 bg-white shadow-lg"
  >
    <h2
      class="text-2xl font-bold mb-4 dark:text-white text-gray-800 flex items-center"
    >
      <span class="mr-2">Wallet Analysis</span>
      <span
        class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-2 py-1 rounded-full"
        >{{ currentCard ? currentCard["Total Tokens"] : "0" }} tokens</span
      >
    </h2>

    <div v-if="currentCard" class="grid grid-cols-1 gap-4">
      <!-- Wallet and basic info -->
      <div
        class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg w-full shadow border border-blue-100 dark:border-gray-600"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center">
            <h3 class="text-xl font-semibold dark:text-white text-gray-800">
              {{ truncateWallet(currentCard.Wallet) }}
            </h3>
            <button
              @click="copyWalletToClipboard"
              class="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
              title="Copy wallet address"
            >
              <svg
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path
                  d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                ></path>
              </svg>
            </button>
          </div>
          <div class="flex space-x-2">
            <a
              :href="`https://solscan.io/account/${currentCard.Wallet}`"
              target="_blank"
              class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
            >
              <svg
                class="w-4 h-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                ></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Solscan
            </a>
            <a
              :href="`https://gmgn.ai/sol/address/${currentCard.Wallet}`"
              target="_blank"
              class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
            >
              <svg
                class="w-4 h-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                ></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              GMGN
            </a>
          </div>
        </div>
      </div>

      <!-- Grid layout for metric sections - Compact layout using a more efficient grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- 1. Key performance metrics -->
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
        >
          <h4
            class="font-bold text-lg mb-2 dark:text-blue-300 text-blue-600 border-b pb-2 border-gray-200 dark:border-gray-700"
          >
            <svg
              class="w-5 h-5 inline mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            Key Performance
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Win Rate (WR)</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ formatNumber(currentCard.WR, 2) }}
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >ROI</span
                >
              </div>
              <div
                class="text-lg font-semibold"
                :class="getColorClass(currentCard.ROI)"
              >
                {{ formatNumber(currentCard.ROI, 2) }}%
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >PNL</span
                >
              </div>
              <div
                class="text-lg font-semibold"
                :class="getColorClass(currentCard.PNL)"
              >
                {{ formatNumber(currentCard.PNL, 3) }} SOL
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Balance</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ formatNumber(currentCard.Balance, 2) }} SOL
              </div>
            </div>
          </div>
        </div>

        <!-- 2. ROI & Trade Performance -->
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
        >
          <h4
            class="font-bold text-lg mb-2 dark:text-green-300 text-green-600 border-b pb-2 border-gray-200 dark:border-gray-700"
          >
            <svg
              class="w-5 h-5 inline mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
            ROI & Trade Performance
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Median ROI</span
                >
              </div>
              <div
                class="text-lg font-semibold"
                :class="getColorClass(currentCard['Median ROI'])"
              >
                {{ formatNumber(currentCard["Median ROI"], 2) }}%
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >AVG ROI</span
                >
              </div>
              <div
                class="text-lg font-semibold"
                :class="getColorClass(currentCard['AVG ROI'])"
              >
                {{ formatNumber(currentCard["AVG ROI"], 2) }}%
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Fast Trades</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ currentCard["Fast Trades"] }}
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Fast Trades %</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ formatNumber(currentCard["Fast Trades %"] * 100, 0) }}%
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Trading Behavior -->
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
        >
          <h4
            class="font-bold text-lg mb-2 dark:text-purple-300 text-purple-600 border-b pb-2 border-gray-200 dark:border-gray-700"
          >
            <svg
              class="w-5 h-5 inline mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            Trading Behavior
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >AVG Duration</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ currentCard["AVG Trade Duration"] }}
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Last Trade</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ formatDate(currentCard["Last Trade"]) }}
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Sold > Bought</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ currentCard["Sold > Bought"] }}
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Sold > Bought %</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ formatNumber(currentCard["Sold > Bought %"] * 100, 0) }}%
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Portfolio Analysis -->
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
        >
          <h4
            class="font-bold text-lg mb-2 dark:text-amber-300 text-amber-600 border-b pb-2 border-gray-200 dark:border-gray-700"
          >
            <svg
              class="w-5 h-5 inline mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 2v8m0 8v4m-8-4h16"></path>
            </svg>
            Portfolio Analysis
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Total Tokens</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ currentCard["Total Tokens"] }}
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >PF Tokens</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ currentCard["PF Tokens"] }}
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >% PF Trades</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ formatNumber(currentCard["% PF Trades"] * 100, 0) }}%
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Rockets</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ formatNumber(currentCard.Rockets * 100, 0) }}%
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Trading Strategy -->
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
        >
          <h4
            class="font-bold text-lg mb-2 dark:text-cyan-300 text-cyan-600 border-b pb-2 border-gray-200 dark:border-gray-700"
          >
            <svg
              class="w-5 h-5 inline mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            Trading Strategy
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >AVG Buy (SOL)</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ formatNumber(currentCard["AVG Buy (SOL)"], 3) }}
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Median SOL Buy</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ formatNumber(currentCard["Median Sol Buy"], 3) }}
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >AVG Mcap First</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ currentCard["AVG Mcap First Tx"] }}
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >AVG Mcap Last</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ currentCard["AVG Mcap Last Tx"] }}
              </div>
            </div>
          </div>
        </div>

        <!-- 6. AI Analysis -->
        <div
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
        >
          <h4
            class="font-bold text-lg mb-2 dark:text-pink-300 text-pink-600 border-b pb-2 border-gray-200 dark:border-gray-700"
          >
            <svg
              class="w-5 h-5 inline mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z"></path>
            </svg>
            AI Analysis
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >AI Prediction</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ formatNumber(currentCard["ai prediction"] * 100, 2) }}%
              </div>
            </div>
            <div class="p-1 rounded">
              <div
                class="text-sm font-semibold text-gray-600 dark:text-gray-300"
              >
                <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                  >Rug Premises</span
                >
              </div>
              <div class="text-lg font-semibold dark:text-white text-gray-800">
                {{ currentCard["rug premises"] }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Strategy Scores - Full width for emphasis -->
      <div
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 w-full"
      >
        <h4
          class="font-bold text-lg mb-2 dark:text-indigo-300 text-indigo-600 border-b pb-2 border-gray-200 dark:border-gray-700"
        >
          <svg
            class="w-5 h-5 inline mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          Strategy Scores
        </h4>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div
              class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
            >
              <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                >Aggressive</span
              >
            </div>
            <div
              class="text-xl font-bold"
              :class="getStrategyColorClass(calculations.aggressiveStrategy, 3)"
            >
              {{ formatNumber(calculations.aggressiveStrategy, 2) }}
            </div>
            <div
              class="mt-1 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-gradient-to-r from-amber-400 to-red-500"
                :style="`width: ${Math.min(
                  calculations.aggressiveStrategy * 20,
                  100
                )}%`"
              ></div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div
              class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
            >
              <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                >Conservative</span
              >
            </div>
            <div
              class="text-xl font-bold"
              :class="
                getStrategyColorClass(calculations.conservativeStrategy, 2)
              "
            >
              {{ formatNumber(calculations.conservativeStrategy, 2) }}
            </div>
            <div
              class="mt-1 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                :style="`width: ${Math.min(
                  calculations.conservativeStrategy * 20,
                  100
                )}%`"
              ></div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <div
              class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
            >
              <span class="border-b border-gray-300 dark:border-gray-600 pb-1"
                >Universal</span
              >
            </div>
            <div
              class="text-xl font-bold"
              :class="getStrategyColorClass(calculations.universalStrategy, 3)"
            >
              {{ formatNumber(calculations.universalStrategy, 2) }}
            </div>
            <div
              class="mt-1 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-gradient-to-r from-green-400 to-green-600"
                :style="`width: ${Math.min(
                  calculations.universalStrategy * 20,
                  100
                )}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"
    >
      <div class="text-center">
        <svg
          class="w-12 h-12 mx-auto mb-3 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 15h8"></path>
          <path d="M9 9h.01"></path>
          <path d="M15 9h.01"></path>
        </svg>
        <p class="text-lg">No data available</p>
        <p class="text-sm mt-1">Please select a different wallet</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useDataStore } from "@/stores/dataStore";
import { useResultsStore } from "@/stores/resultsStore";
import { watch } from "vue";

export default {
  name: "CardViewer",
  props: {
    cardIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const dataStore = useDataStore();
    const resultsStore = useResultsStore();

    const currentCard = computed(() => {
      return dataStore.filteredData[props.cardIndex] || null;
    });

    watch(
      () => dataStore.filteredData,
      (newData) => {
        console.log(
          "CardViewer: отфильтрованные данные изменились:",
          newData.length,
          "элементов"
        );
        console.log("CardViewer: текущий индекс:", props.cardIndex);
      },
      { deep: true }
    );

    const calculations = computed(() => {
      if (!currentCard.value)
        return {
          aggressiveStrategy: 0,
          conservativeStrategy: 0,
          universalStrategy: 0,
        };

      // Get normalized PNL (scale 0-1 based on all data)
      const pnlValues = dataStore.filteredData.map((item) => item.PNL);
      const maxPnl = Math.max(...pnlValues);
      const minPnl = Math.min(...pnlValues);
      const pnlRange = maxPnl - minPnl;
      const pnlNorm =
        pnlRange === 0 ? 0 : (currentCard.value.PNL - minPnl) / pnlRange;

      // Convert AVG Trade Duration to minutes
      const durationText = currentCard.value["AVG Trade Duration"] || "";
      let durationMinutes = 60; // default

      if (durationText) {
        const match = durationText.match(/(\d+)\s*(\w+)/);
        if (match) {
          const value = parseInt(match[1]);
          const unit = match[2].toLowerCase();

          if (unit.includes("second")) {
            durationMinutes = value / 60;
          } else if (unit.includes("minute")) {
            durationMinutes = value;
          } else if (unit.includes("hour")) {
            durationMinutes = value * 60;
          } else if (unit.includes("day")) {
            durationMinutes = value * 1440;
          }
        }
      }

      // Calculate market cap growth (if values exist)
      let mcapGrowth = 0;
      const firstMcap =
        parseFloat(
          currentCard.value["AVG Mcap First Tx"]?.replace(/[^\d.]/g, "")
        ) || 0;
      const lastMcap =
        parseFloat(
          currentCard.value["AVG Mcap Last Tx"]?.replace(/[^\d.]/g, "")
        ) || 0;

      if (firstMcap > 0 && lastMcap > 0) {
        mcapGrowth = (lastMcap - firstMcap) / firstMcap;
        mcapGrowth = Math.min(Math.max(mcapGrowth, 0), 1); // Clamp between 0 and 1
      }

      // Calculate PF Tokens Score (normalized between 0-1)
      const pfTokensScore = Math.min(currentCard.value["PF Tokens"] / 100, 1);

      // Strategy calculations
      const aggressiveStrategy =
        currentCard.value.ROI * 0.35 +
        pnlNorm * 0.3 +
        currentCard.value.Rockets * 0.2 +
        (1 / durationMinutes) * 15;

      const conservativeStrategy =
        currentCard.value["Median ROI"] * 0.4 +
        currentCard.value.Rockets * 0.3 +
        pfTokensScore * 0.2 +
        mcapGrowth * 0.1;

      const universalStrategy =
        currentCard.value.ROI * 0.25 +
        currentCard.value["Median ROI"] * 0.2 +
        currentCard.value.Rockets * 0.2 +
        mcapGrowth * 0.15 +
        (1 / durationMinutes) * 0.1 +
        currentCard.value.WR * 0.1;

      return {
        aggressiveStrategy,
        conservativeStrategy,
        universalStrategy,
      };
    });

    const formatNumber = (value, decimals = 2) => {
      if (value === undefined || value === null) return "N/A";
      return Number(value).toFixed(decimals);
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleString();
      } catch (e) {
        return dateString;
      }
    };

    const getColorClass = (value) => {
      if (value === undefined || value === null) return "";
      return value >= 0
        ? "text-green-500 dark:text-green-400"
        : "text-red-500 dark:text-red-400";
    };

    const getStrategyColorClass = (value, threshold) => {
      if (value === undefined || value === null) return "";
      return value >= threshold
        ? "text-green-500 dark:text-green-400"
        : "text-yellow-500 dark:text-yellow-400";
    };

    const truncateWallet = (wallet) => {
      if (!wallet) return "N/A";
      return `${wallet.substring(0, 6)}...${wallet.substring(
        wallet.length - 4
      )}`;
    };

    const copyWalletToClipboard = () => {
      if (currentCard.value && currentCard.value.Wallet) {
        navigator.clipboard
          .writeText(currentCard.value.Wallet)
          .then(() => {
            // You could add a toast notification here if you want
            console.log("Wallet address copied to clipboard");
          })
          .catch((err) => {
            console.error("Failed to copy wallet address: ", err);
          });
      }
    };

    return {
      currentCard,
      calculations,
      formatNumber,
      formatDate,
      getColorClass,
      getStrategyColorClass,
      truncateWallet,
      copyWalletToClipboard,
    };
  },
};
</script>
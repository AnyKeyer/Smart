import { defineStore } from 'pinia';
import { useStorageManager } from '../utils/storageManager';

export const useResultsStore = defineStore('results', {
  state: () => ({
    savedWallets: [],
    lastExportDate: null,
  }),

  getters: {
    /**
     * Возвращает количество сохраненных кошельков
     * @returns {Number}
     */
    walletCount: (state) => state.savedWallets.length,
    
    /**
     * Проверяет, сохранен ли конкретный кошелек
     * @returns {Function}
     */
    isWalletSaved: (state) => (wallet) => {
      return state.savedWallets.includes(wallet);
    }
  },

  actions: {
    /**
     * Инициализирует хранилище, загружая данные из localStorage
     */
    initialize() {
      const storageManager = useStorageManager();
      const storedWallets = storageManager.load('smartfilter_saved_wallets', []);
      if (storedWallets && storedWallets.length) {
        this.savedWallets = storedWallets;
      }
    },

    /**
     * Получает список сохраненных кошельков
     * @returns {Array} - массив кошельков
     */
    getSavedWallets() {
      return this.savedWallets;
    },

    /**
     * Устанавливает список сохраненных кошельков
     * @param {Array} wallets - массив кошельков
     */
    setSavedWallets(wallets) {
      this.savedWallets = wallets;
      const storageManager = useStorageManager();
      storageManager.save('smartfilter_saved_wallets', this.savedWallets);
    },

    /**
     * Добавляет кошелек в список сохраненных
     * @param {String} wallet - адрес кошелька
     * @returns {Boolean} - true если добавлен, false если уже был в списке
     */
    addWallet(wallet) {
      if (!this.savedWallets.includes(wallet)) {
        this.savedWallets.push(wallet);
        const storageManager = useStorageManager();
        storageManager.save('smartfilter_saved_wallets', this.savedWallets);
        return true;
      }
      return false;
    },

    /**
     * Удаляет кошелек из списка сохраненных
     * @param {String} wallet - адрес кошелька
     * @returns {Boolean} - true если удален, false если не был найден
     */
    removeWallet(wallet) {
      const index = this.savedWallets.indexOf(wallet);
      if (index !== -1) {
        this.savedWallets.splice(index, 1);
        const storageManager = useStorageManager();
        storageManager.save('smartfilter_saved_wallets', this.savedWallets);
        return true;
      }
      return false;
    },

    /**
     * Очищает список сохраненных кошельков
     */
    clearWallets() {
      this.savedWallets = [];
      const storageManager = useStorageManager();
      storageManager.save('smartfilter_saved_wallets', this.savedWallets);
    },

    /**
     * Устанавливает дату последнего экспорта
     */
    setLastExportDate() {
      this.lastExportDate = new Date();
    }
  }
});
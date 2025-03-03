import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';

export const useKnownWalletsStore = defineStore('knownWallets', () => {
  // Список известных кошельков
  const knownWallets = ref([]);
  // Флаг готовности базы данных
  const dbReady = ref(false);
  
  let db = null;
  const DB_NAME = 'wallet-analyzer';
  const STORE_NAME = 'known-wallets';
  
  // Инициализация IndexedDB
  function initDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      
      request.onerror = (event) => {
        console.error('Ошибка при открытии IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Создаем хранилище, если его еще нет
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          // Используем адрес кошелька в качестве ключа
          db.createObjectStore(STORE_NAME, { keyPath: 'wallet' });
          console.log('Создано хранилище для известных кошельков');
        }
      };
      
      request.onsuccess = (event) => {
        db = event.target.result;
        console.log('IndexedDB успешно открыта');
        loadKnownWallets().then(() => {
          dbReady.value = true;
          resolve();
        });
      };
    });
  }
  
  // Загрузка всех известных кошельков из IndexedDB
  function loadKnownWallets() {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('База данных не инициализирована'));
        return;
      }
      
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onerror = (event) => {
        console.error('Ошибка при загрузке известных кошельков:', event.target.error);
        reject(event.target.error);
      };
      
      request.onsuccess = (event) => {
        knownWallets.value = event.target.result;
        console.log(`Загружено ${knownWallets.value.length} известных кошельков`);
        resolve(knownWallets.value);
      };
    });
  }
  
  // Добавление нового известного кошелька
  function addKnownWallet(wallet, description = '') {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('База данных не инициализирована'));
        return;
      }
      
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const walletObj = { 
        wallet, 
        description, 
        dateAdded: new Date().toISOString() 
      };
      
      const request = store.add(walletObj);
      
      request.onerror = (event) => {
        console.error('Ошибка при добавлении кошелька:', event.target.error);
        reject(event.target.error);
      };
      
      request.onsuccess = () => {
        console.log('Кошелек успешно добавлен:', wallet);
        knownWallets.value.push(walletObj);
        resolve(walletObj);
      };
    });
  }
  
  // Добавление нескольких кошельков одновременно
  function addMultipleWallets(wallets) {
    return new Promise(async (resolve, reject) => {
      if (!db) {
        reject(new Error('База данных не инициализирована'));
        return;
      }
      
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      let added = 0;
      let errors = 0;
      
      for (const walletData of wallets) {
        const wallet = typeof walletData === 'string' 
          ? { wallet: walletData, description: '', dateAdded: new Date().toISOString() }
          : { ...walletData, dateAdded: walletData.dateAdded || new Date().toISOString() };
        
        try {
          await new Promise((resolve, reject) => {
            const request = store.add(wallet);
            
            request.onerror = (event) => {
              // Пропускаем, если кошелек уже существует
              errors++;
              resolve();
            };
            
            request.onsuccess = () => {
              added++;
              resolve();
            };
          });
        } catch (error) {
          console.error('Ошибка при добавлении кошелька:', error);
        }
      }
      
      transaction.oncomplete = async () => {
        console.log(`Добавлено ${added} кошельков, ${errors} ошибок`);
        await loadKnownWallets();
        resolve({ added, errors });
      };
    });
  }
  
  // Удаление известного кошелька
  function removeKnownWallet(wallet) {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('База данных не инициализирована'));
        return;
      }
      
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(wallet);
      
      request.onerror = (event) => {
        console.error('Ошибка при удалении кошелька:', event.target.error);
        reject(event.target.error);
      };
      
      request.onsuccess = () => {
        console.log('Кошелек успешно удален:', wallet);
        knownWallets.value = knownWallets.value.filter(item => item.wallet !== wallet);
        resolve();
      };
    });
  }
  
  // Проверка, является ли кошелек известным
  function isKnownWallet(wallet) {
    return knownWallets.value.some(item => item.wallet === wallet);
  }
  
  // Очистка всех известных кошельков
  function clearKnownWallets() {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('База данных не инициализирована'));
        return;
      }
      
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      
      request.onerror = (event) => {
        console.error('Ошибка при очистке известных кошельков:', event.target.error);
        reject(event.target.error);
      };
      
      request.onsuccess = () => {
        console.log('Все известные кошельки очищены');
        knownWallets.value = [];
        resolve();
      };
    });
  }
  
  // Экспорт известных кошельков в формате JSON
  function exportKnownWallets() {
    return JSON.stringify(knownWallets.value);
  }
  
  // Экспорт известных кошельков в формате Excel/CSV
  function exportKnownWalletsToCSV() {
    // Заголовок CSV
    let csv = 'Wallet,Description,DateAdded\n';
    
    // Добавляем каждый кошелек
    knownWallets.value.forEach(wallet => {
      csv += `${wallet.wallet},${wallet.description || ''},${wallet.dateAdded || ''}\n`;
    });
    
    return csv;
  }
  
  // Инициализация при создании store
  onMounted(() => {
    initDatabase();
  });
  
  return {
    knownWallets,
    dbReady,
    initDatabase,
    loadKnownWallets,
    addKnownWallet,
    addMultipleWallets,
    removeKnownWallet,
    isKnownWallet,
    clearKnownWallets,
    exportKnownWallets,
    exportKnownWalletsToCSV
  };
});
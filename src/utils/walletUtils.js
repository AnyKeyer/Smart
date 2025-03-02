/**
 * Генерирует URL для Solscan на основе адреса кошелька
 * @param {String} wallet - адрес кошелька
 * @returns {String} - URL для Solscan
 */
export function getSolscanUrl(wallet) {
    if (!wallet) return '#';
    return `https://solscan.io/account/${wallet}`;
  }
  
  /**
   * Генерирует URL для GMGN на основе адреса кошелька
   * @param {String} wallet - адрес кошелька
   * @returns {String} - URL для GMGN
   */
  export function getGMGNUrl(wallet) {
    if (!wallet) return '#';
    return `https://gmgn.ai/sol/address/${wallet}`;
  }
  
  /**
   * Проверяет валидность адреса кошелька
   * @param {String} wallet - адрес кошелька
   * @returns {Boolean} - результат проверки
   */
  export function isValidWallet(wallet) {
    // Простая проверка на формат Solana-адреса
    return typeof wallet === 'string' && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet);
  }
  
  /**
   * Форматирует адрес кошелька для отображения (сокращает)
   * @param {String} wallet - адрес кошелька
   * @param {Number} start - количество символов в начале
   * @param {Number} end - количество символов в конце
   * @returns {String} - отформатированный адрес
   */
  export function formatWalletAddress(wallet, start = 4, end = 4) {
    if (!wallet || typeof wallet !== 'string') return '';
    if (wallet.length <= start + end) return wallet;
    
    return `${wallet.substring(0, start)}...${wallet.substring(wallet.length - end)}`;
  }
/**
 * Нормализует значение PNL для использования в формулах
 * @param {Number} pnl - значение PNL
 * @returns {Number} - нормализованное значение в пределах 0-1
 */
function normalizePNL(pnl) {
    // Ограничиваем значение в диапазоне [0, 1]
    const maxPNL = 100; // Предполагаемое максимальное значение для нормализации
    return Math.max(0, Math.min(1, pnl / maxPNL));
  }
  
  /**
   * Преобразует строковое представление длительности в минуты
   * @param {String} duration - строка вида "5 minutes" или "1 hour"
   * @returns {Number} - количество минут
   */
  function durationToMinutes(duration) {
    if (!duration) return 60; // Значение по умолчанию, если нет данных
    
    try {
      const parts = duration.toLowerCase().split(' ');
      const value = parseFloat(parts[0]);
      const unit = parts[1];
      
      if (isNaN(value)) return 60;
      
      switch(unit) {
        case 'minute':
        case 'minutes':
          return value;
        case 'hour':
        case 'hours':
          return value * 60;
        case 'day':
        case 'days':
          return value * 60 * 24;
        default:
          return value;
      }
    } catch (error) {
      console.error('Ошибка при обработке длительности:', error);
      return 60;
    }
  }
  
  /**
   * Вычисляет рост капитализации от первой до последней транзакции
   * @param {String} firstTx - строка вида "6.2k"
   * @param {String} lastTx - строка вида "75.3k"
   * @returns {Number} - коэффициент роста от 0 до 1
   */
  function calculateMcapGrowth(firstTx, lastTx) {
    try {
      // Преобразуем строки в числа
      const first = parseValueWithSuffix(firstTx);
      const last = parseValueWithSuffix(lastTx);
      
      if (first <= 0) return 0;
      
      // Расчет роста: (last - first) / first, ограниченный в пределах [0, 1]
      const growth = (last - first) / first;
      return Math.min(1, Math.max(0, growth / 10)); // Нормализуем, предполагая, что 10x рост это максимум = 1
    } catch (error) {
      console.error('Ошибка при расчете роста капитализации:', error);
      return 0;
    }
  }
  
  /**
   * Преобразует строковое значение с суффиксом (k, m) в число
   * @param {String} value - строка вида "6.2k" или "1.5m"
   * @returns {Number} - числовое значение
   */
  function parseValueWithSuffix(value) {
    if (!value || typeof value !== 'string') return 0;
    
    const match = value.toLowerCase().match(/^(\d+(\.\d+)?)([km])?$/);
    if (!match) return 0;
    
    const num = parseFloat(match[1]);
    const suffix = match[3] || '';
    
    switch(suffix) {
      case 'k': return num * 1000;
      case 'm': return num * 1000000;
      default: return num;
    }
  }
  
  /**
   * Вычисляет оценку количества токенов в портфеле
   * @param {Number} pfTokens - количество токенов
   * @returns {Number} - оценка от 0 до 1
   */
  function calculatePFTokensScore(pfTokens) {
    if (!pfTokens || isNaN(pfTokens)) return 0;
    // Предполагаем, что 100 токенов это максимум = 1
    return Math.min(1, pfTokens / 100);
  }
  
  /**
   * Рассчитывает стратегические оценки для объекта данных
   * @param {Object} data - объект с данными
   * @returns {Object} - объект с результатами расчетов
   */
  export function calculateScores(data) {
    // Подготовка нормализованных данных для формул
    const roi = parseFloat(data.ROI) || 0;
    const medianROI = parseFloat(data["Median ROI"]) || 0;
    const pnlNorm = normalizePNL(parseFloat(data.PNL) || 0);
    const rockets = parseFloat(data.Rockets) || 0;
    const avgTradeDuration = durationToMinutes(data["AVG Trade Duration"]);
    const durationFactor = avgTradeDuration > 0 ? 1 / avgTradeDuration : 0; // Обратная зависимость
    const pfTokensScore = calculatePFTokensScore(parseInt(data["PF Tokens"]) || 0);
    const mcapGrowth = calculateMcapGrowth(data["AVG Mcap First Tx"], data["AVG Mcap Last Tx"]);
    const winRate = parseFloat(data.WR) || 0;
    
    // Расчет по формулам из требований
    const aggressiveScore = (roi * 0.35) + (pnlNorm * 0.3) + (rockets * 0.2) + (durationFactor * 0.15);
    const conservativeScore = (medianROI * 0.4) + (rockets * 0.3) + (pfTokensScore * 0.2) + (mcapGrowth * 0.1);
    const universalScore = (roi * 0.25) + (medianROI * 0.2) + (rockets * 0.2) + 
                           (mcapGrowth * 0.15) + (durationFactor * 0.1) + (winRate * 0.1);
    
    return {
      aggressiveScore: Math.min(1, Math.max(0, aggressiveScore)),
      conservativeScore: Math.min(1, Math.max(0, conservativeScore)),
      universalScore: Math.min(1, Math.max(0, universalScore))
    };
  }
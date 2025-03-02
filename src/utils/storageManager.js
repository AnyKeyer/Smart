/**
 * Сохраняет данные в localStorage
 * @param {String} key - ключ для сохранения
 * @param {*} data - данные для сохранения
 * @returns {Boolean} - успешность операции
 */
export function saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Ошибка при сохранении ${key} в localStorage:`, error);
      return false;
    }
  }
  
  /**
   * Загружает данные из localStorage
   * @param {String} key - ключ для загрузки
   * @param {*} defaultValue - значение по умолчанию
   * @returns {*} - загруженные данные или значение по умолчанию
   */
  export function loadFromLocalStorage(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Ошибка при загрузке ${key} из localStorage:`, error);
      return defaultValue;
    }
  }
  
  /**
   * Удаляет данные из localStorage
   * @param {String} key - ключ для удаления
   * @returns {Boolean} - успешность операции
   */
  export function removeFromLocalStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Ошибка при удалении ${key} из localStorage:`, error);
      return false;
    }
  }
  
  /**
   * Сохраняет данные в cookies
   * @param {String} name - имя cookie
   * @param {String} value - значение
   * @param {Number} days - срок хранения в днях
   */
  export function setCookie(name, value, days = 30) {
    try {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${value};${expires};path=/`;
    } catch (error) {
      console.error(`Ошибка при установке cookie ${name}:`, error);
    }
  }
  
  /**
   * Получает значение cookie
   * @param {String} name - имя cookie
   * @returns {String|null} - значение cookie или null
   */
  export function getCookie(name) {
    try {
      const nameEQ = `${name}=`;
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    } catch (error) {
      console.error(`Ошибка при получении cookie ${name}:`, error);
      return null;
    }
  }
  
  /**
   * Удаляет cookie
   * @param {String} name - имя cookie
   */
  export function deleteCookie(name) {
    try {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    } catch (error) {
      console.error(`Ошибка при удалении cookie ${name}:`, error);
    }
  }
  
  /**
   * Композабл функция для работы с локальным хранилищем и cookies
   * @returns {Object} - объект с методами для работы с хранилищем
   */
  export function useStorageManager() {
    return {
      // Методы для localStorage
      save: saveToLocalStorage,
      load: loadFromLocalStorage,
      remove: removeFromLocalStorage,
      
      // Методы для cookies
      setCookie,
      getCookie,
      deleteCookie,
      
      /**
       * Сохраняет фильтры в локальное хранилище
       * @param {Object} filters - объект с фильтрами
       * @returns {Boolean} - успешность операции
       */
      saveFilters(filters) {
        return saveToLocalStorage('smartfilter_filters', filters);
      },
      
      /**
       * Загружает сохраненные фильтры из локального хранилища
       * @returns {Object|null} - объект с фильтрами или null
       */
      loadFilters() {
        return loadFromLocalStorage('smartfilter_filters', {});
      },
      
      /**
       * Сбрасывает сохраненные фильтры
       * @returns {Boolean} - успешность операции
       */
      resetFilters() {
        return removeFromLocalStorage('smartfilter_filters');
      }
    };
  }
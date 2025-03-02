import * as XLSX from 'xlsx';

/**
 * Парсит Excel-файл и возвращает данные в виде массива объектов
 * @param {File} file - Excel-файл
 * @returns {Promise<Array>} - массив объектов с данными
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Берем первый лист
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Преобразуем в JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Если нет данных
        if (jsonData.length <= 1) {
          reject(new Error('Файл не содержит данных'));
          return;
        }
        
        // Первая строка - заголовки
        const headers = jsonData[0];
        
        // Остальные строки - данные
        const result = jsonData.slice(1).map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Экспортирует данные в Excel-файл
 * @param {Array} data - массив данных для экспорта
 * @param {String} filename - имя файла
 */
export function exportToExcel(data, filename = 'export.xlsx') {
  // Создаем новую книгу
  const wb = XLSX.utils.book_new();
  
  // Создаем лист с данными
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Добавляем лист в книгу
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
  // Сохраняем файл
  XLSX.writeFile(wb, filename);
}
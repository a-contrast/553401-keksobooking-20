'use strict';

(function () {
  window.utils = {
    /**
     * Возвращает случайное число
     * @param {number} min - начало диапазона
     * @param {number} max - конец диапазона
     * @return {number}
     */
    getRandomInRange: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Возвращает содержимое случайной ячейки архива
     * @param {object} array - массив
     * @return {int}
     */
    getRandomFromArray: function (array) {
      var randomArrayIndex = Math.floor(Math.random() * array.length);
      return array[randomArrayIndex];
    },

    /**
     * Возвращает рандомно урезанный массив
     * @param {object} array - массив
     * @return {object}
     */
    getRandomSliceArray: function (array) {
      return array.slice(0, this.getRandomInRange(0, array.length));
    }
  };
})();

'use strict';

(function () {
  var MAX_RENDER_PINS = 5;

  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var housingFeatures = mapFilters.querySelector('#housing-features');
  var housingFeaturesInputs = housingFeatures.querySelectorAll('input');

  /**
   * возвращает элемент попадающий под условия (фильтр по типу объекта жилья)
   * @param {object} element - объект из массива полученных данных с сервера
   * @return {object}
   */
  function filterByTypeOfRent(element) {
    return element.offer.type === housingType.value || housingType.value === 'any';
  }

  /**
   * возвращает элемент попадающий под условия (фильтр по цене объекта жилья)
   * @param {object} element - объект из массива полученных данных с сервера
   * @return {object}
   */
  function filterByPrice(element) {
    switch (housingPrice.value) {
      case 'low':
        return element.offer.price < 10000;
      case 'middle':
        return element.offer.price < 50000 && element.offer.price >= 10000;
      case 'high':
        return element.offer.price >= 50000;
      default:
        return true;
    }
  }

  /**
   * возвращает элемент попадающий под условия (фильтр по количеству комнат объекта жилья)
   * @param {object} element - объект из массива полученных данных с сервера
   * @return {object}
   */
  function filterByRooms(element) {
    return element.offer.rooms === Number(housingRooms.value) || housingRooms.value === 'any';
  }

  /**
   * возвращает элемент попадающий под условия (фильтр по количеству гостей объекта жилья)
   * @param {object} element - объект из массива полученных данных с сервера
   * @return {object}
   */
  function filterByGuest(element) {
    return element.offer.guests === Number(housingGuests.value) || housingGuests.value === 'any';
  }

  /**
   * возвращает элемент попадающий под условия (фильтр по параметрам объекта жилья)
   * @param {object} element - объект из массива полученных данных с сервера
   * @return {object}
   */
  function filterByFeatures(element) {
    var elementActive = true; // предположим что все элементы true
    // получим массив инпутов, которые активны (checked)
    var checkedElements = Array.from(housingFeaturesInputs).filter(function (checkbox) {
      return checkbox.checked;
    });

    // если пин не содержит значение активного инпута, тогда элемент будет иметь статус false
    for (var i = 0; i < checkedElements.length; i++) {
      if (!element.offer.features.includes(checkedElements[i].value)) {
        elementActive = false;
      }
    }

    return elementActive;
  }

  window.filter = {
    getFilteredArray: function (data) {
      return data.filter(filterByTypeOfRent).
      filter(filterByPrice).
      filter(filterByRooms).filter(filterByGuest).
      filter(filterByFeatures).
      slice(0, MAX_RENDER_PINS);
    },
    mapFilters: mapFilters
  };
})();

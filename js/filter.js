'use strict';

(function () {
  var MAX_RENDER_PINS = 5;
  var LOW_PRICE = 10000;
  var HIGHT_PRICE = 50000;

  var priceValue = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high'
  };

  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var housingFeatures = mapFilters.querySelector('#housing-features');
  var housingFeaturesInputs = housingFeatures.querySelectorAll('input');

  // запишем значения по дефолту
  var housingTypeDefault = housingType.value;
  var housingPriceDefault = housingPrice.value;
  var housingRoomsDefault = housingRooms.value;
  var housingGuestsDefault = housingGuests.value;

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
      case priceValue.LOW:
        return element.offer.price < LOW_PRICE;
      case priceValue.MIDDLE:
        return element.offer.price < HIGHT_PRICE && element.offer.price >= LOW_PRICE;
      case priceValue.HIGH:
        return element.offer.price >= HIGHT_PRICE;
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

  /**
   * возвращает элемент попадающий под условия всех фильтров
   * @param {object} element - объект из массива полученных данных с сервера
   * @return {object}
   */
  function filterAll(element) {
    return filterByTypeOfRent(element)
      && filterByPrice(element)
      && filterByRooms(element)
      && filterByGuest(element)
      && filterByFeatures(element)
  }

  window.filter = {
    setDefaultValues: function () {
      housingType.value = housingTypeDefault;
      housingPrice.value = housingPriceDefault;
      housingRooms.value = housingRoomsDefault;
      housingGuests.value = housingGuestsDefault;
    },
    getFilteredArray: function (data) {
      return data
        .filter(filterAll)
        .slice(0, MAX_RENDER_PINS);
    },
    mapFilters: mapFilters,
    housingFeatures: housingFeatures
  };
})();

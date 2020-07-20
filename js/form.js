'use strict';

(function () {
  // минимальная длина заголовка
  var MIN_TITLE_LENGTH = 30;
  // максимальная длина заголовка
  var MAX_TITLE_LENGTH = 100;

  // объект со значениями ключей соотв. roomNumber.value и значений соотв. capacity.value
  var roomsToCapacity = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var rentMinPrice = {
    'flat': '1000',
    'bungalo': '0',
    'house': '5000',
    'palace': '10000'
  };

  var main = document.querySelector('main');
  var form = document.querySelector('.ad-form'); // форма для нашего объявления
  var features = form.querySelector('.features'); // блок с чекбоксами
  var title = form.querySelector('#title'); // поле для написания заголовка
  var typeOfRent = form.querySelector('#type'); // поле с типом жилья
  var priceOfRent = form.querySelector('#price'); // поле с ценой
  var roomNumber = form.querySelector('#room_number'); // select с количеством комнат
  var capacity = form.querySelector('#capacity'); // select с количеством гостей
  var timeIn = form.querySelector('#timein'); // select со временем заезда
  var timeOut = form.querySelector('#timeout'); // select со временем выезда
  var description = form.querySelector('#description'); // textArea с описанием
  var addressInput = form.querySelector('#address'); // поле с адресом

  var successTemplate = document.querySelector('#success').content.querySelector('.success'); // темплейт сообщения об успешной отправке
  var errorTemplate = document.querySelector('#error').content.querySelector('.error'); // темплейт сообщения при ошибке отправки
  var success = successTemplate.cloneNode(true);
  var error = errorTemplate.cloneNode(true);

  // запишем значения по дефолту
  var titleDefault = title.value;
  var typeOfRentDefault = typeOfRent.value;
  var priceOfRentDefault = priceOfRent.value;
  var timeInDefault = timeIn.value;
  var timeOutDefault = timeOut.value;
  var roomNumberDefault = roomNumber.value;
  var capacityDefault = capacity.value;
  var descriptionDefault = description.value;

  /**
   * убирает блок из разметки
   * @param {text} block - записывать в формате '.block' - блок, который нужно удалить
   */
  function removeBlock(block) {
    var removableBlock = document.querySelector(block);
    removableBlock.remove();
  }

  /**
   * удаляет блок success и убирает лишние обработчики
   * @param {object} evt - событие
   */
  function removeSuccessBlock(evt) {
    if (evt.key === 'Escape' || evt.button === 0) {
      removeBlock('.success');
      document.removeEventListener('keydown', removeSuccessBlock);
      document.removeEventListener('click', removeSuccessBlock);
    }
  }

  /**
   * удаляет блок error и убирает лишние обработчики
   * @param {object} evt - событие
   */
  function removeErrorBlock(evt) {
    if (evt.key === 'Escape' || evt.button === 0) {
      removeBlock('.error');
      document.removeEventListener('keydown', removeErrorBlock);
      document.removeEventListener('click', removeErrorBlock);
    }
  }

  window.form = {
    features: features,
    // устанавливает значения по дефолту
    setDefaultValues: function () {
      title.value = titleDefault;
      typeOfRent.value = typeOfRentDefault;
      priceOfRent.value = priceOfRentDefault;
      timeIn.value = timeInDefault;
      timeOut.value = timeOutDefault;
      roomNumber.value = roomNumberDefault;
      capacity.value = capacityDefault;
      description.value = descriptionDefault;
      addressInput.readOnly = true;
    },

    // устанавливает дефолтные значения для чекбоксов
    setDefaultFeatures: function (block) {
      var featuresArray = block.querySelectorAll('input');
      for (var i = 0; i < featuresArray.length; i++) {
        featuresArray[i].checked = false;
      }
    },

    /**
     * назначаем/убираем атрибут disabled для элементов массива
     * @param {object} array - массив, в данном случае список fieldset-ов
     * @param {boolean} isDisabled - true либо false, добавить либо убрать атрибут
     */
    toggleAttributeDisabled: function (array, isDisabled) {
      for (var i = 0; i < array.length; i++) {
        array[i].disabled = isDisabled;
      }
    },

    /**
     * валидация на пустое поле
     * @param {object} element - элемент который проверяем
     */
    validationEmpty: function (element) {
      if (element.validity.valueMissing) {
        element.setCustomValidity('Обязательное поле');
      } else {
        element.setCustomValidity('');
      }
    },

    // валидация ввода заголовка
    validationTitleInput: function () {
      var valueLength = title.value.length;

      if (valueLength < MIN_TITLE_LENGTH) {
        title.setCustomValidity('Ну же, еще ' + (MIN_TITLE_LENGTH - valueLength) + ' симв.');
      } else if (valueLength > MAX_TITLE_LENGTH) {
        title.setCustomValidity('Удалите лишние ' + (valueLength - MAX_TITLE_LENGTH) + ' симв.');
      } else {
        title.setCustomValidity('');
      }
    },

    /**
     * узнаем координаты главного пина pinMain
     * @param {object} inputBlock - инпут для отображения координат (readonly)
     * @param {object} pin - pinMain
     */
    setCoordinateToInput: function (inputBlock, pin) {
      var x = Math.round(parseInt(pin.style.left, 10) + pin.offsetWidth / 2);
      var y = Math.round(parseInt(pin.style.top, 10) + pin.offsetHeight);

      // если карта неактивна, координата является центром пина, а не острием
      if (window.data.map.classList.contains('map--faded')) {
        y = Math.round(parseInt(pin.style.top, 10) + pin.offsetHeight / 2);
      }

      inputBlock.value = x + ', ' + y;
    },

    // устанавливает атрибуты min и placeholder для поля price в зависимости от выбранного жилья
    getMinPrice: function () {
      priceOfRent.setAttribute('min', rentMinPrice[typeOfRent.value]);
      priceOfRent.setAttribute('placeholder', rentMinPrice[typeOfRent.value]);
    },

    // валидируем на соответствие друг другу два селекта - с количеством комнат и количеством гостей
    validationCapacity: function () {
      var last = roomsToCapacity[roomNumber.value][roomsToCapacity[roomNumber.value].length - 1]; // последний элемент массива значений
      if (roomsToCapacity[roomNumber.value].includes(capacity.value)) {
        capacity.setCustomValidity('');
      } else {
        capacity.setCustomValidity('Вы можете взять с собой максимально ' + last + ' гостя, выберите правильный вариант');
      }
    },

    // валидация поля с прайсом
    validationPriceInput: function () {
      var price = priceOfRent.value;
      var minPrice = Number(priceOfRent.getAttribute('min'));
      var maxPrice = Number(priceOfRent.getAttribute('max'));

      if (price < minPrice) {
        priceOfRent.setCustomValidity('Добавьте еще ' + (minPrice - price) + ' рублей');
      } else if (price > maxPrice) {
        priceOfRent.setCustomValidity('За эту цену проще купить, чем снимать, максимальная сумма для ввода ' + maxPrice + ' руб.');
      } else {
        priceOfRent.setCustomValidity('');
      }
    },

    // синхронизируем поля с временем заезда - выезда
    syncTimeInWithOut: function () {
      timeIn.value = timeOut.value;
    },

    syncTimeOutWithIn: function () {
      timeOut.value = timeIn.value;
    },

    upload: function (evt) {
      window.upload(
          new FormData(window.form.form),
          function () {
            window.main.deActivateMap();
            main.appendChild(success);

            document.addEventListener('keydown', removeSuccessBlock);
            document.addEventListener('click', removeSuccessBlock);
          },
          function () {
            main.appendChild(error);
            document.addEventListener('keydown', removeErrorBlock);
            document.addEventListener('click', removeErrorBlock);
          });
      evt.preventDefault();
    },

    form: form,
    addressInput: addressInput,
    title: title,
    priceOfRent: priceOfRent,
    typeOfRent: typeOfRent,
    roomNumber: roomNumber,
    capacity: capacity,
    timeIn: timeIn,
    timeOut: timeOut,

  };

})();

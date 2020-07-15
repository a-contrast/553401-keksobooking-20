'use strict';

(function () {
  var formFieldsets = window.form.form.querySelectorAll('fieldset'); // находим ВЕ fieldset-ы в форме
  var formReset = window.form.form.querySelector('.ad-form__reset'); // кнопка сброса формы


  // устанавливает значения при открытии страницы
  function setDefaultParameters() {
    window.pin.pinMain.style.left = window.pin.pinMainDefaultLeft;
    window.pin.pinMain.style.top = window.pin.pinMainDefaultTop;
    window.form.setDefaultValues();
    window.form.setDefaultFeatures();
    window.form.getMinPrice();
    // getCapacity();
    window.form.validationCapacity();
    window.form.toggleAttributeDisabled(formFieldsets, true);
    window.form.setCoordinateToInput(window.form.addressInput, window.pin.pinMain);
    // действия по нажатию ЛЕВОЙ кнопкой мыши по главному пину
    window.pin.pinMain.addEventListener('mousedown', onClickMainPin);
    // действия при нажатии кнопки открытия попапа клавишей ENTER
    window.pin.pinMain.addEventListener('keydown', onClickMainPin);
  }

  /**
   * перемещаем главный пин и записываем координаты в инпут с адресом
   * @param {object} evt - событие
   */
  function onMovePinMain(evt) {
    window.move.onMoveElement(
        evt,
        window.pin.pinMain,
        window.data.MAP_COORDINATES.x.min,
        window.data.MAP_COORDINATES.x.max,
        window.data.MAP_COORDINATES.y.min,
        window.data.MAP_COORDINATES.y.max
    );
    document.addEventListener('mousemove', function () {
      window.form.setCoordinateToInput(window.form.addressInput, window.pin.pinMain);
    });
  }

  var onChangeMapFilter = window.debounce(function() {
    var allPins = window.pin.pinsBlock.querySelectorAll('.map__pin'); // найдем и запишем в псевдомассив отрисованные пины
    var popup = window.data.map.querySelector('.map__card');

    if (popup) {
      popup.remove();
    }

    window.pin.unRenderPinsToMap(allPins);
    window.pin.renderPinsToMap();
  });

  function onClickMainPin(evt) {
    if (evt.button === 0 || evt.key === 'Enter') {
      activateMap();
    }
  }

  // действия при активации карты
  function activateMap() {
    window.pin.pinMain.removeEventListener('mousedown', onClickMainPin);

    window.pin.pinMain.removeEventListener('keydown', onClickMainPin);

    window.data.map.classList.remove('map--faded'); // делаем блок .map видимым
    window.form.form.classList.remove('ad-form--disabled'); // делаем форму доступной

    window.pin.renderPinsToMap()/* (window.data.mapObjects) */; // отрисовываем пины
    window.form.setCoordinateToInput(window.form.addressInput, window.pin.pinMain);
    window.form.toggleAttributeDisabled(formFieldsets, false); // делаем поля формы доступными

    window.filter.mapFilters.addEventListener('change', onChangeMapFilter);
    window.form.priceOfRent.addEventListener('input', window.form.validationPriceInput);
    window.form.roomNumber.addEventListener('change', window.form.validationCapacity);
    window.form.capacity.addEventListener('change', window.form.validationCapacity);
    window.form.typeOfRent.addEventListener('change', window.form.getMinPrice);
    window.form.timeIn.addEventListener('change', window.form.syncTimeOutWithIn);
    window.form.timeOut.addEventListener('change', window.form.syncTimeInWithOut);
    window.data.map.addEventListener('click', window.popup.onClickMapPin);
    formReset.addEventListener('click', deActivateMap);

    window.pin.pinMain.addEventListener('mousedown', onMovePinMain);
    window.form.title.addEventListener('invalid', function () {
      window.form.validationEmpty(window.form.title);
    });
    window.form.title.addEventListener('input', window.form.validationTitleInput);
    window.form.priceOfRent.addEventListener('invalid', function () {
      window.form.validationEmpty(window.form.priceOfRent);
    });
    window.form.form.addEventListener('submit', window.form.upload);
  }

  // действия для Деактивации карты
  function deActivateMap() {
    var allPins = window.pin.pinsBlock.querySelectorAll('.map__pin'); // найдем и запишем в псевдомассив отрисованные пины

    window.data.map.classList.add('map--faded');
    window.form.form.classList.add('ad-form--disabled'); // делаем форму доступной

    window.pin.unRenderPinsToMap(allPins);
    setDefaultParameters();

    window.filter.mapFilters.removeEventListener('change', onChangeMapFilter);
    window.form.priceOfRent.removeEventListener('input', window.form.validationPriceInput);
    window.form.roomNumber.removeEventListener('change', window.form.validationCapacity);
    window.form.capacity.removeEventListener('change', window.form.validationCapacity);
    window.form.typeOfRent.removeEventListener('change', window.form.getMinPrice);
    window.form.timeIn.removeEventListener('change', window.form.syncTimeOutWithIn);
    window.form.timeOut.removeEventListener('change', window.form.syncTimeInWithOut);
    window.data.map.removeEventListener('click', window.popup.onClickMapPin);
    formReset.removeEventListener('click', deActivateMap);

    window.pin.pinMain.removeEventListener('mousedown', onMovePinMain);
    window.form.title.removeEventListener('invalid', function () {
      window.form.validationEmpty(window.form.title);
    });
    window.form.title.removeEventListener('input', window.form.validationTitleInput);
    window.form.priceOfRent.removeEventListener('invalid', function () {
      window.form.validationEmpty(window.form.priceOfRent);
    });
    window.form.form.removeEventListener('submit', window.form.upload);
  }

  setDefaultParameters();

  window.main = {
    deActivateMap: function () {
      deActivateMap();
    }
  };
})();

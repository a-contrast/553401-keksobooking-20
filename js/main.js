'use strict';

(function () {
  var pinMain = window.data.map.querySelector('.map__pin--main'); // главный пин
  var formFieldsets = window.form.form.querySelectorAll('fieldset'); // находим ВЕ fieldset-ы в форме
  var formReset = window.form.form.querySelector('.ad-form__reset'); // кнопка сброса формы

  // устанавливает значения при открытии страницы
  function setDefaultParameters() {
    window.form.setDefaultValues();
    window.form.setDefaultFeatures();
    window.form.getMinPrice();
    // getCapacity();
    window.form.validationCapacity();
    window.form.toggleAttributeDisabled(formFieldsets, true);
    window.form.setCoordinateToInput(window.form.addressInput, pinMain);
    // действия по нажатию ЛЕВОЙ кнопкой мыши по главному пину
    pinMain.addEventListener('mousedown', onClickMainPin);
    // действия при нажатии кнопки открытия попапа клавишей ENTER
    pinMain.addEventListener('keydown', onClickMainPin);
  }

  function onClickMainPin(evt) {
    if (evt.button === 0 || evt.key === 'Enter') {
      activateMap();
    }
  }

  // действия при активации карты
  function activateMap() {
    pinMain.removeEventListener('mousedown', onClickMainPin);

    pinMain.removeEventListener('keydown', onClickMainPin);

    window.data.map.classList.remove('map--faded'); // делаем блок .map видимым
    window.form.form.classList.remove('ad-form--disabled'); // делаем форму доступной

    window.pin.renderPinsToMap(window.data.mapObjects); // отрисовываем пины
    window.form.setCoordinateToInput(window.form.addressInput, pinMain);
    window.form.toggleAttributeDisabled(formFieldsets, false); // делаем поля формы доступными

    window.form.priceOfRent.addEventListener('input', window.form.validationPriceInput);
    window.form.roomNumber.addEventListener('change', window.form.validationCapacity);
    window.form.capacity.addEventListener('change', window.form.validationCapacity);
    window.form.typeOfRent.addEventListener('change', window.form.getMinPrice);
    window.form.timeIn.addEventListener('change', window.form.syncTimeOutWithIn);
    window.form.timeOut.addEventListener('change', window.form.syncTimeInWithOut);
    window.data.map.addEventListener('click', window.popup.onClickMapPin);
    formReset.addEventListener('click', deActivateMap);


    window.form.title.addEventListener('invalid', function () {
      window.form.validationEmpty(window.form.title);
    });
    window.form.title.addEventListener('input', window.form.validationTitleInput);
    window.form.priceOfRent.addEventListener('invalid', function () {
      window.form.validationEmpty(window.form.priceOfRent);
    });
  }

  // действия для Деактивации карты
  function deActivateMap() {
    var allPins = window.pin.pinsBlock.querySelectorAll('.map__pin'); // найдем и запишем в псевдомассив отрисованные пины

    window.data.map.classList.add('map--faded');
    window.form.form.classList.add('ad-form--disabled'); // делаем форму доступной

    window.pin.unRenderPinsToMap(allPins);
    setDefaultParameters();

    window.form.priceOfRent.removeEventListener('input', window.form.validationPriceInput);
    window.form.roomNumber.removeEventListener('change', window.form.validationCapacity);
    window.form.capacity.removeEventListener('change', window.form.validationCapacity);
    window.form.typeOfRent.removeEventListener('change', window.form.getMinPrice);
    window.form.timeIn.removeEventListener('change', window.form.syncTimeOutWithIn);
    window.form.timeOut.removeEventListener('change', window.form.syncTimeInWithOut);
    window.data.map.removeEventListener('click', window.popup.onClickMapPin);
    formReset.removeEventListener('click', deActivateMap);

    window.form.title.removeEventListener('invalid', function () {
      window.form.validationEmpty(window.form.title);
    });
    window.form.title.removeEventListener('input', window.form.validationTitleInput);
    window.form.priceOfRent.removeEventListener('invalid', function () {
      window.form.validationEmpty(window.form.priceOfRent);
    });
  }

  setDefaultParameters();

})();

'use strict';

(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // находим шаблон метки которую будем вставлять
  var pinsBlock = document.querySelector('.map__pins'); // находим блок в который будем вставлять наши метки
  var pinMain = window.data.map.querySelector('.map__pin--main'); // главный пин
  var pinMainDefaultLeft = '570px';
  var pinMainDefaultTop = '375px';
  var pinsArray;

  /**
   * Готовим Pin для рендеринга
   * @param {object} object - объект из которого будут браться данные для отображения Pin-а
   * @param {number} number - порядковый номер объекта в массиве
   * @return {object}
   */
  function renderPin(object, number) {
    var pin = pinTemplate.cloneNode(true);

    // положение пина с учетом его размеров
    pin.style.left = object.location.x + pin.offsetWidth / 2 + 'px';
    pin.style.top = object.location.y + pin.offsetHeight + 'px';

    // берем из нашего объекта данные для img
    pin.querySelector('img').src = object.author.avatar;
    pin.querySelector('img').alt = object.title;

    // добавим
    pin.dataset.number = number;

    return pin;
  }

  function renderPinsOnMap(array) {
    var fragment = document.createDocumentFragment();

    // для начала отрендерим их во fragment
    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(renderPin(window.pin.pinsArray[i], i));
    }

    // теперь fragment отобразим на странице
    pinsBlock.appendChild(fragment);
  }

  function onSuccessLoadData(data) {
    window.pin.pinsArray = window.filter.getFilteredArray(data);
    renderPinsOnMap(window.pin.pinsArray);
  }

  function onErrorLoadData(errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  }

  window.pin = {
    /**
     * отображает наши пины на странице
     * @param {object} array - массив с объектами из которых берутся данные для пинов
     */
    renderPinsToMap: function () {
      window.load(onSuccessLoadData, onErrorLoadData);
    },

    pinsArray: pinsArray,

    // удаляем со страницы все элементы, кроме первого (элемент 0). (В нашей цели - в нем находится главный пин)
    unRenderPinsToMap: function (array) {
      for (var i = 1; i < array.length; i++) {
        array[i].remove();
      }
      window.pin.pinsArray = [];
    },

    pinsBlock: pinsBlock,
    pinMain: pinMain,
    pinMainDefaultLeft: pinMainDefaultLeft,
    pinMainDefaultTop: pinMainDefaultTop
  };
})();

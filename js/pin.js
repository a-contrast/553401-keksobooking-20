'use strict';


(function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // находим шаблон метки которую будем вставлять
  var pinsBlock = document.querySelector('.map__pins'); // находим блок в который будем вставлять наши метки

  /**
   * Готовим Pin для рендеринга
   * @param {object} object - объект из которого будут браться данные для отображения Pin-а
   * @return {object}
   */
  function renderPin(object) {
    var pin = pinTemplate.cloneNode(true);

    // положение пина с учетом его размеров
    pin.style.left = object.location.x + pin.offsetWidth / 2 + 'px';
    pin.style.top = object.location.y + pin.offsetHeight + 'px';

    // берем из нашего объекта данные для img
    pin.querySelector('img').src = object.author.avatar;
    pin.querySelector('img').alt = object.title;

    // добавим
    pin.dataset.number = object.number;

    return pin;
  }

  window.pin = {
    /**
     * отображает наши пины на странице
     * @param {object} array - массив с объектами из которых берутся данные для пинов
     */
    renderPinsToMap: function (array) {
      var fragment = document.createDocumentFragment();

      // для начала отрендерим их во fragment
      for (var i = 0; i < array.length; i++) {
        fragment.appendChild(renderPin(array[i]));
      }

      // теперь fragment отобразим на странице
      pinsBlock.appendChild(fragment);
    },

    // удаляем со страницы все элементы, кроме первого (элемент 0). (В нашей цели - в нем находится главный пин)
    unRenderPinsToMap: function (array) {
      for (var i = 1; i < array.length; i++) {
        array[i].remove();
      }
    },

    pinsBlock: pinsBlock
  };
})();

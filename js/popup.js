'use strict';

(function () {
  var popup; // после создания попапа = map.querySelector('.map__card');
  var popupCloseBtn; // после создания попапа = popup.querySelector('.popup__close');

  /**
   * получаем атрибут number от элемента на который нажали
   * @param {object} element - пин на который нажали
   * @return {number}
   */
  function getAttributeNumber(element) {
    var number = element.getAttribute('data-number');
    return number;
  }

  /**
   * отображает карточку жилища, добавляет слушателей на закрытие
   * @param {number} number - число взятое из атрибута number пина, на который нажали
   */
  function openPopup(number) {
    if (popup) {
      popup.remove();
    }

    window.card.renderCardToMap(window.data.mapObjects[number]);
    popup = window.data.map.querySelector('.map__card');
    popupCloseBtn = popup.querySelector('.popup__close');

    window.data.map.addEventListener('keydown', function (evt) {
      if (evt.key === 'Escape') {
        closePopup();
      }
    });

    popupCloseBtn.addEventListener('click', function () {
      closePopup();
    });
  }

  // закрываем карточку жилья, удаляем слушателей
  function closePopup() {
    window.data.map.removeEventListener('keydown', function (evt) {
      if (evt.key === 'Escape') {
        closePopup();
      }
    });

    popupCloseBtn.removeEventListener('click', function () {
      closePopup();
    });

    popup.remove();
  }

  window.popup = {
    onClickMapPin: function (evt) {
      var pin = evt.target.closest('.map__pin');

      if (!pin) {
        return;
      }

      if (pin.hasAttribute('data-number')) {
        openPopup(getAttributeNumber(pin));
      }
    }
  };

})();

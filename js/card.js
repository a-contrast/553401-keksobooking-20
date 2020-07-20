'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card'); // шаблон карточки которую будем вставлять
  var mapFilters = document.querySelector('.map__filters-container'); // ПЕРЕД этим блоком вставим наши карточки
  // тип жилья
  var popupType = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  /**
   * убирает блоки из разметки (блоки с опциями в карточке, которых нет в выбранном жилье)
   * @param {object} object - объект жилья из массива (mapObjects)
   * @param {object} template - темплейт в котором производим действия
   * @param {object} array - массив FEATURES
   */
  function popupFeatures(object, template, array) {
    for (var i = 0; i < array.length; i++) {
      if (!object.offer.features.includes(array[i])) {
        template.querySelector('.popup__feature--' + array[i]).remove();
      }
    }
  }

  /**
   * возвращает фотографию с нужным src для рендеринга в карточке
   * @param {object} arrialObject - объект (ссылка на фотографию) из массива фотографий
   * @param {object} template - темплейт в котором производим действия
   * @return {object}
   */
  function renderPhoto(arrialObject, template) {
    var photo = template.querySelector('.popup__photo').cloneNode(true);
    photo.src = arrialObject;

    return photo;
  }

  /**
   * отрисовывает фотографии в карточке
   * @param {object} array - массив со ссылками на фотографии
   * @param {object} template - темплейт в котором производим действия
   */
  function renderPhotoToCard(array, template) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(renderPhoto(array[i], template));
    }

    template.querySelector('.popup__photos').append(fragment);
    template.querySelector('.popup__photo' + ':first-child').remove();
  }

  /**
   * возвращает карточку с данными для пина для рендеринга на странице
   * @param {object} object - объект недвижимости
   * @return {object}
   */
  function renderCard(object) {
    var card = cardTemplate.cloneNode(true);

    card.querySelector('.popup__title').textContent = object.offer.title;
    card.querySelector('.popup__text--address').textContent = object.offer.address;
    card.querySelector('.popup__text--price').textContent = object.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = popupType[object.offer.type];
    card.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ' , выезд до ' + object.offer.checkout;
    card.querySelector('.popup__description').textContent = object.offer.description;
    card.querySelector('.popup__avatar').src = object.author.avatar;

    popupFeatures(object, card, window.data.FEATURES);
    renderPhotoToCard(object.offer.photos, card);

    return card;
  }

  window.card = {
    /**
     * отображает карточку жилья на странице
     * @param {object} cardObject - объект для отображения карточки
     */
    renderCardToMap: function (cardObject) {
      mapFilters.before(renderCard(cardObject));
    }
  };
})();

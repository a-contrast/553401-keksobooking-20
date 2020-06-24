'use strict';

(function () {
  // заголовок предложения
  var TITLES = [
    'Заголовок 1',
    'Заголовок 2',
    'Заголовок 3',
    'Заголовок 4',
    'Заголовок 5',
    'Заголовок 6',
    'Заголовок 7',
    'Заголовок 8'
  ];
  // тип жилья
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  // количество комнат
  var ROOMS = [1, 2, 3];
  // количество гостей
  var GUESTS = [0, 1, 2];
  // время заезда/выезда
  var TIMES = ['12:00', '13:00', '14:00'];
  // дополнительные критерии
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  // описание жилья
  var DESCRIPTION = [
    'Описание 1',
    'Описание 2',
    'Описание 3',
    'Описание 4',
    'Описание 5',
    'Описание 6',
    'Описание 7',
    'Описание 8'
  ];
  // фотографии
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var MAP_OBJECTS_LENGTH = 8;

  var map = document.querySelector('.map'); // находим блок с картой

  /**
   * Возвращает созданный объект с данными
   * @param {*} idIndex - данный индекс будем использовать при поиске нужного объявления на карте, его запишем в data-id
   * @return {object}
   */
  function getObject(idIndex) {
    // случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка, "y": случайное число, координата y метки на карте от 130 до 630.
    var location = {x: window.utils.getRandomInRange(0, map.offsetWidth), y: window.utils.getRandomInRange(130, 630)};

    return {
      number: idIndex,
      author: {
        avatar: ''
      },

      offer: {
        title: window.utils.getRandomFromArray(TITLES),
        address: location.x + ', ' + location.y,
        price: window.utils.getRandomInRange(1, 50000),
        type: window.utils.getRandomFromArray(TYPES),
        rooms: window.utils.getRandomFromArray(ROOMS),
        guests: window.utils.getRandomFromArray(GUESTS),
        checkin: window.utils.getRandomFromArray(TIMES),
        checkout: window.utils.getRandomFromArray(TIMES),
        features: window.utils.getRandomSliceArray(FEATURES),
        description: window.utils.getRandomFromArray(DESCRIPTION),
        photos: window.utils.getRandomSliceArray(PHOTOS)
      },

      location: location
    };
  }

  /**
   * Возвращает готовый массив из объектов
   * @param {number} arrayLength - длина массива(кол-во необходимых объктов)
   * @return {object}
   */
  function getObjectsArray(arrayLength) {
    var mapObjects = []; // наш массив объектов с данными, который мы будем заполнять полученными объектами

    for (var i = 0; i < arrayLength; i++) {
      var mapObject = getObject(i);
      mapObject.author.avatar = 'img/avatars/user0' + (i + 1) + '.png';
      mapObjects.push(mapObject);
    }

    return mapObjects;
  }

  window.data = {
    mapObjects: getObjectsArray(MAP_OBJECTS_LENGTH),
    FEATURES: FEATURES,
    PHOTOS: PHOTOS,
    map: map
  };

})();

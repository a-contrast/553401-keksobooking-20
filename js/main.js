'use strict';

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

var map = document.querySelector('.map'); // находим блок с картой
var pinsBlock = document.querySelector('.map__pins'); // находим блок в который будем вставлять наши метки
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // находим шаблон метки которую будем вставлять

// делаем блок видимым
function mapToggle() {
  if (map.classList.contains('map--faded')) {
    map.classList.remove('map--faded');
  } else {
    map.classList.add('map--faded');
  }
}

/**
 * Возвращает случайное число
 * @param {number} min - начало диапазона
 * @param {number} max - конец диапазона
 * @return {number}
 */
function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Возвращает содержимое случайной ячейки архива
 * @param {object} array - массив
 * @return {int}
 */
function getRandomFromArray(array) {
  var randomArrayIndex = Math.floor(Math.random() * array.length);
  return array[randomArrayIndex];
}

/**
 * Возвращает рандомно урезанный массив
 * @param {object} array - массив
 * @return {object}
 */
function getRandomSliceArray(array) {
  return array.slice(0, getRandomInRange(0, array.length));
}

/**
 * Возвращает созданный объект с данными
 * @return {object}
 */
function getObject() {
  // случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка, "y": случайное число, координата y метки на карте от 130 до 630.
  var location = {x: getRandomInRange(0, map.offsetWidth), y: getRandomInRange(130, 630)};
  var time = getRandomFromArray(TIMES);

  return {
    author: {
      avatar: ''
    },

    offer: {
      title: getRandomFromArray(TITLES),
      address: location.x + ', ' + location.y,
      price: getRandomInRange(1, 50000),
      type: getRandomFromArray(TYPES),
      rooms: getRandomFromArray(ROOMS),
      guests: getRandomFromArray(GUESTS),
      checkin: time,
      checkout: time,
      features: getRandomSliceArray(FEATURES),
      description: getRandomFromArray(DESCRIPTION),
      photos: getRandomSliceArray(PHOTOS)
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

  for (var i = 1; i <= arrayLength; i++) {
    var mapObject = getObject();
    mapObject.author.avatar = 'img/avatars/user0' + i + '.png';
    mapObjects.push(mapObject);
  }

  return mapObjects;
}

/**
 * Обозначает отображение Pin-а
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

  return pin;
}

/**
 * отображает наши пины на странице
 * @param {object} array - массив с объектами из которых берутся данные для пинов
 */
function renderPinsToMap(array) {
  var fragment = document.createDocumentFragment();

  // для начала отрендерим их во fragment
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(renderPin(array[i]));
  }

  // теперь fragment отобразим на странице
  pinsBlock.appendChild(fragment);
}

var mapObjects = getObjectsArray(8); // получаем массив из созданных объектов
mapToggle(); // делаем блок .map видимым
renderPinsToMap(mapObjects); // отрисовываем пины

'use strict';

// заголовок предложения
var TITLES = ['Заголовок 1', 'Заголовок 2', 'Заголовок 3', 'Заголовок 4', 'Заголовок 5', 'Заголовок 6', 'Заголовок 7', 'Заголовок 8'];
// тип жилья
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
// количество комнат
var ROOMS = [1, 2, 3];
// количество гостей
var GUESTS = [0, 1, 2];
// время заезда/выезда
var TIMES = ['12:00', '13:00', '14:00'];
// дополнительные критерии
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
// описание жилья
var DESCRIPTION = ['Описание 1', 'Описание 2', 'Описание 3', 'Описание 4', 'Описание 5', 'Описание 6', 'Описание 7', 'Описание 8'];
// фотографии
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map'); // находим блок с картой
var pinsBlock = document.querySelector('.map__pins'); // находим блок в который будем вставлять
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // находим шаблон метки которую будем вставлять
var objects = []; // наш массив объектов с данными, который мы будем заполнять

map.classList.remove('map--faded'); // временное решение (по заданию)

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
 * @param {number} i - назначается в getObjectsArray
 * @return {object}
 */
function getObject(i) {
  var locationX = getRandomInRange(0, map.offsetWidth); // случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
  var locationY = getRandomInRange(130, 630); // "y": случайное число, координата y метки на карте от 130 до 630.

  return {
    author: {
      avatar: 'img/avatars/user0' + i + '.png' // строка, адрес изображения
    },

    offer: {
      title: getRandomFromArray(TITLES), // строка, заголовок предложения
      address: locationX + ', ' + locationY, // строка, адрес предложения
      price: getRandomInRange(1, 50000), // число, стоимость
      type: getRandomFromArray(TYPES), // palace, flat, house или bungalo
      rooms: getRandomFromArray(ROOMS), // число, количество комнат
      guests: getRandomFromArray(GUESTS), // число, количество гостей, которое можно разместить
      checkin: getRandomFromArray(TIMES), // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00
      checkout: getRandomFromArray(TIMES), // строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00
      features: getRandomSliceArray(FEATURES), // массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"
      description: getRandomFromArray(DESCRIPTION), // строка с описанием
      photos: getRandomSliceArray(PHOTOS) // массив строк случайной длины, содержащий адреса фотографий
    },

    // координаты пина
    location: {
      x: locationX,
      y: locationY
    }
  };
}

/**
 * Возвращает готовый массив из объектов
 * @param {number} arrayLength - длина массива(кол-во необходимых объктов)
 * @return {object}
 */
function getObjectsArray(arrayLength) {
  for (var i = 1; i <= arrayLength; i++) {
    objects.push(getObject(i));
  }
  return objects;
}

objects = getObjectsArray(8); // получаем массив из созданных объектов

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

// отображаем наши пины
function renderPinsToMap() {
  var fragment = document.createDocumentFragment();

  // для начала отрендерим их во fragment
  for (var i = 0; i < objects.length; i++) {
    fragment.appendChild(renderPin(objects[i]));
  }

  // теперь fragment отобразим на странице
  pinsBlock.appendChild(fragment);
}

renderPinsToMap();

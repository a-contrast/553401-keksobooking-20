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
  // 'Описание 1',
  // 'Описание 2',
  // 'Описание 3',
  // 'Описание 4',
  // 'Описание 5',
  // 'Описание 6',
  // 'Описание 7',
  // 'Описание 8'
];
// фотографии
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var map = document.querySelector('.map'); // находим блок с картой
var pinsBlock = document.querySelector('.map__pins'); // находим блок в который будем вставлять наши метки
var beforeCardsBlock = document.querySelector('.map__filters-container'); // ПЕРЕД этим блоком вставим наши карточки
// находим шаблон метки которую будем вставлять
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
// находим шаблон карточки которую будем вставлять
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');


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
      checkin: getRandomFromArray(TIMES),
      checkout: getRandomFromArray(TIMES),
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

/**
 * возвращает карточку с данными для пина для рендеринга на странице
 * @param {object} object - объект из массива с рандомными данными
 * @return {object}
 */
function renderCard(object) {
  var card = cardTemplate.cloneNode(true);

  card.querySelector('.popup__title').textContent = object.offer.title;
  card.querySelector('.popup__text--address').textContent = object.offer.address;
  card.querySelector('.popup__text--price').textContent = object.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = popupType();
  card.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ' , выезд до ' + object.offer.checkout;
  card.querySelector('.popup__description').textContent = object.offer.description;
  card.querySelector('.popup__avatar').src = object.author.avatar;

  /**
   * возвращает фотографию с нужным src для рендеринга в карточке
   * @param {object} arrialObject
   * @return {object}
   */
  function renderPhoto(arrialObject) {
    var photo = card.querySelector('.popup__photo').cloneNode(true);
    photo.src = arrialObject;

    return photo;
  }

  /**
   * отрисовывает фотографии в карточке
   * @param {object} array - массив со ссылками на фотографии
   */
  function renderPhotoToCard(array) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(renderPhoto(array[i]));
    }

    card.querySelector('.popup__photos').append(fragment);
    card.querySelector('.popup__photo' + ':first-child').remove();
  }

  // возвращает тип жилья
  function popupType() {
    var type;

    if (object.offer.type === 'flat') {
      type = 'Квартира';
    } else {
      if (object.offer.type === 'bungalo') {
        type = 'Бунгало';
      } else {
        if (object.offer.type === 'house') {
          type = 'Дом';
        } else {
          type = 'Дворец';
        }
      }
    }

    return type;
  }

  // убирает блоки из разметки (блоки с опциями, которых нет в выбранном жилье)
  function popupFeatures() {
    for (var i = 0; i < FEATURES.length; i++) {
      if (!object.offer.features.includes(FEATURES[i])) {
        card.querySelector('.popup__feature--' + FEATURES[i]).remove();
      }
    }
  }

  popupFeatures();
  renderPhotoToCard(PHOTOS);

  return card;
}

// создает и возвращает блок для отображения карточек
function makeMapCardsBlock() {
  var cardsBlock;
  beforeCardsBlock.insertAdjacentHTML('beforebegin', '<div class="map__cards"></div>');
  cardsBlock = document.querySelector('.map__cards');

  return cardsBlock;
}

/**
 * отображает карточки на странице
 * @param {object} array - массив с рандомными объектами
 */
function renderCardsToPin(array) {
  var fragment = document.createDocumentFragment();

  // для начала отрендерим их во fragment
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(renderCard(array[i]));
  }

  // теперь fragment отобразим на странице
  cardsBlock.appendChild(fragment);
}

var mapObjects = getObjectsArray(8); // получаем массив из созданных объектов
var cardsBlock = makeMapCardsBlock(); // создаем блок для отображения карточек
mapToggle(); // делаем блок .map видимым
renderPinsToMap(mapObjects); // отрисовываем пины
renderCardsToPin(mapObjects); // отрисовываем карточки

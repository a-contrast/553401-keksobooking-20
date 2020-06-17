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
// var beforeCardsBlock = document.querySelector('.map__filters-container'); // ПЕРЕД этим блоком вставим наши карточки
// находим шаблон метки которую будем вставлять
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
// находим шаблон карточки которую будем вставлять
// var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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

// удаляем со страницы все элементы, кроме первого (элемент 0), в наших целях, в нем находится главный пин
function unRenderPinsToMap(array) {
  for (var i = 1; i < array.length; i++) {
    array[i].remove();
  }
}

/**
 * возвращает карточку с данными для пина для рендеринга на странице
 * @param {object} object - объект из массива с рандомными данными
 * @return {object}
 */
// function renderCard(object) {
//   var card = cardTemplate.cloneNode(true);

//   card.querySelector('.popup__title').textContent = object.offer.title;
//   card.querySelector('.popup__text--address').textContent = object.offer.address;
//   card.querySelector('.popup__text--price').textContent = object.offer.price + '₽/ночь';
//   card.querySelector('.popup__type').textContent = popupType();
//   card.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
//   card.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ' , выезд до ' + object.offer.checkout;
//   card.querySelector('.popup__description').textContent = object.offer.description;
//   card.querySelector('.popup__avatar').src = object.author.avatar;

//   /**
//    * возвращает фотографию с нужным src для рендеринга в карточке
//    * @param {object} arrialObject
//    * @return {object}
//    */
//   function renderPhoto(arrialObject) {
//     var photo = card.querySelector('.popup__photo').cloneNode(true);
//     photo.src = arrialObject;

//     return photo;
//   }

//   /**
//    * отрисовывает фотографии в карточке
//    * @param {object} array - массив со ссылками на фотографии
//    */
//   function renderPhotoToCard(array) {
//     var fragment = document.createDocumentFragment();

//     for (var i = 0; i < array.length; i++) {
//       fragment.appendChild(renderPhoto(array[i]));
//     }

//     card.querySelector('.popup__photos').append(fragment);
//     card.querySelector('.popup__photo' + ':first-child').remove();
//   }

//   // возвращает тип жилья
//   function popupType() {
//     var type;
//     switch (object.offer.type) {
//       case 'flat':
//         type = 'Квартира';
//         break;
//       case 'bungalo':
//         type = 'Бунгало';
//         break;
//       case 'house':
//         type = 'Дом';
//         break;
//       case 'palace':
//         type = 'Дворец';
//         break;
//     }

//     return type;
//   }

//   // убирает блоки из разметки (блоки с опциями, которых нет в выбранном жилье)
//   function popupFeatures() {
//     for (var i = 0; i < FEATURES.length; i++) {
//       if (!object.offer.features.includes(FEATURES[i])) {
//         card.querySelector('.popup__feature--' + FEATURES[i]).remove();
//       }
//     }
//   }

//   popupFeatures();
//   renderPhotoToCard(PHOTOS);

//   return card;
// }

/**
 * отображает карточку жилья на странице
 * @param {object} cardObject - объект для отображения карточки
 */
// function renderCardToMap(cardObject) {
//   beforeCardsBlock.before(renderCard(cardObject));
// }

var mapObjects = getObjectsArray(8); // получаем массив из созданных объектов
// renderCardToMap(mapObjects[0]); // отрисовываем карточку жилья

// ///////////////////////////////////////////////////////////////////////////////////////////////////////

var MIN_TITLE_LENGTH = 30; // минимальная длина заголовка
var MAX_TITLE_LENGTH = 100; // максимальная длина заголовка

var pinMain = map.querySelector('.map__pin--main'); // главный пин
var form = document.querySelector('.ad-form'); // форма для нашего объявления
var formFieldsets = form.querySelectorAll('fieldset'); // находим ВЕ fieldset-ы в форме
var addressInput = form.querySelector('#address'); // поле с адресом
var title = form.querySelector('#title'); // поле для написания заголовка
var typeOfRent = form.querySelector('#type'); // поле с типом жилья
var priceOfRent = form.querySelector('#price'); // поле с ценой
var timeIn = form.querySelector('#timein'); // select со временем заезда
var timeOut = form.querySelector('#timeout'); // select со временем выезда
var roomNumber = form.querySelector('#room_number'); // select с количеством комнат
var capacity = form.querySelector('#capacity'); // select с количеством гостей
var formReset = form.querySelector('.ad-form__reset'); // кнопка сброса формы

/**
 * назначаем атрибут disabled для элементов массива
 * @param {object} array - массив, в данном случае список fieldset-ов
 */
function setAttributeDisabled(array) {
  for (var i = 0; i < array.length; i++) {
    array[i].disabled = true;
  }
}

/**
 * убираем атрибут disabled для элементов массива
 * @param {object} array  - массив, в данном случае список fieldset-ов
 */
function removeAttributeDisabled(array) {
  for (var i = 0; i < array.length; i++) {
    array[i].disabled = false;
  }
}

// валидация ввода заголовка
function validationTitleDefault() {
  if (title.validity.valueMissing) {
    title.setCustomValidity('Обязательное поле');
  } else {
    title.setCustomValidity('');
  }
}

// валидация ввода заголовка
function validationTitleInput() {
  var valueLength = title.value.length;

  if (valueLength < MIN_TITLE_LENGTH) {
    title.setCustomValidity('Ну же, еще ' + (MIN_TITLE_LENGTH - valueLength) + ' симв.');
  } else if (valueLength > MAX_TITLE_LENGTH) {
    title.setCustomValidity('Удалите лишние ' + (valueLength - MAX_TITLE_LENGTH) + ' симв.');
  } else {
    title.setCustomValidity('');
  }
}

/**
 * узнаем координаты главного пина pinMain
 * @param {object} inputBlock - блок ввода координат (readonly)
 * @param {object} pin - pinMain
 */
function setCoordinateToInput(inputBlock, pin) {
  var x = Math.round(parseInt(pin.style.left, 10) + pin.offsetWidth / 2);
  var y = Math.round(parseInt(pin.style.top, 10) + pin.offsetHeight);

  // если карта неактивна
  if (map.classList.contains('map--faded')) {
    y = Math.round(parseInt(pin.style.top, 10) + pin.offsetHeight / 2);
  }

  inputBlock.value = x + ', ' + y;
}

// устанавливает атрибуты min и placeholder для поля price в зависимости от выбранного жилья
function getMinPrice() {
  switch (typeOfRent.value) {
    case 'flat':
      priceOfRent.setAttribute('min', '1000');
      priceOfRent.setAttribute('placeholder', '1000');
      break;
    case 'bungalo':
      priceOfRent.setAttribute('min', '0');
      priceOfRent.setAttribute('placeholder', '0');
      break;
    case 'house':
      priceOfRent.setAttribute('min', '5000');
      priceOfRent.setAttribute('placeholder', '5000');
      break;
    case 'palace':
      priceOfRent.setAttribute('min', '10000');
      priceOfRent.setAttribute('placeholder', '10000');
      break;
  }
}

// валидируем на соответствие друг другу два селекта - с количеством комнат и количеством гостей
function getCapacity() {
  capacity.setCustomValidity('');
  switch (roomNumber.value) {
    case '1':
      if (capacity.value !== '1') {
        capacity.setCustomValidity('Вы можете взять с собой одного гостя, выберите правильный вариант');
      }
      break;
    case '2':
      if (capacity.value !== '1' || capacity.value !== '2') {
        capacity.setCustomValidity('Вы можете взять с собой одного или двух гостей, выберите правильный вариант');
      }
      break;
    case '3':
      if (capacity.value === '0') {
        capacity.setCustomValidity('Скучно будет одному, нужно позвать гостей, выберите правильный вариант');
      }
      break;
    case '100':
      if (capacity.value !== '0') {
        capacity.setCustomValidity('Столько комнат, а вот гостей сюда позвать нельзя, выберите правильный вариант');
      }
      break;
  }
}

// валидация поля с прайсом
priceOfRent.addEventListener('invalid', function () {
  if (priceOfRent.validity.valueMissing) {
    priceOfRent.setCustomValidity('Обязательное поле');
  } else {
    priceOfRent.setCustomValidity('');
  }
});

// валидация поля с прайсом
priceOfRent.addEventListener('input', function () {
  var price = priceOfRent.value;
  var minPrice = Number(priceOfRent.getAttribute('min'));
  var maxPrice = Number(priceOfRent.getAttribute('max'));

  if (price < minPrice) {
    priceOfRent.setCustomValidity('Добавьте еще ' + (minPrice - price) + ' рублей');
  } else if (price > maxPrice) {
    priceOfRent.setCustomValidity('За эту цену проще купить, чем снимать, максимальная сумма для ввода ' + maxPrice + ' руб.');
  } else {
    priceOfRent.setCustomValidity('');
  }
});

// синхронизируем поля с временем заезда - выезда
function syncTimeInWithOut() {
  timeIn.value = timeOut.value;
}

function syncTimeOutWithIn() {
  timeOut.value = timeIn.value;
}

// устанавливает значения при открытии страницы
function setDefaultParameters() {
  addressInput.readonly = true;

  getMinPrice();
  getCapacity();
  setAttributeDisabled(formFieldsets);
  setCoordinateToInput(addressInput, pinMain);
}

// действия при активации карты
function activateMap() {
  map.classList.remove('map--faded'); // делаем блок .map видимым
  form.classList.remove('ad-form--disabled'); // делаем форму доступной

  renderPinsToMap(mapObjects); // отрисовываем пины
  setCoordinateToInput(addressInput, pinMain);
  removeAttributeDisabled(formFieldsets); // делаем поля формы доступными

  title.addEventListener('invalid', validationTitleDefault);
  title.addEventListener('input', validationTitleInput);
  roomNumber.addEventListener('change', getCapacity);
  capacity.addEventListener('change', getCapacity);
  typeOfRent.addEventListener('change', getMinPrice);
  timeIn.addEventListener('change', syncTimeOutWithIn);
  timeOut.addEventListener('change', syncTimeInWithOut);
  formReset.addEventListener('click', deActivateMap);

}

// действия для Деактивации карты
function deActivateMap() {
  var allPins = pinsBlock.querySelectorAll('.map__pin'); // найдем и запишем в псевдомассив отрисованные пины

  map.classList.add('map--faded');
  form.classList.add('ad-form--disabled'); // делаем форму доступной

  unRenderPinsToMap(allPins);
  setDefaultParameters();

  title.removeEventListener('invalid', validationTitleDefault);
  title.addEventListener('input', validationTitleInput);
  roomNumber.removeEventListener('change', getCapacity);
  capacity.removeEventListener('change', getCapacity);
  typeOfRent.removeEventListener('change', getMinPrice);
  timeIn.removeEventListener('change', syncTimeOutWithIn);
  timeOut.removeEventListener('change', syncTimeInWithOut);
  formReset.removeEventListener('click', deActivateMap);

}

// действия по нажатию ЛЕВОЙ кнопкой мыши по главному пину
pinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    activateMap();
  }
});

// действия при нажатии кнопки открытия попапа клавишей ENTER
pinMain.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    activateMap();
  }
});

setDefaultParameters();

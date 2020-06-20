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
// объект со значениями ключей соотв. roomNumber.value и значений соотв. capacity.value
var roomsToCapacity = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};
// минимальная длина заголовка
var MIN_TITLE_LENGTH = 30;
// максимальная длина заголовка
var MAX_TITLE_LENGTH = 100;


var map = document.querySelector('.map'); // находим блок с картой
var pinsBlock = document.querySelector('.map__pins'); // находим блок в который будем вставлять наши метки
var mapFilters = document.querySelector('.map__filters-container'); // ПЕРЕД этим блоком вставим наши карточки
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin'); // находим шаблон метки которую будем вставлять
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card'); // находим шаблон карточки которую будем вставлять
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
var features = form.querySelector('.features'); // блок с чекбоксами
var formReset = form.querySelector('.ad-form__reset'); // кнопка сброса формы
var popup; // после создания попапа = map.querySelector('.map__card');
var popupCloseBtn; // после создания попапа = popup.querySelector('.popup__close');
// запишем значения по дефолту
var titleDefault = title.value;
var typeOfRentDefault = typeOfRent.value;
var priceOfRentDefault = priceOfRent.value;
var timeInDefault = timeIn.value;
var timeOutDefault = timeOut.value;
var roomNumberDefault = roomNumber.value;
var capacityDefault = capacity.value;

// устанавливает значения по дефолту
function setDefaultValues() {
  title.value = titleDefault;
  typeOfRent.value = typeOfRentDefault;
  priceOfRent.value = priceOfRentDefault;
  timeIn.value = timeInDefault;
  timeOut.value = timeOutDefault;
  roomNumber.value = roomNumberDefault;
  capacity.value = capacityDefault;
}

// устанавливает дефолтные значения для чекбоксов блока features
function setDefaultFeatures() {
  var featuresArray = features.querySelectorAll('input');
  for (var i = 0; i < featuresArray.length; i++) {
    featuresArray[i].checked = false;
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
 * @param {*} idIndex - данный индекс будем использовать при поиске нужного объявления на карте, его запишем в data-id
 * @return {object}
 */
function getObject(idIndex) {
  // случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка, "y": случайное число, координата y метки на карте от 130 до 630.
  var location = {x: getRandomInRange(0, map.offsetWidth), y: getRandomInRange(130, 630)};

  return {
    number: idIndex,
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

  for (var i = 0; i < arrayLength; i++) {
    var mapObject = getObject(i);
    mapObject.author.avatar = 'img/avatars/user0' + (i + 1) + '.png';
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

  // добавим
  pin.dataset.number = object.number;

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

// удаляем со страницы все элементы, кроме первого (элемент 0). (В нашей цели - в нем находится главный пин)
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
    switch (object.offer.type) {
      case 'flat':
        type = 'Квартира';
        break;
      case 'bungalo':
        type = 'Бунгало';
        break;
      case 'house':
        type = 'Дом';
        break;
      case 'palace':
        type = 'Дворец';
        break;
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

/**
 * отображает карточку жилья на странице
 * @param {object} cardObject - объект для отображения карточки
 */
function renderCardToMap(cardObject) {
  mapFilters.before(renderCard(cardObject));
}

/**
 * назначаем/убираем атрибут disabled для элементов массива
 * @param {object} array - массив, в данном случае список fieldset-ов
 * @param {boolean} isDisabled - true либо false, добавить либо убрать атрибут
 */
function toggleAttributeDisabled(array, isDisabled) {
  for (var i = 0; i < array.length; i++) {
    array[i].disabled = isDisabled;
  }
}

/**
 * валидация на пустое поле
 * @param {object} element - элемент который проверяем
 */
function validationEmpty(element) {
  if (element.validity.valueMissing) {
    element.setCustomValidity('Обязательное поле');
  } else {
    element.setCustomValidity('');
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
 * @param {object} inputBlock - инпут для отображения координат (readonly)
 * @param {object} pin - pinMain
 */
function setCoordinateToInput(inputBlock, pin) {
  var x = Math.round(parseInt(pin.style.left, 10) + pin.offsetWidth / 2);
  var y = Math.round(parseInt(pin.style.top, 10) + pin.offsetHeight);

  // если карта неактивна, координата является центром пина, а не острием
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
function validationCapacity() {
  var last = roomsToCapacity[roomNumber.value][roomsToCapacity[roomNumber.value].length - 1]; // последний элемент массива значений
  if (roomsToCapacity[roomNumber.value].includes(capacity.value)) {
    capacity.setCustomValidity('');
  } else {
    capacity.setCustomValidity('Вы можете взять с собой максимально ' + last + ' гостя, выберите правильный вариант');
  }
}

// валидация поля с прайсом
function validationPriceInput() {
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
}

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

  setDefaultValues();
  setDefaultFeatures();
  getMinPrice();
  // getCapacity();
  validationCapacity();
  toggleAttributeDisabled(formFieldsets, true);
  setCoordinateToInput(addressInput, pinMain);
}

// действия при активации карты
function activateMap() {
  map.classList.remove('map--faded'); // делаем блок .map видимым
  form.classList.remove('ad-form--disabled'); // делаем форму доступной

  renderPinsToMap(mapObjects); // отрисовываем пины
  setCoordinateToInput(addressInput, pinMain);
  toggleAttributeDisabled(formFieldsets, false); // делаем поля формы доступными

  title.addEventListener('invalid', function () {
    validationEmpty(title);
  });
  title.addEventListener('input', validationTitleInput);
  priceOfRent.addEventListener('invalid', function () {
    validationEmpty(priceOfRent);
  });
  priceOfRent.addEventListener('input', validationPriceInput);
  roomNumber.addEventListener('change', validationCapacity);
  capacity.addEventListener('change', validationCapacity);
  typeOfRent.addEventListener('change', getMinPrice);
  timeIn.addEventListener('change', syncTimeOutWithIn);
  timeOut.addEventListener('change', syncTimeInWithOut);
  formReset.addEventListener('click', deActivateMap);

  map.addEventListener('click', function (evt) {
    var pin = evt.target.closest('.map__pin');

    if (!pin) {
      return;
    }

    if (pin.hasAttribute('data-number')) {
      openPopup(getAttributeNumber(pin));
    }
  });
}

// действия для Деактивации карты
function deActivateMap() {
  var allPins = pinsBlock.querySelectorAll('.map__pin'); // найдем и запишем в псевдомассив отрисованные пины

  map.classList.add('map--faded');
  form.classList.add('ad-form--disabled'); // делаем форму доступной

  unRenderPinsToMap(allPins);
  setDefaultParameters();

  title.removeEventListener('invalid', function () {
    validationEmpty(title);
  });
  title.removeEventListener('input', validationTitleInput);
  priceOfRent.removeEventListener('invalid', function () {
    validationEmpty(priceOfRent);
  });
  priceOfRent.removeEventListener('input', validationPriceInput);
  roomNumber.removeEventListener('change', validationCapacity);
  capacity.removeEventListener('change', validationCapacity);
  typeOfRent.removeEventListener('change', getMinPrice);
  timeIn.removeEventListener('change', syncTimeOutWithIn);
  timeOut.removeEventListener('change', syncTimeInWithOut);
  formReset.removeEventListener('click', deActivateMap);

  map.removeEventListener('click', function (evt) {
    var pin = evt.target.closest('.map__pin');

    if (!pin) {
      return;
    }

    if (pin.hasAttribute('data-number')) {
      openPopup(getAttributeNumber(pin));
    }
  });
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

  renderCardToMap(mapObjects[number]);
  popup = map.querySelector('.map__card');
  popupCloseBtn = popup.querySelector('.popup__close');

  map.addEventListener('keydown', function (evt) {
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
  map.removeEventListener('keydown', function (evt) {
    if (evt.key === 'Escape') {
      closePopup();
    }
  });

  popupCloseBtn.removeEventListener('click', function () {
    closePopup();
  });

  popup.remove();
}

var mapObjects = getObjectsArray(8); // получаем массив из созданных объектов
setDefaultParameters();

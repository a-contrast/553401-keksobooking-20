'use strict';

(function () {
  // дополнительные критерии
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  // мин и макс координаты перемещения пина
  var MAP_COORDINATES = {
    x: {
      min: 0,
      max: 1200
    },
    y: {
      min: 130,
      max: 630
    }
  };

  var map = document.querySelector('.map'); // находим блок с картой

  window.data = {
    FEATURES: FEATURES,
    MAP_COORDINATES: MAP_COORDINATES,
    map: map
  };

})();

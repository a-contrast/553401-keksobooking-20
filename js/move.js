'use strict';

(function () {
  window.move = {
    /**
     * функция перемещения элемента
     * @param {object} evt - событие (в данном случае - это будет нажатие клавиши мыши)
     * @param {object} element - элемент, который перемещаем
     * @param {number} coordMinX - координата ограничения перемещения по X
     * @param {number} coordMaxX - координата ограничения перемещения по X
     * @param {number} coordMinY - координата ограничения перемещения по Y
     * @param {number} coordMaxY - координата ограничения перемещения по Y
     */
    onMoveElement: function (evt, element, coordMinX, coordMaxX, coordMinY, coordMaxY) {
      var dragged = false;

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      function onMouseMove(moveEvt) {
        dragged = true;

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        moveEvt.preventDefault();
        if ((element.offsetTop - shift.y) >= coordMinY && (element.offsetTop - shift.y) <= coordMaxY) {
          element.style.top = (element.offsetTop - shift.y) + 'px';
        }

        if ((element.offsetLeft - shift.x) >= (coordMinX - element.offsetWidth / 2) &&
            (element.offsetLeft - shift.x) <= (coordMaxX - element.offsetWidth / 2)) {
          element.style.left = (element.offsetLeft - shift.x) + 'px';
        }
      }

      function onClickPreventDefault(clickEvt) {
        clickEvt.preventDefault();
        element.removeEventListener('click', onClickPreventDefault);
      }

      function onMouseUp(upEvt) {
        if (dragged) {
          element.addEventListener('click', onClickPreventDefault);
        }

        upEvt.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      evt.preventDefault();
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

  };
})();

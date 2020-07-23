'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var DEFAULT_IMAGE_SRC = 'img/muffin-grey.svg';
  var DEFAULT_BG_COLOR_PHOTO = '#e4e4de';

  var avatarInput = document.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoHomeInput = document.querySelector('.ad-form__upload input[type=file]');
  var photoHomePreview = document.querySelector('.ad-form__photo');

  /**
   * Показывает превью загружаемых фото
   * @param {object} imageInput - поле для загрузки изображения
   * @param {object} imagePreview - поле для показа изображения
   */
  function showPreviewImage(imageInput, imagePreview) {
    var file = imageInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        if (imagePreview.src) {
          imagePreview.src = reader.result;
        } else {
          imagePreview.style.background = 'center / cover no-repeat ' + ' url(' + reader.result + ')';
        }
      });

      reader.readAsDataURL(file);
    }
  }

  window.loadImage = {
    showAvatar: function () {
      showPreviewImage(avatarInput, avatarPreview);
    },
    showHomeImage: function () {
      showPreviewImage(photoHomeInput, photoHomePreview);
    },
    defaultImage: function () {
      avatarPreview.src = DEFAULT_IMAGE_SRC;
      photoHomePreview.style.background = DEFAULT_BG_COLOR_PHOTO;
      avatarInput.value = '';
      photoHomeInput.value = '';
    },
    avatarInput: avatarInput,
    photoHomeInput: photoHomeInput
  };

})();

'use strict';

(function() {

  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector;
  }

})();

(function() {

  if (!Element.prototype.closest) {

    Element.prototype.closest = function(css) {
      var node = this;

      while (node) {
        if (node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
  }

})();

(function() {

  var navigator = document.querySelector('.page-header__navigator');
  var menuButton = navigator.querySelector('.page-header__toggle-menu');

  navigator.classList.remove('menu-opened');
  menuButton.addEventListener('click', function () {
    if (navigator.classList.contains('menu-opened')) {
      navigator.classList.remove('menu-opened');
    } else {
      navigator.classList.add('menu-opened');
    }
  });

})();

(function () {

  var slider = document.querySelector('.new__slider');
  var slidesWrap = slider.querySelector('.new__swiper-wrapper');
  var slides = slider.querySelectorAll('.new__swiper-slide');
  var panagination = slider.querySelector('.new__swiper-pagination');
  var leftArrow = slider.querySelector('.new__swiper-button-prev');
  var rightArrow = slider.querySelector('.new__swiper-button-next');
  var panaginationItems;
  var numderSliders = slides.length;
  var numberPanagination;
  var typeScreen;
  var listeners;
  var offset;
  var numberSwap;

  var startX = 0;
  var endX = 0;

  function getMobileSlider() {
    numberSwap = 0;
    numberPanagination = Math.ceil(numderSliders / 2);
    var span = document.createElement('span');
    span.textContent = '1 of ' + numberPanagination;
    panagination.appendChild(span);
    if (leftArrow && listeners) {
      leftArrow.removeEventListener('click', left);
      rightArrow.removeEventListener('click', right);
    }
    if (panaginationItems) {
      panaginationItems = null;
    }
    listeners = false;
    offset = 320;
    slidesWrap.style.marginLeft = '-30px';
  }

  function getWideSlider(numberShowPanagination) {
    numberSwap = 0;
    numberPanagination = Math.ceil(numderSliders / numberShowPanagination);
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < numberPanagination; i++) {
      var button = document.createElement('button');
      button.textContent = i + 1;
      button.classList.add('new__button-panagination');
      fragment.appendChild(button);
    }
    panagination.appendChild(fragment);
    panaginationItems = slider.querySelectorAll('.new__button-panagination');
    panaginationItems[0].classList.add('active');
    if (!listeners) {
      leftArrow.addEventListener('click', left);
      rightArrow.addEventListener('click', right);
    }
    for (var j = 0; j < panaginationItems.length; j++) {
      panaginationItems[j].addEventListener('click', move);
    }
    if (!leftArrow.hasAttribute('disabled')) {
      leftArrow.setAttribute('disabled', '');
    }
    if (rightArrow.hasAttribute('disabled')) {
      rightArrow.removeAttribute('disabled');
    }
    listeners = true;
    if (numberShowPanagination === 2) {
      offset = 708;
    } else {
      offset = 1200;
    }
    slidesWrap.style.marginLeft = '-30px';
  }

  function moveSlides () {
    slidesWrap.style.marginLeft = (-30 + (-(offset)) * numberSwap) + 'px';
    if (window.innerWidth < 768) {
      panagination.textContent = numberSwap + 1 + ' of ' + numberPanagination;
    } else {
      if (numberSwap === 0) {
        leftArrow.setAttribute('disabled', '');
      } else {
        if (leftArrow.hasAttribute('disabled')) {
          leftArrow.removeAttribute('disabled');
        }
      }
      if (numberPanagination === numberSwap + 1) {
        rightArrow.setAttribute('disabled', '');
      } else {
        if (rightArrow.hasAttribute('disabled')) {
          rightArrow.removeAttribute('disabled');
        }
      }
      for (var j = 0; j < panaginationItems.length; j++) {
        if (panaginationItems[j].classList.contains('active')) {
          panaginationItems[j].classList.remove('active');
        }
      }
      panaginationItems[numberSwap].classList.add('active');
    }
  }

  function right() {
    if (numberPanagination === numberSwap + 1) {
      return;
    }
    numberSwap++;
    moveSlides();
  }

  function left() {
    if (numberSwap === 0) {
      return;
    }
    numberSwap--;
    moveSlides();
  }

  function move(evt) {
    if (numberSwap === [].indexOf.call(panaginationItems, evt.target)) {
      return;
    }
    numberSwap = [].indexOf.call(panaginationItems, evt.target);
    moveSlides();
  }

  function handleGesture() {
    if (startX - endX >= 60) {
      right();
    }
    if (endX - startX >= 60) {
      left();
    }
    return;
  }

  function start(event) {
    startX = (event.type.search('touch') !== -1) ? event.changedTouches[0].screenX : event.screenX
  }

  function end(event) {
    endX = (event.type.search('touch') !== -1) ? event.changedTouches[0].screenX : event.screenX
    handleGesture();
  }

  if (window.innerWidth < 768) {
    typeScreen = 'mobile';
    getMobileSlider();
  }

  if (window.innerWidth >= 768 && window.innerWidth < 1024) {
    typeScreen = 'tablet';
    getWideSlider(2);
  }

  if (window.innerWidth >= 1024) {
    typeScreen = 'desktop';
    getWideSlider(4);
  }

  window.addEventListener('resize', function () {
    if(window.innerWidth < 768 && typeScreen === 'mobile') {
      return;
    }
    if (window.innerWidth < 768 && typeScreen !== 'mobile') {
      typeScreen = 'mobile';
      panagination.innerHTML = '';
      getMobileSlider();
    }
    if (window.innerWidth >= 768 && window.innerWidth < 1024 && typeScreen === 'tablet') {
      return;
    }
    if (window.innerWidth >= 768 && window.innerWidth < 1024 && typeScreen !== 'tablet') {
      typeScreen = 'tablet';
      panagination.innerHTML = '';
      getWideSlider(2);
    }
    if (window.innerWidth >= 1024 && typeScreen === 'desktop') {
      return;
    }
    if (window.innerWidth >= 1024 && typeScreen !== 'desktop') {
      typeScreen = 'desktop';
      panagination.innerHTML = '';
      getWideSlider(4);
    }
  }, false);

  slidesWrap.addEventListener('touchstart', start, false);
  slidesWrap.addEventListener('touchend', end, false);
  slidesWrap.addEventListener('mousedown', start, false);
  slidesWrap.addEventListener('mouseup', end, false);

})();

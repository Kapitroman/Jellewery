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

  if (!slider) {
    return;
  }

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

  function handleGesture(event) {
    if (startX - endX >= 60) {
      right();
    }
    if (endX - startX >= 60) {
      left();
    }
    if (endX === startX) {
      var linkElement = event.target.closest('.new__swiper-slide');
      var refLink = linkElement.getAttribute('href');
      window.location = refLink;
    }
    return;
  }

  function start(event) {
    event.preventDefault();
    startX = (event.type.search('touch') !== -1) ? event.changedTouches[0].screenX : event.screenX
  }

  function end(event) {
    endX = (event.type.search('touch') !== -1) ? event.changedTouches[0].screenX : event.screenX
    handleGesture(event);
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
  slidesWrap.addEventListener('mouseup', end, false);

})();

(function () {

  var questionsList = document.querySelector('.faq__list');

  if (!questionsList) {
    return;
  }

  var questions = questionsList.querySelectorAll('.faq__item p');
  var questionArrows = questionsList.querySelectorAll('.faq__item svg');
  for (var i = 0; i < questions.length; i++) {
    questions[i].classList.add('hiden');
    questionArrows[i].classList.add('rotated');
  }
  questionsList.addEventListener('click', function (evt) {
    var question = evt.target.closest('.faq__item');
    if (question) {
      if (question.querySelector('p').classList.contains('hiden')) {
        question.querySelector('p').classList.remove('hiden');
        question.querySelector('svg').classList.remove('rotated');
      } else {
        question.querySelector('p').classList.add('hiden');
        question.querySelector('svg').classList.add('rotated');
      }
    }
  });

})();

(function () {

  var filterButton = document.querySelector('.catalog__filter-button');
  if (!filterButton) {
    return;
  }

  var filter = document.querySelector('.filter');
  var body = document.querySelector('body');
  var closeButton = filter.querySelector('.filter__close-form');

  function clickfilterButtonHandler(evt) {
    evt.preventDefault();
    filter.classList.add('filter--modal');
    body.classList.add('body-lock');
  }

  function closeModal() {
    if (filter.classList.contains('filter--modal')) {
      filter.classList.remove('filter--modal');
    }
    body.classList.remove('body-lock');
  }

  filterButton.addEventListener('click', clickfilterButtonHandler);
  closeButton.addEventListener('click', closeModal);

})();

(function () {

  var filter = document.querySelector('.filter');

  if (!filter) {
    return;
  }

  var filterSections = filter.querySelectorAll('.filter__section');
  var filterGroups = filter.querySelectorAll('.filter__group');
  var filterArrows = filter.querySelectorAll('.filter__section svg');

  function clickSubHeaderHandler(evt) {
    var subHead = evt.target.closest('.filter__section h3');
    if (subHead) {
      if (this.querySelector('.filter__group').classList.contains('hidden')) {
        this.querySelector('.filter__group').classList.remove('hidden');
        this.querySelector('.filter__section svg').classList.remove('rotated');
      } else {
        this.querySelector('.filter__group').classList.add('hidden');
        this.querySelector('.filter__section svg').classList.add('rotated');
      }
    } else {
      return;
    }
  }

  for (var i = 0; i < filterGroups.length; i++) {
    filterGroups[i].classList.add('hidden');
    filterArrows[i].classList.add('rotated');
  }

  for (var j = 0; j < filterSections.length; j++) {
    filterSections[j].addEventListener('click', clickSubHeaderHandler);
  }

}) ();

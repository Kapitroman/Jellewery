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
  var body = document.querySelector('body');
  var menuOpened = false;

  navigator.classList.remove('menu-opened');
  menuButton.addEventListener('click', function () {
    if (navigator.classList.contains('menu-opened')) {
      navigator.classList.remove('menu-opened');
      body.classList.remove('body-lock');
      menuOpened = false;
    } else {
      navigator.classList.add('menu-opened');
      body.classList.add('body-lock');
      menuOpened = true;
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024 && !menuOpened) {
      return;
    }
    if (window.innerWidth >= 1024 && menuOpened) {
      navigator.classList.remove('menu-opened');
      body.classList.remove('body-lock');
      menuOpened = false;
    }
  }, false);

})();

(function () {

  var slider = document.querySelector('.new__slider');

  if (!slider) {
    return;
  }

  var slidesWrap = slider.querySelector('.new__swiper-wrapper');
  var slides = slider.querySelectorAll('.new__swiper-slide');
  var slidesImg = slider.querySelectorAll('.new__swiper-slide img');
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
  var sliderWidth;
  var slideWidth;

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
    offset = 320;
    getMobileSlider();
  }

  if (window.innerWidth >= 768 && window.innerWidth < 1024) {
    typeScreen = 'tablet';
    offset = 708;
    getWideSlider(2);
  }

  if (window.innerWidth >= 1024) {
    typeScreen = 'desktop';
    offset = 0.8565 * window.innerWidth + 30;
    getWideSlider(4);
  }

  window.addEventListener('resize', function () {
    if(window.innerWidth < 768 && typeScreen === 'mobile') {
      return;
    }
    if (window.innerWidth < 768 && typeScreen !== 'mobile') {
      offset = 320;
      slider.style.width = '290px';
      slidesWrap.style.width = '1920px';
      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = '130px';
        slidesImg[i].style.height = '136px';
      }
      typeScreen = 'mobile';
      panagination.innerHTML = '';
      getMobileSlider();
    }
    if (window.innerWidth >= 768 && window.innerWidth < 1024 && typeScreen === 'tablet') {
      return;
    }
    if (window.innerWidth >= 768 && window.innerWidth < 1024 && typeScreen !== 'tablet') {
      offset = 708;
      slider.style.width = '678px';
      slidesWrap.style.width = '4248px';
      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = '324px';
        slidesImg[i].style.height = '340px';
      }
      typeScreen = 'tablet';
      panagination.innerHTML = '';
      getWideSlider(2);
    }
    if (window.innerWidth >= 1024) {
      numberSwap = 0;
      slidesWrap.style.marginLeft = '-30px';
      sliderWidth = 0.8565 * window.innerWidth;
      slider.style.width = sliderWidth + 'px';
      slideWidth = (sliderWidth - 90) / 4;
      slidesWrap.style.width = ((slideWidth + 30) * 12) + 'px';
      offset = sliderWidth + 30;
      for (var i = 0; i < slides.length; i++) {
        slides[i].style.width = slideWidth + 'px';
        slidesImg[i].style.height = slideWidth * 1.0518 + 'px';
      }
      for (var j = 0; j < panaginationItems.length; j++) {
        if (panaginationItems[j].classList.contains('active')) {
          panaginationItems[j].classList.remove('active');
        }
      }
      panaginationItems[numberSwap].classList.add('active');
      if (typeScreen === 'desktop') {
        return;
      }
      if (typeScreen !== 'desktop') {
        typeScreen = 'desktop';
        panagination.innerHTML = '';
        getWideSlider(4);
      }
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
  var questionArrows = questionsList.querySelectorAll('.faq__wrap-svg');
  for (var i = 0; i < questions.length; i++) {
    questions[i].classList.add('hiden');
    questionArrows[i].classList.add('rotated');
  }

  function toggleTab(evt) {
    var question = evt.target.closest('.faq__item');
    if (question) {
      if (question.querySelector('p').classList.contains('hiden')) {
        question.querySelector('p').classList.remove('hiden');
        question.querySelector('.faq__wrap-svg').classList.remove('rotated');
      } else {
        question.querySelector('p').classList.add('hiden');
        question.querySelector('.faq__wrap-svg').classList.add('rotated');
      }
    }
  }

  questionsList.addEventListener('click', function (evt) {
    toggleTab(evt);
  });

  questionsList.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter' || evt.keyCode === 13) {
      toggleTab(evt);
    }
  });

})();

(function () {

  var loginLink = document.querySelector('.page-header__user-item--login a');

  if (!loginLink) {
    return;
  }

  var body = document.querySelector('body');
  var sectionLogin = document.querySelector('.login');
  var loginForm = sectionLogin.querySelector('.login form');
  var inputEmail = sectionLogin.querySelector('.login [type="email"]');

  var isStorageSupport = true;
  var storageEmail = "";

  function clickLoginLinkHandler(evt) {
    evt.preventDefault();
    sectionLogin.classList.add('modal-show');
    body.classList.add('body-lock');
    if (storageEmail) {
      inputEmail.value = localStorage.getItem('email');
    }
    inputEmail.focus();
  }

  function closeModal() {
    if (sectionLogin.classList.contains('modal-show')) {
      sectionLogin.classList.remove('modal-show');
    }
    body.classList.remove('body-lock');
  }

  function clickModalCloseHandler(evt) {
    if (!evt.target.closest('form')) {
      evt.preventDefault();
      return closeModal();
    }
    if (evt.target.closest('.login__close-button')) {
      evt.preventDefault();
      return closeModal();
    }
    return;
  }

  function pressEscHandler(evt) {
    if (evt.key === 'Escape' || evt.keyCode === 27) {
      evt.preventDefault();
      if (sectionLogin.classList.contains('modal-show')) {
        closeModal();
      }
    }
  }

  function submitFormHandler() {
    if (isStorageSupport) {
      localStorage.setItem('email', inputEmail.value);
    }
  }

  try {
    storageEmail = localStorage.getItem('email');
  } catch (err) {
    isStorageSupport = false;
  }

  loginLink.addEventListener('click', clickLoginLinkHandler);
  sectionLogin.addEventListener('click', clickModalCloseHandler);
  window.addEventListener('keydown', pressEscHandler);
  loginForm.addEventListener('submit', submitFormHandler);

})();



(function () {

  var addCardLink = document.querySelector('.card__button');

  if (!addCardLink) {
    return;
  }

  var body = document.querySelector('body');
  var sectionAddCard = document.querySelector('.added-cart');

  function clickLoginLinkHandler(evt) {
    evt.preventDefault();
    sectionAddCard.classList.add('modal-show');
    body.classList.add('body-lock');
  }

  function closeModal() {
    if (sectionAddCard.classList.contains('modal-show')) {
      sectionAddCard.classList.remove('modal-show');
    }
    body.classList.remove('body-lock');
  }

  function clickModalCloseHandler(evt) {
    if (!evt.target.closest('form')) {
      evt.preventDefault();
      return closeModal();
    }
    if (evt.target.closest('.added-cart__close-button')) {
      evt.preventDefault();
      return closeModal();
    }
    return;
  }

  function pressEscHandler(evt) {
    if (evt.key === 'Escape' || evt.keyCode === 27) {
      evt.preventDefault();
      if (sectionAddCard.classList.contains('modal-show')) {
        closeModal();
      }
    }
  }

  addCardLink.addEventListener('click', clickLoginLinkHandler);
  sectionAddCard.addEventListener('click', clickModalCloseHandler);
  window.addEventListener('keydown', pressEscHandler);

})();

(function () {

  var filterButton = document.querySelector('.catalog__filter-button');
  if (!filterButton) {
    return;
  }

  var filter = document.querySelector('.filter');
  var body = document.querySelector('body');
  var filterScript;

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

  function clickModalCloseHandler(evt) {
    if (!evt.target.closest('form')) {
      evt.preventDefault();
      return closeModal();
    }
    if (evt.target.closest('.filter__close-form')) {
      evt.preventDefault();
      return closeModal();
    }
    return;
  }

  function pressEscHandler(evt) {
    if (evt.key === 'Escape' || evt.keyCode === 27) {
      evt.preventDefault();
      if (filter.classList.contains('filter--modal')) {
        closeModal();
      }
    }
  }

  if (window.innerWidth < 1024) {
    filterScript = true;
    filterButton.addEventListener('click', clickfilterButtonHandler);
    filter.addEventListener('click', clickModalCloseHandler);
    window.addEventListener('keydown', pressEscHandler);
  }

  window.addEventListener('resize', function () {
    if(window.innerWidth < 1024 && filterScript) {
      return;
    }
    if (window.innerWidth < 1024 && !filterScript) {
      filterScript = true;
      filterButton.addEventListener('click', clickfilterButtonHandler);
      filter.addEventListener('click', clickModalCloseHandler);
      window.addEventListener('keydown', pressEscHandler);
    }
    if (window.innerWidth >= 1024 && !filterScript) {
      return;
    }
    if (window.innerWidth >= 1024 && filterScript) {
      filterScript = false;
      closeModal();
      filterButton.removeEventListener('click', clickfilterButtonHandler);
      filter.removeEventListener('click', clickModalCloseHandler);
      window.removeEventListener('keydown', pressEscHandler);
    }
  }, false);

})();

(function () {

  var filter = document.querySelector('.filter');

  if (!filter) {
    return;
  }

  var filterSections = filter.querySelectorAll('.filter__section');
  var filterGroups = filter.querySelectorAll('.filter__group');
  var filterArrows = filter.querySelectorAll('.filter__wrap-svg');

  function toggleSubHeader(evt) {
    var subHead = evt.target.closest('.filter__section h3');
    if (subHead) {
      if (this.querySelector('.filter__group').classList.contains('hidden')) {
        this.querySelector('.filter__group').classList.remove('hidden');
        this.querySelector('.filter__wrap-svg').classList.remove('rotated');
      } else {
        this.querySelector('.filter__group').classList.add('hidden');
        this.querySelector('.filter__wrap-svg').classList.add('rotated');
      }
    } else {
      return;
    }
  }

  for (var i = 0; i < filterGroups.length; i++) {
    filterGroups[i].classList.add('hidden');
    filterArrows[i].classList.add('rotated');

    filterSections[i].addEventListener('click', function (i) {
      return function (evt) {
        toggleSubHeader.call(filterSections[i], evt);
      }
    }(i));

    filterSections[i].addEventListener('keydown', function (i) {
      return function (evt) {
        if (evt.key === 'Enter' || evt.keyCode === 13) {
          toggleSubHeader.call(filterSections[i], evt);
        }
      }
    }(i));
  }

}) ();

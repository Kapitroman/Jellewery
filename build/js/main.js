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

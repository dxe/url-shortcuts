(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$window'];

  function HomeController($window) {
    var vm = this;
    $window.location.href = 'https://www.directactioneverywhere.com';
  }
}());

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatControllers',
  'ngAnimate'
]);
 
phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/intervention', {
        templateUrl: 'intervention.html',
        controller: 'InterventionCtrl'
      }).
	  when('/home', {
        templateUrl: 'home.html',
        controller: 'HomeCtrl'
      }).
	  when('/login', {
        templateUrl: 'login.html',
        controller: 'LoginCtrl'
      }).
	  when('/', {
        templateUrl: 'blank.html',
        controller: 'IndexCtrl'
      }).
	  when('/index', {
        templateUrl: 'login.html',
        controller: 'IndexCtrl'
      }).
	  when('/about', {
        templateUrl: 'about.html',
        controller: 'AboutCtrl'
      }).
	  when('/sync/:param1', {
        templateUrl: 'sync.html',
        controller: 'SyncCtrl'
      }).
	  when('/useful_info_details/:param1', {
        templateUrl: 'useful_info_details.html',
        controller: 'UsefuldetailsCtrl'
      }).
	  when('/help/:param1', {
        templateUrl: 'help.html',
        controller: 'HelpCtrl'
      }).
	  when('/activity_meters', {
        templateUrl: 'activity_meters.html',
        controller: 'ActivityCtrl'
      }).
	  when('/calendar', {
        templateUrl: 'calendar.html',
        controller: 'CalendarCtrl'
      }).
	  when('/useful_info', {
        templateUrl: 'useful_info.html',
        controller: 'UsefulCtrl'
      }).
	  when('/contact', {
        templateUrl: 'contact.html',
        controller: 'ContactCtrl'
      }).
	  when('/settings', {
        templateUrl: 'settings.html',
        controller: 'SettingsCtrl'
      }).
	  when('/exclusion', {
        templateUrl: 'exclusion.html',
        controller: 'ExclusionCtrl'
      }).
	  when('/quiz', {
        templateUrl: 'quizzes.html',
        controller: 'QuizCtrl'
      }).
	  when('/quiztopic/:param1', {
        templateUrl: 'quiztopic.html',
        controller: 'QuizTopicCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);
  
  
  function HomeFragmentController($scope) {
    $scope.$on("$routeChangeSuccess", function (scope, next, current) {
        $scope.transitionState = "active"
    });
}
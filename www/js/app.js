// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('money', ['ionic', 'money.controllers', 'money.services','ngCordova'])

  .run(function($rootScope,$ionicPlatform,$cordovaSQLite,$ionicLoading) {
    $ionicLoading.show({
      template: '<i class="button-icon icon ion-loading-a"></i><br> Please wait...'
    });
    $ionicPlatform.ready(function() {
      console.log(ionic.Platform.platform());
        var customer_income = "CREATE TABLE IF NOT EXISTS customer_income (ID INTEGER PRIMARY KEY AUTOINCREMENT," +
          "TYPE_ID INTEGER," +
          "IN_OUT TEXT," +
          "VALUE REAL," +
          "NOTE TEXT," +
          "CUR_DATE TEXT," +
          "CUR_TIME TEXT," +
          "EDITED TEXT," +
          "CREATED TEXT" +
          ")";
        var customer_income_type = "CREATE TABLE IF NOT EXISTS customer_income_type (ID INTEGER PRIMARY KEY AUTOINCREMENT,IN_OUT TEXT,TITLE TEXT,P_COLOR TEXT,CREATED TEXT)";


        $rootScope.db = $cordovaSQLite.openDB({name:"money.db", location:'default'});
        //$cordovaSQLite.execute($rootScope.db, "DROP TABLE IF EXISTS customer_income");
        //$cordovaSQLite.execute($rootScope.db, "DROP TABLE IF EXISTS customer_income_type");
        $cordovaSQLite.execute($rootScope.db, customer_income);
        $cordovaSQLite.execute($rootScope.db, customer_income_type);





      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

  })

  .config(function($stateProvider, $urlRouterProvider,$httpProvider) {

    $httpProvider.interceptors.push('customeInterceptor');
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller:'tabsController'
      })

      // Each tab has its own nav history stack:

      .state('tab.money_in', {
        url: '/money_in',
        views: {
          'tab-money_in': {
            templateUrl: 'templates/tab-money_in.html',
            controller: 'money_inController'
          }
        }
      })

      .state('tab.money_out', {
        url: '/money_out',
        views: {
          'tab-money_out': {
            templateUrl: 'templates/tab-money_out.html',
            controller: 'money_outController'
          }
        }
      })

      .state('tab.money_report', {
        url: '/money_report',
        views: {
          'tab-money_report': {
            templateUrl: 'templates/tab-money_report.html',
            controller: 'moneyReportController'
          }
        }
      })

      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

      .state('tab.setting', {
        url: '/setting',
        views: {
          'tab-setting': {
            templateUrl: 'templates/tab-setting.html',
            controller: 'settingController'
          }
        }
      })

      .state('tab.setting-type', {
        url: '/setting/:TYPE_INOUT',
        views: {
          'tab-setting': {
            templateUrl: 'templates/setting-type.html',
            controller: 'settingTypeController'
          }
        }
      });



    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/setting');

  })
  .factory('customeInterceptor',['$timeout','$injector', '$q',function($timeout, $injector, $q) {

  var requestInitiated;

  function showLoadingText() {
    $injector.get("$ionicLoading").show(
      /*{
       template: 'Loading...',
       animation: 'fade-in',
       showBackdrop: true
       }*/
    );
  };

  function hideLoadingText(){
    $injector.get("$ionicLoading").hide();
  };

  return {
    request : function(config) {
      requestInitiated = true;
      showLoadingText();
      console.log('Request Initiated with interceptor');
      return config;
    },
    response : function(response) {
      requestInitiated = false;

      // Show delay of 300ms so the popup will not appear for multiple http request
      $timeout(function() {

        if(requestInitiated) return;
        hideLoadingText();
        console.log('Response received with interceptor');

      },300);

      return response;
    },
    requestError : function (err) {
      hideLoadingText();
      console.log('Request Error logging via interceptor');
      return err;
    },
    responseError : function (err) {
      hideLoadingText();
      console.log('Response error via interceptor');
      return $q.reject(err);
    }
  }
}]);

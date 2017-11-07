angular.module("money")
  .controller("moneyReportController",function ($rootScope,$scope,$cordovaSQLite) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      // handle event
      console.log("State Params: ", data.stateParams);
    });

    $scope.$on("$ionicView.enter", function(event, data){
      // handle event
      $scope.TH_HEADER = "รายงาน";
      console.log("State Params: ", data.stateParams);
    });

    $scope.$on("$ionicView.afterEnter", function(event, data) {

      var db = $rootScope.db;

      $scope.reload = function () {
        console.log('reload....');
        $cordovaSQLite.execute(db,
          ' SELECT customer_income.*,customer_income_type.IN_OUT,customer_income_type.TITLE,customer_income_type.P_COLOR ' +
          ' FROM customer_income ' +
          ' LEFT JOIN customer_income_type ' +
          ' ON customer_income.TYPE_ID=customer_income_type.ID ')
          .then(
            function (result) {
              //$scope.allMessage = result;
              $scope.reportRepeat = [];
              var i = 0;
              while (i < result.rows.length) {
                $scope.reportRepeat.push(result.rows.item(i));
                i++;
              }
            },
            function (error) {
              $scope.statusError = error;
            }
          );
      }
      $scope.reload();
    });

  });

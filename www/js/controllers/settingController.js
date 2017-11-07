angular.module("money")
  .controller("settingController",function ($scope) {
    $scope.TH_HEADER = "ตั้งค่า";
    $scope.TYPE_PARAMS = [
      {
        TYPE_INOUT: "IN",
        ICON_TYPE: "ion-ios-plus",
        TH_NAME: "รายรับ"
      },
      {
        TYPE_INOUT: "OUT",
        ICON_TYPE: "ion-ios-minus",
        TH_NAME: "รายจ่าย"
      }
    ];
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      // handle event
      console.log("State Params: ", data.stateParams);
    });

    $scope.$on("$ionicView.enter", function(event, data){
      // handle event
      console.log("State Params: ", data.stateParams);
    });

    $scope.$on("$ionicView.afterEnter", function(event, data){
      // handle event
      console.log("State Params: ", data.stateParams);
    });

  });

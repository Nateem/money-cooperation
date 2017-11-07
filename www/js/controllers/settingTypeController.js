angular.module("money")
  .controller("settingTypeController",function ($rootScope,$scope,$stateParams,$state,$cordovaSQLite,$cordovaToast,$cordovaDialogs) {
    var HEADER;
    var IN_OUT;
    var db = $rootScope.db;
    if ($stateParams.TYPE_INOUT == "IN") {
      HEADER = "ประเภทรายรับ";
      IN_OUT = "IN";
    }
    else if ($stateParams.TYPE_INOUT == "OUT") {
      HEADER = "ประเภทรายจ่าย";
      IN_OUT = "OUT";
    }
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      // handle event
      console.log("State Params: ", data.stateParams);
    });

    $scope.$on("$ionicView.enter", function(event, data){
      // handle event
      console.log("State Params: ", data.stateParams);
    });

    $scope.$on("$ionicView.afterEnter", function(event, data) {

      $scope.TH_HEADER = HEADER;
      var selectType = function () {
        $cordovaSQLite.execute(db, 'SELECT ID,TITLE,P_COLOR FROM customer_income_type WHERE IN_OUT = ? ORDER BY ID', [IN_OUT])
          .then(
            function (result) {
              //$scope.allMessage = result;
              $scope.typeRepeat = [];
              var i = 0;
              while (i < result.rows.length) {
                $scope.typeRepeat.push(result.rows.item(i));
                i++;
              }
            },
            function (error) {
              toast('โหลดประเภทผิดพลาด!');
            }
          );
      };
      var toast = function (message) {
        $cordovaToast
          .show(message, 'long', 'bottom')
          .then(function (success) {
            // success
          }, function (error) {
            // error
          });
      };
      selectType();

      $scope.chkAdd = function () {
        $cordovaDialogs.prompt('เพิ่มประเภทที่ต้องการ', $scope.TH_HEADER, ['ตกลง', 'ยกเลิก'], '')
          .then(function (result) {
            var inpPromt = result.input1;
            // no button = 0, 'OK' = 1, 'Cancel' = 2
            var btnIndex = result.buttonIndex;
            if (btnIndex == 1) {
              var DNOW = new Date();
              $cordovaSQLite.execute(db, 'INSERT INTO customer_income_type (IN_OUT,TITLE,CREATED) VALUES (?,?,?)', [IN_OUT, inpPromt, DNOW]);
              toast('เพิ่มประเภท \"' + inpPromt + '\" สำเร็จ !');
              selectType();
            }
          });
      }
      $scope.chkEdit = function (ID, TYPE_NAME) {
        console.log("edit...");
        $cordovaDialogs.prompt('แก้ไขประเภท \"' + TYPE_NAME + '\"', $scope.TH_HEADER, ['ตกลง', 'ยกเลิก'], TYPE_NAME)
          .then(function (result) {
            var inpPromt = result.input1;
            // no button = 0, 'OK' = 1, 'Cancel' = 2
            var btnIndex = result.buttonIndex;
            if (btnIndex == 1) {
              $cordovaSQLite.execute(db, 'UPDATE customer_income_type SET TITLE=? WHERE ID = ?', [inpPromt, ID]);
              toast("แก้ไข \"" + TYPE_NAME + "\" เป็น \"" + inpPromt + "\"สำเร็จ.");
              selectType();
            }
          });
      }
      $scope.chkDelete = function (ID, TYPE_NAME) {
        console.log("delete...");
        $cordovaDialogs.confirm('คุณต้องการลบประเภท \"' + TYPE_NAME + '\" ใช่หรือไม่?', 'ยืนยัน', ['ตกลง', 'ยกเลิก'])
          .then(function (buttonIndex) {
            // no button = 0, 'OK' = 1, 'Cancel' = 2
            var btnIndex = buttonIndex;
            if (btnIndex == 1) {
              $cordovaSQLite.execute(db, 'DELETE FROM customer_income_type WHERE ID = ?', [ID]);
              toast("ลบประเภท \"" + TYPE_NAME + "\" ออกแล้ว.");
              selectType();
            }
          });
      }
    });
  })

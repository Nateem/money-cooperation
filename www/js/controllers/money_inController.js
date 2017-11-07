angular.module('money')
  .controller('money_inController',function ($rootScope,$scope,$state,$cordovaDatePicker,$cordovaDialogs,$cordovaSQLite,$cordovaToast,$state) {
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      // handle event
      console.log("State Params: ", data.stateParams);
    });

    $scope.$on("$ionicView.enter", function(event, data){
      // handle event
      console.log("State Params: ", data.stateParams);
    });

    $scope.$on("$ionicView.afterEnter", function(event, data) {
      var onInit = function () {
        $scope.TH_HEADER = "รายรับ";
        $scope.form = {};
        $scope.form.CUR_DATE = new Date();
        $scope.form.CUR_TIME = "";

      }
      var IN_OUT = "IN";
      var db = $rootScope.db;
      var toast = function (message) {
        $cordovaToast
          .show(message, 'long', 'center')
          .then(function (success) {
            // success
          }, function (error) {
            // error
          });
      };
      var selectType = function () {
        $cordovaSQLite.execute(db, 'SELECT ID,TITLE FROM customer_income_type WHERE IN_OUT = ? ORDER BY ID', [IN_OUT])
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

      var insertCustomer_income_type = function (IN_OUT, inp) {
        var DNOW = new Date();
        $cordovaSQLite.execute(db, 'INSERT INTO customer_income_type (IN_OUT,TITLE,CREATED) VALUES (?,?,?)', [IN_OUT, inp, DNOW])
          .then(function (result) {
            toast('เพิ่มประเภท' + $scope.TH_HEADER + 'สำเร็จ !');
            selectType();
          }, function (error) {
            toast('เพิ่มประเภท' + $scope.TH_HEADER + 'ผิดพลาด !');
          });
      };

      var alertDialog = function (Message, title) {
        $cordovaDialogs.alert(Message, title, 'ตกลง');
      };
      onInit();
      selectType();


      $scope.addSelectPop = function () {
        $cordovaDialogs.prompt('เพิ่มประเภทที่ต้องการ', $scope.TH_HEADER, ['ตกลง', 'ยกเลิก'], '')
          .then(function (result) {
            var inpPromt = result.input1;
            // no button = 0, 'OK' = 1, 'Cancel' = 2
            var btnIndex = result.buttonIndex;
            if (btnIndex == 1) {
              insertCustomer_income_type(IN_OUT, inpPromt);
            }
          });
      };
      $scope.showDatePick = function () {
        console.log("Click...");
        var options = {
          date: new Date(),
          mode: 'date'
        };
        $cordovaDatePicker.show(options).then(function (date) {
          $scope.form.CUR_DATE = date;
        });
      };
      $scope.showTimePick = function () {
        console.log("Click...");
        var options = {
          date: new Date(),
          mode: 'time'
        };
        $cordovaDatePicker.show(options).then(function (time) {
          $scope.form.CUR_TIME = time;
        });
      }
      $scope.submitFormIn = function (myForm, TYPE_ID, VALUE, NOTE, CUR_DATE, CUR_TIME) {
        var DNOW = new Date();
        var TYPE_ID = TYPE_ID;
        var VALUE = VALUE;
        var NOTE = NOTE;
        var CUR_DATE = CUR_DATE;
        var CUR_TIME = CUR_TIME;

        $cordovaSQLite.execute(db, 'INSERT INTO customer_income (TYPE_ID,IN_OUT,VALUE,NOTE,CUR_DATE,CUR_TIME,CREATED) VALUES (?,?,?,?,?,?,?)', [TYPE_ID, IN_OUT, VALUE, NOTE, CUR_DATE, CUR_TIME, DNOW])
          .then(function (result) {
            toast('เพิ่มรายการ' + $scope.TH_HEADER + 'สำเร็จ !');
            //alertDialog(TYPE_ID+','+VALUE+','+NOTE,"debug");
            myForm.$setPristine();
            onInit();
            selectType();

            //$state.go($state.current, $state.params, {reload: true});
          }, function (error) {
            toast('เพิ่มรายการ' + $scope.TH_HEADER + 'ผิดพลาด !');
          });
      }
    })
  });

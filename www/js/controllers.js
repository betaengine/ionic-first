//var loadingModel = '<ion-spinner icon="circles" class="spinner-energized"></ion-spinner>';
angular.module('starter.controllers', ['ionic', 'ngCordova', 'ionic-timepicker'])

  //双击返回键退出程序
  .run(function ($ionicPlatform, $rootScope, $location, $timeout, $ionicHistory, $cordovaToast) {
    $ionicPlatform.ready(function ($rootScope) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
    //双击退出
    $ionicPlatform.registerBackButtonAction(function (e) {
      //判断处于哪个页面时双击退出
      if ($location.path() == '/tab/home') {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          $cordovaToast.showShortBottom('再按一次退出系统');
          setTimeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
      } else if ($location.path() == '/login') {
        ionic.Platform.exitApp();
      }
      else if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        $rootScope.backButtonPressedOnceToExit = true;
        $cordovaToast.showShortBottom('再按一次退出系统');
        setTimeout(function () {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
      e.preventDefault();
      return false;
    }, 101);
  })


  .controller('CommonCtrl',
  ['$rootScope', '$scope', '$cordovaBarcodeScanner', '$cordovaVibration', '$cordovaNetwork', '$ionicLoading', '$cordovaDialogs', '$ionicModal', '$timeout',
    '$ionicPopup', 'Products', 'NewProducts', 'Users', '$location', '$state', '$cordovaToast', 'commonModel',
    function ($rootScope, $scope, $cordovaBarcodeScanner, $cordovaVibration, $cordovaNetwork, $ionicLoading, $cordovaDialogs, $ionicModal,
              $timeout, $ionicPopup, Products, NewProducts, Users, $location, $state, $cordovaToast, commonModel) {
      $scope.ProductName = '';
      //温度文字颜色和默认值
      $scope.levelClass = 'normal-level-text';
      $scope.level = 50;

      $scope.OnUp = function () {
        if ($scope.temperature < 75) {
          $scope.temperature = $scope.temperature + 1;
        }
      };
      $scope.OnDown = function () {
        if ($scope.level > 30) {
          $scope.level = $scope.level - 1;
        }
      };
      //$scope.IsLogin = false;
      $scope.loginData = {};
      $scope.OnOff = '关闭';
      $scope.OpenTimeText = '预约时间';

      //获取可添加产品列表
      $scope.newProducts = NewProducts.all();
      $scope.products = Products.all();
      //开关
      $scope.OpenClose = function () {
        if ($scope.OnOff == '关闭') {
          $scope.OnOff = '开启'
        } else {
          $scope.OnOff = '关闭'
        }
      };


      //功能按键
      $scope.range = '';
      $scope.common = 'action-btn-focus';
      $scope.isModel = false;
      $scope.CurrentTemperature = 40;
      $scope.SettingTemperature = 70;
      $scope.changeModel = function (model) {
        switch (model) {
          case 'mid':
            $scope.mid = 'action-btn-focus';
            $scope.range = 'range';
            $scope.common = '';
            $scope.fast = '';
            $scope.isModel = true;
            break;
          case 'common':
            $scope.common = 'action-btn-focus';
            $scope.range = '';
            $scope.mid = '';
            $scope.fast = '';
            $scope.isModel = false;
            break;
          case 'fast':
            $scope.fast = 'action-btn-focus';
            $scope.range = 'range';
            $scope.common = '';
            $scope.mid = '';
            $scope.isModel = true;
            break;

        }
      };
      var timeoutId = null;
      $scope.$watch('temperature', function () {
        if (timeoutId !== null) {
          return;
        }
        timeoutId = $timeout(function () {
          $timeout.cancel(timeoutId);
          timeoutId = null;
        }, 1000);
      });


      //二维码扫
      $scope.scan = function () {
        $ionicLoading.show({
          template: commonModel.loadingModel
        });
        if ($scope.currentlyScanning === true) {
          $ionicLoading.hide();
          return;
        }
        else if (ionic.Platform.platforms.indexOf("browser") !== -1) {
          setTimeout(function () {
            $ionicLoading.hide();
            console.log("无法调用摄像头!!!");
            $cordovaDialogs.alert("无法调用摄像头!!!");
          }, 1000);
          return;
        }
        else {
          $scope.currentlyScanning = true;
        }
        $cordovaBarcodeScanner
          .scan()
          .then(function (barcodeData) {
            console.log(barcodeData);
            if (!barcodeData.cancelled) {
              $cordovaDialogs.alert(barcodeData.text, '结果', 'OK');
            }
            $ionicLoading.hide();
            $scope.currentlyScanning = false;
          }, function (error) {
            $ionicLoading.hide();
            $scope.currentlyScanning = false;
            $cordovaDialogs.alert(error, 'barcode Error', 'OK');
          });
      };

      //时间控件模板
      $scope.timePickerObject = {
        inputEpochTime: ((new Date()).getHours() * 60 * 60),
        step: 15,
        format: 24,
        titleLabel: '请设置时间',
        setLabel: '确定',
        closeLabel: '关闭',
        setButtonType: 'button-positive',
        closeButtonType: 'button-stable',
        callback: function (val) {
          timePickerCallback(val);
        }
      };

      function timePickerCallback(val) {
        if (typeof (val) === 'undefined') {
        }
        else {
          var selectedTime = new Date(val * 1000);
          var nowDate = new Date();
          $cordovaToast.showLongCenter(selectedTime.getUTCHours() - nowDate.getHours() + '小时后执行任务');
        }
      }


      //产品列表
      $ionicModal.fromTemplateUrl('templates/product-list.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.productList = modal;
      });
      $scope.proList = function () {
        $scope.productList.show();
      };
      $scope.closeProList = function () {
        $scope.productList.hide();
      };
      //添加产品
      $scope.data = {};
      $scope.addProduct = function (newProduct) {
        var myPopup = $ionicPopup.show({
          template: commonModel.addIntroduce,
          title: '添加设备',
          subTitle: '请输入wifi密码',
          scope: $scope,
          buttons: [
            {text: '取消'},
            {
              text: '确定',
              type: 'button-energized',
              onTap: function (e) {
                if ($scope.data.wifi != '1234') {
                  $cordovaToast.showShortBottom('wifi密码错误');
                  e.preventDefault();
                } else {
                  //震动
                  $cordovaVibration.vibrate(500);
                  return $scope.data.wifi;
                }
              }
            }
          ]
        });
        myPopup.then(function (res) {
          if (res) {
            $ionicLoading.show({
              template: commonModel.addLoading
            });
            $timeout(function () {
              Products.addProduct(newProduct.name, newProduct.buyDate, newProduct.icon);
              $scope.closeProList();
              $cordovaVibration.vibrate(500);
              $cordovaToast.showLongBottom('设备添加成功');
              $ionicLoading.hide();
            }, 2500);
          }
        });
      };

      $scope.pwdVisible = 'ion-eye-disabled';
      $scope.pwdModel = 'password';
      $scope.isVisible = false;
      $scope.changePwdModel = function () {
        if ($scope.pwdModel == 'password') {
          $scope.pwdModel = 'text';
          $scope.pwdVisible = 'ion-eye';
        } else {
          $scope.pwdModel = 'password';
          $scope.pwdVisible = 'ion-eye-disabled';
        }
      };
      //登录页面
      $scope.doLogin = function () {
        var username = $scope.loginData.username;
        var password = $scope.loginData.password
        if (username.length == 0 || username == '') {
          $cordovaToast.showShortCenter('用户名不能为空');
          return false;
        }
        if (password.length == 0 || password == '') {
          $cordovaToast.showShortCenter('密码不能为空');
          return false;
        }
        var user = Users.login(username, password);
        if (user != null) {
          $rootScope.User = user;
          //setCookie('userName', $scope.loginData.username, 1);
          $state.go('tab.home');
          //$scope.IsLogin = true;
          //$scope.isInfo = true;
          //$ionicPopup.alert(
          //  {
          //    title: '提示',
          //    template: '登录成功'
          //  }
          //);
          //$state.reload();
          //$scope.$on('$stateChangeSuccess',function(){
          //  $scope.IsLogin = true;
          //  $scope.isInfo = true;
          //});
          //$scope.loginModal.hide();
        }
        /*var link = 'http://localhost:8080/v1/user/login';
         var data = {
         Username: $scope.loginData.username,
         Password: $scope.loginData.password
         }

         var p = $http({
         url: link,
         method: 'POST',
         data: data,
         dataType: 'json',
         headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
         }
         });
         p.success(function (response, status, headers, config) {
         if (response.StatusCode == 200) {
         $scope.IsLogin = true;
         setCookie('username', $scope.loginData.username, 7);
         setCookie('password', $scope.loginData.password, 7);
         $scope.closeLogin();
         $scope.IsQuit = false;
         }
         });*/
      };

      //注册页面
      $scope.registerData = {};
      $scope.doRegister = function () {
        var username = $scope.registerData.username;
        var password = $scope.registerData.password;
        var phone = $scope.registerData.phone;
        var address = $scope.registerData.address;
        if (username == '') {
          $cordovaToast.showShortCenter('用户名不能为空!!');
          return false;
        }
        if (password == '' || password.length < 4) {
          $cordovaToast.showShortCenter('密码不能为空，且不能少于4位!!');
          return false;
        }
        if (phone.length < 11) {
          $cordovaToast.showShortCenter('手机号码不能少于6位!!');
          return false;
        }
        if (address.length == '') {
          $cordovaToast.showShortCenter('地址不能为空');
          return false;
        }
        if (Users.getByName(username) == null) {
          $ionicLoading.show({
            template: commonModel.loadingModel
          });
          Users.add(username, password, phone, address);
          $cordovaToast.showShortBottom('注册成功,即将自动登录!');
          $timeout(function () {
            var user = Users.login(username, password);
            $rootScope.User = user;
            $state.go('tab.home');
            //setCookie('userName', username, 1);
            $ionicLoading.hide();

          }, 1500);
        }
        /*var link = 'http://127.0.0.1:8080/v1/user/';
         //var data = "username=" + $scope.registerData.username + "&Password=" + $scope.registerData.password +
         //    '&MobilePhone='+$scope.registerData.phone;
         var data = {
         "MobilePhone": $scope.registerData.phone,
         "Password": $scope.registerData.password,
         "Username": $scope.registerData.username
         }
         var p = $http({
         url: link,
         method: 'POST',
         data: data,
         dataType: 'json',
         headers: {
         'Content-Type': 'application/x-www-form-urlencoded'
         }
         });
         p.success(function (response, status, headers, config) {
         if (response.Username != null) {
         $ionicPopup.alert({
         title: '提示',
         template: '用户创建成功'
         });
         $scope.IsLogin = true;
         } else {
         $ionicPopup.alert({
         title: '提示',
         template: response
         });
         }

         });*/
      };

      //$scope.lookProduct = Products.get($stateParams.productId);
      $ionicModal.fromTemplateUrl('templates/product-detail.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.productModal = modal;
      });
      $scope.Product = null;
      $scope.lookProduct = function (product) {
        $scope.productModal.show();
        $scope.Product = product;
      };
      $scope.closeProduct = function () {
        $scope.productModal.hide();
      };
      //解除绑定
      $scope.unBind = function (Product) {
        var myPopup = $ionicPopup.show({
          template: '是否要解除当前设备',
          title: '解除设备',
          scope: $scope,
          buttons: [
            {text: '取消'},
            {
              text: '确定',
              type: 'button-energized',
              onTap: function (e) {
                if (e) {
                  $ionicLoading.show({
                    template: commonModel.loadingModel
                  });
                  Products.remove(Product);
                  $timeout(function () {
                    $ionicLoading.hide();
                    $scope.productModal.hide();
                  }, 500);
                  $cordovaToast.showShortBottom('设备解绑成功');
                }
              }
            }
          ]
        });

      };
      //console.log('color='+ $scope.levelClass)
    }])


  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })


  .controller('AccountCtrl', [
    '$http', '$cordovaAppVersion', '$cordovaFileTransfer', '$cordovaFileOpener2',
    '$scope', '$ionicPopup', '$cordovaToast', 'Users', 'Settings', '$location',
    '$ionicLoading', '$timeout', 'commonModel',
    function ($http, $cordovaAppVersion, $cordovaFileTransfer, $cordovaFileOpener2,
              $scope, $ionicPopup, $cordovaToast, Users, Settings, $location, $ionicLoading, $timeout, commonModel) {

      //检查更新
      $scope.checkUpdate = function () {
        $cordovaToast.showShortCenter('正在检查更新');
        //请求的url
        var url = '';
        $http.get(url).then(function (res) {
          var serverVersion = res.version;
          $cordovaAppVersion.getVersionNumber().then(function (clientVersion) {
            if (clientVersion != serverVersion) {
              var Confirm = $ionicPopup.confirm({
                title: '提示',
                template: '检测到新版本，是否升级？',
                cancelText: '取消',
                okText: '升级',
                okType: 'button-assertive'
              });
              //下载并安装
              Confirm.then(function (e) {
                if (e) {
                  var url = ''; //可以从服务端获取更新APP的路径
                  var targetPath = ''; //APP下载存放的路径，可以使用cordova file插件进行相关配置
                  var trustHosts = true; //信任
                  var options = {};
                  $cordovaFileTransfer.download(url, targetPath, trustHosts, options).then(function (result) {
                    $cordovaToast.showShortCenter('下载成功');
                    $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive').then(function () {
                      $cordovaToast.showShortCenter('安装成功');

                    }, function (err) {
                      $cordovaToast.showShortCenter('安装失败');

                    });
                  }, function (err) {
                    $cordovaToast.showShortCenter('下载失败');

                  }, function (progress) {
                    $timeout(function () {
                      downloadProgress = (progress.loaded / progress.total) * 100;
                      $ionicLoading.show({
                        template: '已经下载：' + Math.floor(downloadProgress) + '%'
                      });
                      if (downloadProgress > 99) {
                        $ionicLoading.hide();
                      }
                    });
                  });
                } else {
                  //取消更新
                  $cordovaToast.showShortCenter('取消更新了');
                }
              });
            }
          });

        })
      }
      $scope.settings = Settings.all();
      $scope.toastText = function (text) {
        $cordovaToast.showShortCenter(text);
      };
      //注销用户
      $scope.logOut = function () {
        delCookie('user');
        $ionicLoading.show({
          template: commonModel.loadingModel
        });
        $location.path('/login');
        $timeout(function () {
          $ionicLoading.hide();
        }, 1000);
      };
      //  关闭程序
      $scope.closeApp = function () {
        var myPopup = $ionicPopup.confirm({
          title: '提示',
          template: '是否退出应用？',
          cancelText: '否',
          okText: '是',
          okType: 'button-assertive'
        });
        myPopup.then(function (res) {
          if (res) {
            ionic.Platform.exitApp();
          }
        });
      };
      $scope.lookSetting = function (title) {
        $ionicPopup.alert({
          title: '提示',
          template: title
        });
      }
    }]);


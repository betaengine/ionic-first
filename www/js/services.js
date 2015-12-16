angular.module('starter.services', [])
  .constant('commonModel',{
    //无文字加载动画
    loadingModel: '<ion-spinner icon="circles" class="spinner-energized"></ion-spinner>',
    //有文字加载动画
    addLoading:'<p>绑定中</p>' + '<ion-spinner icon="circles" class="spinner-energized"></ion-spinner>',
    //增加设备介绍
    addIntroduce: '<input type="password"  ng-model="data.wifi">' +
    '<p style="margin-top: 10px;">1、输入设备所连接的wifi网络的密码，输入正确手机震动一下</p>' +
    '<p>2、绑定设备过程中耐心等待，请勿关闭应用</p>' +
    '<p>3、设备绑定成功后，手机再次震动一下</p>'


  })
  .factory('Users', function () {
    var users = [
      {
        id: 0,
        name: 'admin',
        password: 'admin',
        phone: '12345678910',
        address: '中国',
        face: 'img/user.jpg'
      }
    ];
    return {
      add: function (username, password, phone, address) {
        var newUser = {
          id: users.length + 1,
          name: username,
          password: password,
          phone: phone,
          address: address,
          face: 'img/user.jpg'
        };
        users.push(newUser);
      },
      loginByUser: function (user) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].name === user.name && users[i].password === user.password) {
            return true;
          }
        }
        return false;
      },
      login: function (name, password) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].name === name && users[i].password === password) {
            return users[i];
          }
        }
        return null;
      },
      getByName: function (username) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].name == username) {
            return users[i];
          }
        }
        return null;
      },
      getName: function () {

      },
      getById: function (userId) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id === parseInt(userId)) {
            return users[i];
          }
        }
        return null;
      }
    };
  })
  .
  factory('Settings', function () {
    var settings = [
      {
        id: 0,
        title: '系统设置',
        value: '',
        icon: 'ion-android-settings',
        method: 'toastText("系统设置")'
      },
      {
        id: 1,
        title: '使用帮助',
        value: '',
        icon: 'ion-help',
        method: 'toastText("使用帮助")'
      },
      {
        id: 2,
        title: '当前版本',
        value: '0.1v',
        icon: '',
        method: 'checkUpdate()'
      },
      {
        id: 3,
        title: '关于',
        value: '',
        icon: '',
        method: 'toastText("关于")'
      },
      {
        id: 4,
        title: '注销当前账号',
        value: '',
        icon: '',
        method: 'logOut()'
      },
      {
        id: 5,
        title: '退出',
        value: '',
        icon: '',
        method: 'closeApp()'
      }

    ];
    return {
      all: function () {
        return settings;
      }
    }
  })
  .factory('Products', function () {
    var products = [];

    return {
      all: function () {
        return products;
      },
      remove: function (product) {
        products.splice(products.indexOf(product), 1);
      },
      addProduct: function (name, buyDate, icon) {
        var newProduct = {
          id: products.length + 1,
          name: name,
          buyDate: buyDate,
          state: '是',
          icon: icon
        };
        products.push(newProduct);
      },
      get: function (productId) {
        for (var i = 0; i < products.length; i++) {
          if (products[i].id === parseInt(productId)) {
            return products[i];
          }
        }
        return null;
      }
    };
  })
  .factory('NewProducts', function () {
    var newProducts = [
      {
        id: 0,
        name: '热水器',
        buyDate: '2015年11月4日',
        state: '是',
        icon: 'img/reshuiqi.jpg'
      }
    ];

    return {
      all: function () {
        return newProducts;
      }
    };
  })
  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: '京东商城',
      lastText: '最后一天!!!',
      lastTime: '2015年12月14日',
      face: 'img/jingdong.jpg'
    }, {
      id: 1,
      name: '天猫商城',

      lastText: '双十二，抢!!',
      lastTime: '2015年12月14日',
      face: 'img/tianmao.jpg'
    }, {
      id: 2,
      name: '苏宁易购',
      lastText: '没有了',
      lastTime: '2015年12月14日',
      face: 'img/suning.png'
    }, {
      id: 3,
      name: '国美电器',
      lastText: '就是这样',
      lastTime: '2015年12月14日',
      face: 'img/guomei.jpg'
    }, {
      id: 4,
      name: '系统通知',
      lastText: '你还有很多条通知!!!',
      lastTime: '2015年12月14日',
      face: 'img/wanhe.jpg'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });

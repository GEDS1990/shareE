// 聊天室
var app = getApp()
// var url = ;
// var utils = require('./util.js');
var userName = "";
// // 获取本地数据-用户信息
var _this = this;
wx.getStorage({
  key: 'userInfo',
  // 能获取到则显示用户信息，并保持登录状态，不能就什么也不做
  success: (res) => {
    userName = res.data.userInfo.nickName;
  }
});
function connect(func) {
  var url = app.wssUrl + "/websocket/" + userName;
  // var url = app.wssUrl + "/websocket/demo";
  wx.connectSocket({
    url: url,
    header: { 'content-type': 'application/json' },
    success: function () {
      console.log('信道连接成功~')
    },
    fail: function () {
      console.log('信道连接失败~')
    }
  });
  wx.onSocketOpen(function (res) {
    wx.showToast({
      title: '信道已开通~',
      icon: "success",
      duration: 2000
    })
    debugger;
    //接受服务器消息
    wx.onSocketMessage(func);//func回调可以拿到服务器返回的数据
  });
  wx.onSocketError(function (res) {
    wx.showToast({
      title: '信道连接失败，请检查！',
      icon: "none",
      duration: 2000
    })
  })  
}
//发送消息
function send(msg) {
  wx.sendSocketMessage({ 
    data: msg 
  });
}
module.exports = {
  connect: connect,
  send: send
}
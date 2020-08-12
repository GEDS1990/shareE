// pages/wallet/index.js
var app = getApp()
Page({
  data:{
    overage: 0,
    ticket: 0
  },
// 页面加载
  onLoad:function(options){
     wx.setNavigationBarTitle({
       title: '我的钱包'
     })
  },
// 页面加载完成，更新本地存储的overage
  onReady:function(){
    //  wx.getStorage({
    //   key: 'overage',
    //   success: (res) => {
    //     this.setData({
    //       overage: res.data.overage
    //     })
    //   }
    // })

    // 4.请求服务器，
    wx.request({
      url: app.apiUrl + '/mapControl/getMoney',
      data: { "avatarUrl": app.userInfo.avatarUrl },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        this.setData({
          money: res.data
        })
      }
    });
  },
// 页面显示完成，获取本地存储的overage
  onShow:function(){
    // wx.getStorage({
    //   key: 'overage',
    //   success: (res) => {
    //     this.setData({
    //       overage: res.data.overage
    //     })
    //   }
    // }) 
  },
// 余额说明
  overageDesc: function(){
    wx.showModal({
      title: "",
      content: "充值余额0.00元+活动赠送余额0.00元",
      showCancel: false,
      confirmText: "我知道了",
    })
  },
// 跳转到充值页面
  movetoCharge: function(){
    // 关闭当前页面，跳转到指定页面，返回时将不会回到当前页面
    wx.redirectTo({
      url: '../charge/index'
    })
  },
// 用车券
  showTicket: function(){
    wx.showModal({
      title: "",
      content: "你没有优惠券了",
      showCancel: false,
      confirmText: "好吧",
    })
  },
  //彩票
  showCaipiao: function(){
    wx.navigateTo({
      url: '../caipiao/index'
    })
  },
// 押金退还
  showDeposit: function(){
    wx.showModal({
      title: "",
      content: "e币会立即提现",
      cancelText: "确认",
      cancelColor: "#191970",
      confirmText: "取消",
      confirmColor: "#ccc",
      success: (res) => {
        if(res.confirm){
          wx.showToast({
            title: "提现成功",
            icon: "success",
            duration: 2000
          })
        }
      }
    })
  }
})
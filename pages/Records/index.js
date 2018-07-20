// pages/wallet/index.js
Page({
  data:{
    overage: 0,
    ticket: 0
  },
// 页面加载
  onLoad:function(options){
     wx.setNavigationBarTitle({
       title: '我的记录'
     })
  },
// 页面加载完成，更新本地存储的overage
  onReady:function(){
     wx.getStorage({
      key: 'overage',
      success: (res) => {
        this.setData({
          overage: res.data.overage
        })
      }
    })
  },
// 页面显示完成，获取本地存储的overage
  onShow:function(){
    wx.getStorage({
      key: 'overage',
      success: (res) => {
        this.setData({
          overage: res.data.overage
        })
      }
    }) 
  },
// 余额说明
  overageDesc: function(){
    wx.showModal({
      title: "",
      content: "星级说明：青铜（0-50）、白银（51-150）、王者（151-400）、至尊（401-800）、飞仙（801-1600）",
      showCancel: false,
      confirmText: "我知道了",
    })
  },
// 跳转到接单页面
  movetoJiedan: function(){
    // 关闭当前页面，跳转到指定页面，返回时将不会回到当前页面
    wx.redirectTo({
      url: '../jiedan/index'
    })
  },
// 用车券
  showTicket: function(){
    wx.showModal({
      title: "",
      content: "你没有用车券了",
      showCancel: false,
      confirmText: "好吧",
    })
  },
// 押金退还
  showDeposit: function(){
    wx.showModal({
      title: "",
      content: "押金会立即退回，退款后，您将不能使用ShareE共享物流确认要进行此退款吗？",
      cancelText: "继续使用",
      cancelColor: "#b9dd08",
      confirmText: "押金退款",
      confirmColor: "#ccc",
      success: (res) => {
        if(res.confirm){
          wx.showToast({
            title: "退款成功",
            icon: "success",
            duration: 2000
          })
        }
      }
    })
  },
// 关于ShareE
  showInvcode: function(){
    wx.showModal({
      title: "ShareE共享物流",
      content: "微信服务号：ShareE,网址：www.shzhyun.com",
      showCancel: false,
      confirmText: "去中心化共享物流平台"
    })
  }
})
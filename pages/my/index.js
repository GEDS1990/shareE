// pages/my/index.js//获取应用实例
var app = getApp()
Page({
  data:{
    iconSize: [20, 30, 40, 50, 60, 70],
    iconColor: [
      'red', 'orange', 'yellow', 'green', 'rgb(0,255,255)', 'blue', 'purple'
    ],
    iconType: [
      'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
    ],
    // 用户信息
    userInfo: {
      avatarUrl: "",
      nickName: "未登录",
      country: "",
      province: "",
      city: "",
      gender: "",
      language: "",
    },
    bType: "primary", // 按钮类型
    actionText: "登录", // 按钮文字提示
    lock: false //登录按钮状态，false表示未登录
  },
// 页面加载
  onLoad:function(){
    // 设置本页导航标题
    wx.setNavigationBarTitle({
      title: '个人中心'
    }); 
    var that = this;
    // 获取本地数据-用户信息
    wx.getStorage({
      key: 'userInfo',
      // 能获取到则显示用户信息，并保持登录状态，不能就什么也不做
      success: (res) => {
        wx.hideLoading();
        that.setData({
          userInfo: {
            avatarUrl: res.data.userInfo.avatarUrl,
            nickName: res.data.userInfo.nickName
          },
          bType: res.data.bType,
          actionText: res.data.actionText,
          lock: true
        })
      }
    });
  },
  // onGotUserInfo: function (e) {
  //   this.data.lock = !this.data.lock
  //   if (this.data.lock) {
  //     // wx.showLoading({
  //     //   title: "正在登录"
  //     // });
  //     // wx.hideLoading();
  //     app.userInfo = e.detail.userInfo;
  //     this.setData({
  //       userInfo: {
  //         avatarUrl: e.detail.userInfo.avatarUrl,
  //         nickName: e.detail.userInfo.nickName
  //       },
  //       bType: "warn",
  //       actionText: "退出登录",
  //       lock: true
  //     });
  //     // 存储用户信息到本地
  //     debugger;
  //     wx.setStorage({
  //       key: 'userInfo',
  //       data: {
  //         userInfo: {
  //           avatarUrl: e.detail.userInfo.avatarUrl,
  //           nickName: e.detail.userInfo.nickName,
  //           country: e.detail.userInfo.country,
  //           province: e.detail.userInfo.province,
  //           city: e.detail.userInfo.city,
  //           gender: e.detail.userInfo.gender,
  //           language: e.detail.userInfo.language,
  //         },
  //         bType: "warn",
  //         actionText: "退出登录"
  //       },
  //       success: function (res) {
  //         debugger;
  //         console.log("存储成功")
  //         wx.request({
  //           url: app.apiUrl + '/mapControl/saveUserInfo',
  //           data: {
  //             avatarUrl: e.detail.userInfo.avatarUrl,
  //             nickName: e.detail.userInfo.nickName,
  //             country: e.detail.userInfo.country,
  //             province: e.detail.userInfo.province,
  //             city: e.detail.userInfo.city,
  //             gender: e.detail.userInfo.gender,
  //             language: e.detail.userInfo.language,
  //           },
  //           method: 'POST', // POST
  //           // header: {}, // 设置请求的 header
  //           success: function (res) {
  //             console.log("save userinfo  to db success!");
  //           }
  //         })
  //       }
  //     })
  //   } else {
  //     wx.showModal({
  //       title: "确认退出?",
  //       content: "退出后将不能使用ShareE",
  //       success: (res) => {
  //         if (res.confirm) {
  //           console.log("确定")
  //           // 退出登录则移除本地用户信息
  //           wx.removeStorageSync('userInfo')
  //           this.setData({
  //             userInfo: {
  //               avatarUrl: "",
  //               nickName: "未登录"
  //             },
  //             bType: "primary",
  //             actionText: "登录"
  //           })
  //         } else {
  //           console.log("cancel")
  //           this.setData({
  //             lock: true
  //           })
  //         }
  //       }
  //     })
  //   }  
  // },
// 登录或退出登录按钮点击事件
  bindAction: function(){
    this.data.lock = !this.data.lock
    debugger;
    // 如果没有登录，登录按钮操作
    if(this.data.lock){
      wx.showLoading({
        title: "正在登录"
      });
      wx.login({
        success: (res) => {
          debugger;
          console.log("res.code:{}",res.code)
          var param = {
            code: res.code
          };
          wx.request({
            url: app.apiUrl + '/wxmp/wxmp/pushOneUser',
            data: param,
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function(res){
              debugger;
              var openid = res.data.openid;
              wx.setStorage({
                key: 'openid',
                data: openid
              })
            }
          })
          wx.hideLoading();
          wx.getUserInfo({
            withCredentials: false,
            success: (res) => {
              this.setData({
                userInfo: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName,
                  country: res.userInfo.country,
                  province: res.userInfo.province,
                  city: res.userInfo.city,
                  gender: res.userInfo.gender,
                  language: res.userInfo.language,
                },
                bType: "warn",
                actionText: "退出登录",
                lock: true //登录按钮状态，false表示未登录
              });
              // 存储用户信息到本地
              wx.setStorage({
                key: 'userInfo',
                data: {
                  userInfo: {
                    avatarUrl: res.userInfo.avatarUrl,
                    nickName: res.userInfo.nickName,
                    country: res.userInfo.country,
                    province: res.userInfo.province,
                    city: res.userInfo.city,
                    gender: res.userInfo.gender,
                    language: res.userInfo.language,
                  },
                  bType: "warn",
                  actionText: "退出登录"
                },
                success: function(res){
                  console.log("存储成功")
                }
              })
            }     
          })
        }
      })
    // 如果已经登录，退出登录按钮操作     
    }else{
      wx.showModal({
        title: "确认退出?",
        content: "退出后将不能使用ShareE",
        success: (res) => {
          if(res.confirm){
            console.log("确定")
            // 退出登录则移除本地用户信息
            wx.removeStorageSync('userInfo')
            this.setData({
              userInfo: {
                avatarUrl: "",
                nickName: "未登录"
              },
              bType: "primary",
              actionText: "登录"
            })
          }else {
            console.log("cancel")
            this.setData({
              lock: true
            })
          }
        }
      })
    }   
  },
// 跳转至钱包
  movetoWallet: function(){
    wx.navigateTo({
      url: '../wallet/index'
    })
  },
  // 跳转至大喇叭
  movetoHorn: function () {
    wx.navigateTo({
      url: '../horn/index'
    })
  },
  movetofbtask: function () {
    wx.redirectTo({
      url: '../fbtask/index',
    })
  },
  // 跳转到接单页面
  movetoJiedan: function () {
    // 关闭当前页面，跳转到指定页面，返回时将不会回到当前页面
    wx.redirectTo({
      url: '../histask/index'
    })
  },
  // 跳转至address
  movetoAddr: function () {
    wx.navigateTo({
      url: '../hisaddr/index'
    })
  },
// 跳转至记录
  movetoRecords: function(){
    wx.navigateTo({
      url: '../Records/index'
    })
  },
  // 跳转到附近的任务页面
  movetoNearOrders: function(){
    wx.navigateTo({
      url: '../nearorders/index'
    })
  },
})
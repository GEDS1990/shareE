//index.js
const AV = require('../../utils/av-weapp-min.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    scale: 18,
    latitude: 0,
    longitude: 0,
    markers: "",
    userIconPath: '/images/userlogo3.png',
    windowWidth: '',
    windowHeight: '',
  },
  // 页面加载
  onLoad: function (options) {
    // 1.获取定时器，用于判断是否已经在计费
    this.timer = options.timer;
    this.address = options.address; 
    if (this.address != null) {
      console.log("手动选择位置");
      this.setData({
        longitude: app.globalData.longitude,
        latitude: app.globalData.curlatitude,
      });
      //this.reqBaoBei();
    } else {
      console.log("自动选择位置");
      // 2.获取并设置当前位置经纬度
      wx.getLocation({
        type: "gcj02",
        success: (res) => {
          this.setData({
            longitude: res.longitude,
            latitude: res.latitude
          });
          app.globalData.curlatitude = res.latitude;
          app.globalData.curlongitude = res.longitude;
          console.log("当前定位：" + app.globalData.curlatitude + "/" + app.globalData.curlongitude);
          //this.reqBaoBei();
        }
      });
    }
    // 3.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,          
        })
        this.setData({
          controls: [{
            id: 1,
            iconPath: '/images/location.png',
            position: {
              left: 20,
              top: this.data.windowHeight - 60,
              width: 25,
              height: 25
            },
            clickable: true
          },
          {
            id: 2,
            iconPath: '/images/deploy.png',
            position: {
              left: this.data.windowWidth / 2 - 45,
              top: this.data.windowHeight - 100,
              width: 90,
              height: 90
            },
            clickable: true,
          },
          {
            id: 3,
            iconPath: '/images/warn1.png',
            position: {
              left: this.data.windowWidth - 70,
              top: this.data.windowHeight - 60,
              width: 25,
              height: 25
            },
            clickable: true
          },
          // {
          //   id: 4,
          //   iconPath: '/images/marker.png',
          //   position: {
          //     left: this.data.windowWidth / 2 - 11,
          //     top: this.data.windowHeight / 2 - 45,
          //     width: 22,
          //     height: 45
          //   },
          //   clickable: true
          // },
          {
            id: 5,
            iconPath: this.data.userIconPath,
            position: {
              left: this.data.windowWidth - 68,
              top: this.data.windowHeight - 135,
              width: 45,
              height: 45
            },
            clickable: true
          }]
        })
      }
    });
    // 4.请求服务器，显示附近的宝贝，用marker标记

  },
  reqBaoBei: function () {
    //4.
    wx.request({
      url: app.apiUrl +'/mapControl/getLoc',
      // url: 'app.apiUrl+/mapControl/getLoc',
      // url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
      data: {
        curLatitude: app.globalData.curlatitude,
        curLongitude: app.globalData.curlongitude,
        range: 0
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: (res) => {
        console.log("res size:" + res.data.length);
        /////////
        this.setData({
          markers: res.data
        })
      },
      fail: function (res) {
        // fail
        console.log("fail");
      },
      complete: function (res) {
        // complete
        // console.log("complete");
      }
    })
  },
  // 页面显示
  onShow: function () {
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("ShareEMap");
    // this.movetoPosition()
  },
  // 地图控件点击事件
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.movetoPositionCenter();
        break;
      // 点击拍照，长按语音输入
      case 2: if (true) {
        wx.getStorage({
          key: 'userInfo',
          success: function (res) {
            app.userInfo.avatarUrl = res.data.userInfo.avatarUrl;
            app.userInfo.nickName = res.data.userInfo.nickName;
            wx.navigateTo({
              url: '../deploy/index',
              success: function (res) {

              }
            });
          },
          fail: function (res) {
            wx.navigateTo({
              url: '../my/index',
              success: function (res) {
              }
            });
          }
        })
      } else {
        wx.startRecord({

        })
      }
        break;
      // 点击保障控件，跳转到报障页
      case 3: 
        wx.getStorage({
          key: 'userInfo',
          success: function (res) {
            app.userInfo.avatarUrl = res.data.userInfo.avatarUrl;
            app.userInfo.nickName = res.data.userInfo.nickName;
            if (null != res.data.userInfo.avatarUrl) {
              wx.navigateTo({
                url: '../warn/index',
                success: function (res) {

                }
              });
            } else {
              //跳转登录页面
              wx.login({
                success: (res) => {
                  debugger;
                  console.log("login res:{}",res);
                  wx.hideLoading();
                }
              })
          }
          },
          fail: function (res) {
            wx.navigateTo({
              url: '../my/index',
              success: function (res) {
              }
            });
          }
        });
        break;
      // 点击maker
      case 4:
        wx.showModal({
          title: '寄件位置信息',
          content: app.globalData.curname + ":" + app.globalData.curtaddress,
        })
        break;
      // 点击头像控件，跳转到个人中心
      case 5:
        wx.getStorage({
          key: 'userInfo',
          success: function (res) {
            app.userInfo = res.data.userInfo;
            if (null != res.data.userInfo.avatarUrl) {
              wx.navigateTo({
                url: '../my/index'
              });
            } else {
              //跳转登录页面
              wx.login({
                success: (res) => {
                  debugger;
                  wx.hideLoading();
                }
              })
            }
          },
          fail: function (res) {
            wx.navigateTo({
              url: '../my/index',
              success: function (res) {
              }
            });
          }
        });
        break;
      default: break;
    }
  },
  // 地图视野改变事件
  bindregionchange: function (e) {
    // 拖动地图
    if (e.type == "begin") {
      wx.request({
        url: app.apiUrl +'/mapControl/getLoc',
        // url: 'app.apiUrl+/mapControl/getLoc',
        // url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
        data: {
          curLatitude: app.globalData.curlatitude,
          curLongitude: app.globalData.curlongitude,
          range: 0
        },
        method: 'GET',
        success: (res) => {
          this.setData({
            markers: res.data
          })
        },
        fail: (res) => {
        },
        complete: (res) => {
        }
      })
      // 停止拖动，显示单车位置
    } else if (e.type == "end") {
      // this.setData({
      //   markers: this.data._markers
      // });
      this.reqBaoBei();
    }
  },
  // 地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap: function (e) {
    let _markers = this.data.markers;
    let markerId = e.markerId;
    let goodsId = _markers[markerId].goodsId;
    let status = _markers[markerId].status;
    if(status=="发布"){
      ////////
      wx.showModal({
        title: '宝贝描述',
        content: _markers[markerId].title,
        confirmText: "抢单",
        cancelText: "不接",
        success: (res) => {
          console.log("res.confirm:" + res.confirm);
          if (!res.confirm) {
            // 
          } else {
            wx.getStorage({
              key: 'userInfo',
              success: function (res) {
                app.userInfo.avatarUrl = res.data.userInfo.avatarUrl;
                app.userInfo.nickName = res.data.userInfo.nickName;
                if (null != res.data.userInfo.avatarUrl) {
                  wx.request({
                    url: app.apiUrl + '/mapControl/jiedan',
                    data: {
                      goodsId: goodsId,
                      qishiId: res.data.userInfo.avatarUrl,
                      qishiNickName: res.data.userInfo.nickName
                    },
                    method: 'POST', // POST
                    // header: {}, // 设置请求的 header
                    success: function (res) {
                      wx.showToast({
                        title: "success",
                        icon: 'success',
                        duration: 2000
                      });
                      wx.navigateTo({
                        url: '../index/index'
                      });
                    }
                  })
                } else {
                  //跳转登录页面
                  wx.login({
                    success: (res) => {
                      debugger;
                      wx.hideLoading();
                    }
                  })
                }
              },
              fail: function (res) {
                wx.navigateTo({
                  url: '../my/index',
                  success: function (res) {
                  }
                });
              }
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '状态',
        content: '已被抢单',
      })
    }
  },
  //移动选点
  // moveSelectLocation: function () {
  //   var that = this;
  //   wx.chooseLocation({
  //     success: function (res) {
  //       let mobileLocation = {
  //         longitude: res.longitude,
  //         latitude: res.latitude,
  //         address: res.address,
  //       };
  //       that.setData({
  //         mobileLocation: mobileLocation,
  //       });
  //     },
  //     fail: function (err) {
  //       console.log(err)
  //     }
  //   });
  // },
  // 定位函数，移动位置到地图中心
  movetoPositionCenter: function () {
    this.mapCtx.moveToLocation();
  },
  movetoPosition: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        app.globalData.curlatitude = res.latitude;
        app.globalData.curlongitude = res.longitude;
        app.globalData.curtaddress = res.address;
        app.globalData.curname = res.name;
        console.log("curlatitude:" + app.globalData.curlatitude);
        console.log("curlongitude:" + app.globalData.curlongitude);
      },
      fail: function (err) {
        console.log(err)
      }
    });

    // this.mapCtx.moveToLocation();
  }
})

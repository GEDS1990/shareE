// pages/scanresult/index.js
//获取应用实例
var app = getApp()
const AV = require('../../utils/av-weapp-min.js');
Page({
  data: {
    // 故障车周围环境图路径数组
    picUrls: [],
    // 故障车编号和备注
    inputValue: {
      num: 0,
      desc: "",
      target: "",
      telTo: "",
      money:""
    },
    btnBgc: "#008800",
    // 选取图片提示
    actionText: "拍照/相册",
    scale: 18,
    latitude: 0,
    longitude: 0,
    imgTempFilePaths: "",
  },
  // 页面加载
  onLoad: function (options) {
    // 设置本页导航标题
    wx.setNavigationBarTitle({
      title: '发布宝贝'
    }),
    // // 获取宝贝图片
    // this.setData({
    //   imgTempFilePaths: options.imgTempFilePaths
    // }),
      // 2.获取并设置当前位置经纬度
      wx.getLocation({
        type: "gcj02",
        success: (res) => {
          this.setData({
            longitude: res.longitude,
            latitude: res.latitude
          });
        }
      });
    // let _picUrls = options.imgTempFilePaths;
    // this.setData({
    //   picUrls: _picUrls
    // }),
    // 3.设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '/images/location.png',
            position: {
              left: res.windowWidth / 2 - 12-50,
              top: res.windowHeight / 2 - 222+50,
              width:40,
              height: 40
            },
            clickable: true
          },
          {
            id: 4,
            iconPath: '/images/marker.png',
            position: {
              left: res.windowWidth / 2 - 12,
              top: res.windowHeight / 2 - 222,
              width: 22,
              height: 45
            },
            clickable: true
          }
          ]
        })
      }
    });
  },
// 页面显示
  onShow: function () {
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("ShareEMap");
    // this.movetoPosition()
  },
  // 输入目的地，存入inputValue
  targetChange: function (e) {
    this.setData({
      inputValue: {
        target: e.detail.value,
        desc: this.data.inputValue.desc,
        telTo: this.data.inputValue.telTo,
        money: this.data.inputValue.money
      }
    })
  },
  
  // 输入备注，存入inputValue
  descChange: function (e) {
    this.setData({
      inputValue: {
        target: this.data.inputValue.target,
        desc: e.detail.value,
        telTo: this.data.inputValue.telTo,
        money: this.data.inputValue.money
      }
    })
  },
  // 输入telTo，存入inputValue
  telToChange: function (e) {
    this.setData({
      inputValue: {
        target: this.data.inputValue.target,
        telTo: e.detail.value,
        desc: this.data.inputValue.desc,
        money: this.data.inputValue.money
      }
    })
  },
  // 输入，存入inputValue
  moneyChange: function (e) {
    this.setData({
      inputValue: {
        target: this.data.inputValue.target,
        desc: this.data.inputValue.desc,
        telTo: this.data.inputValue.telTo,
        money: e.detail.value
      }
    })
  },
  // 提交到服务器
  formSubmit: function (e) {
    wx.showModal({
      title: "确认宝贝信息",
      content: '目的地：' + this.data.inputValue.target 
        + ' 奖励：' + this.data.inputValue.money,
      confirmText: "确认",
      cancelText: "修改",
      success: (res) => {
        console.log("res.confirm:" + res.confirm);
        if (!res.confirm) {
          // 继续填
        } else {
          wx.request({
            url: 'https://www.shzhyun.com/mapControl/addLoc',
            method: 'POST',
            data: {
              userId: app.userInfo.nickName,
              title: "目的地-" + this.data.inputValue.target,
              goodsId: "goodsId-" + Date.toString,
              money: this.data.inputValue.money,
              telFrom: 0,
              telTo: 0,
              status: 0,
              fabutype: 0,
              latitudeFrom: app.globalData.curlatitude,
              longitudeFrom: app.globalData.curlongitude,
              latitudeTo: app.globalData.targetlatitude, 
              longitudeTo: app.globalData.targetlongitude,
              iconPath: this.data.imgTempFilePaths,
              width: "5px",
              height: "5px"
            },
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
        }
      }
    })

  },
  // 选择宝贝拍照或选择相册
  bindCamera: function () {
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tfps = res.tempFilePaths;
        this.data.imgTempFilePaths = tfps[0];
        let _picUrls = this.data.picUrls;
        for (let item of tfps) {
          _picUrls.push(item);
          this.setData({
            picUrls: _picUrls,
            actionText: "+"
          });
        };
        var tempFilePath = res.tempFilePaths[0];
        new AV.File('pictrue', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => console.log(file.url())
          ).catch(console.error);
      }
    })
  },
  // 删除选择的宝贝图
  delPic: function (e) {
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index, 1);
    this.setData({
      picUrls: _picUrls
    })
  },
  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        app.globalData.targetlatitude = res.latitude;
        app.globalData.targetlongitude = res.longitude;
        app.globalData.targetaddress = res.address;
        app.globalData.targetname = res.name;
      },
      fail: function (err) {
        console.log(err)
      }
    });
    // this.mapCtx.moveToLocation();
  },
  // 地图控件点击事件
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.movetoPosition();
        break;
      // 点击maker
      case 4:
        wx.showModal({
          title: '目标位置信息',
          content: app.globalData.targetname + ":" + app.globalData.targettaddress,
        })
        break;
      default: break;
    }
  },

})